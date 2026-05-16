# n8n Affiliate Workflows

Two workflows to create in n8n at https://n8n.fbazn.com

---

## 1. AffiliateApproval — runs daily at 9am

**Trigger:** Schedule (cron: `0 9 * * *`)

**Purpose:** Find referrals that have passed the 7-day hold and flip them to `approved`, then generate the next month's commission row.

### Nodes

**1. Postgres: Find pending referrals past hold**
```sql
SELECT
  r.id,
  r.affiliate_id,
  r.plan,
  r.plan_amount,
  r.commissions_remaining,
  r.first_payment_at
FROM affiliate_referrals r
WHERE r.status = 'pending'
  AND r.hold_until IS NOT NULL
  AND r.hold_until < NOW()
  AND r.first_payment_at IS NOT NULL
```

**2. IF: has referrals?**
- Continue if items > 0

**3. Loop Over Items**

**4. Postgres: Approve referral**
```sql
UPDATE affiliate_referrals
SET status = 'approved', approved_at = NOW()
WHERE id = '{{ $json.id }}'
```

**5. Postgres: Approve commission row for this referral**
```sql
UPDATE affiliate_commissions
SET status = 'approved'
WHERE referral_id = '{{ $json.id }}'
  AND status = 'pending'
```

**6. Postgres: Update affiliate balance**
```sql
UPDATE affiliates
SET
  balance_pending = GREATEST(0, balance_pending - commission_amount),
  balance_approved = balance_approved + commission_amount
FROM (
  SELECT SUM(commission_amount) AS commission_amount
  FROM affiliate_commissions
  WHERE referral_id = '{{ $json.id }}' AND status = 'approved'
) amounts
WHERE id = '{{ $json.affiliate_id }}'
```

---

## 2. AffiliateMonthlyPayout — runs on the 15th of each month at 10am

**Trigger:** Schedule (cron: `0 10 15 * *`)

**Purpose:**
1. Snapshot leaderboard and apply tier boosts to last month's commissions
2. Group approved commissions by affiliate
3. Check £20 minimum threshold
4. Create Stripe transfers
5. Mark commissions and payouts as paid
6. Send confirmation emails via Resend

### Nodes

**1. Function: Determine period month**
```js
const now = new Date()
const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
return [{
  json: {
    periodMonth: lastMonth.toISOString().split('T')[0],
    periodLabel: lastMonth.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })
  }
}]
```

**2. Postgres: Get leaderboard snapshot for last month**
```sql
SELECT
  id,
  full_name,
  code,
  rank,
  total_revenue
FROM affiliate_leaderboard
ORDER BY rank
```

**3. Function: Build rank → boost map**
```js
const boostMap = {}
for (const row of $input.all()) {
  const rank = row.json.rank
  const boost = rank <= 3 ? 0.05 : rank <= 5 ? 0.025 : rank <= 10 ? 0.01 : 0
  boostMap[row.json.id] = { boost, effectiveRate: 0.20 + boost }
}
return [{ json: { boostMap } }]
```

**4. Postgres: Get approved commissions for last month**
```sql
SELECT
  c.id AS commission_id,
  c.affiliate_id,
  c.referral_id,
  c.gross_amount,
  c.commission_amount,
  a.stripe_connect_account_id,
  a.stripe_connect_onboarded,
  a.full_name,
  a.email
FROM affiliate_commissions c
JOIN affiliates a ON a.id = c.affiliate_id
WHERE c.status = 'approved'
  AND c.commission_month = '{{ $json.periodMonth }}'
```

**5. Function: Apply boosts + group by affiliate**
```js
const boostMap = $('Function: Build rank → boost map').first().json.boostMap
const grouped = {}

for (const item of $input.all()) {
  const { affiliate_id, commission_id, gross_amount, stripe_connect_account_id,
          stripe_connect_onboarded, full_name, email } = item.json

  const { effectiveRate = 0.20 } = boostMap[affiliate_id] ?? {}
  const boostedAmount = parseFloat((gross_amount * effectiveRate).toFixed(2))

  if (!grouped[affiliate_id]) {
    grouped[affiliate_id] = {
      affiliate_id, full_name, email,
      stripe_connect_account_id, stripe_connect_onboarded,
      commissions: [], total: 0
    }
  }
  grouped[affiliate_id].commissions.push({ commission_id, boostedAmount, effectiveRate })
  grouped[affiliate_id].total += boostedAmount
}

return Object.values(grouped).map(g => ({ json: g }))
```

**6. IF: meets £20 minimum AND Stripe connected**
- Condition: `{{ $json.total >= 20 && $json.stripe_connect_onboarded === true }}`

**7. Stripe: Create Transfer** (HTTP Request node)
```
POST https://api.stripe.com/v1/transfers
Auth: Bearer {{ $env.STRIPE_SECRET_KEY }}
Body (form-urlencoded):
  amount={{ Math.round($json.total * 100) }}
  currency=gbp
  destination={{ $json.stripe_connect_account_id }}
  description=FBAZN affiliate payout - {{ $('Function: Determine period month').first().json.periodLabel }}
```

**8. Postgres: Create payout record**
```sql
INSERT INTO affiliate_payouts (affiliate_id, period_month, total_amount, commission_count, stripe_transfer_id, status, scheduled_for, paid_at)
VALUES (
  '{{ $json.affiliate_id }}',
  '{{ $('Function: Determine period month').first().json.periodMonth }}',
  {{ $json.total }},
  {{ $json.commissions.length }},
  '{{ $json.transfer_id }}',
  'paid',
  NOW()::date,
  NOW()
)
RETURNING id
```

**9. Postgres: Mark commissions as paid**
```sql
UPDATE affiliate_commissions
SET status = 'paid', payout_id = '{{ $json.id }}'
WHERE id = ANY(ARRAY['{{ $json.commissions.map(c => c.commission_id).join("','") }}']::uuid[])
```

**10. Postgres: Update affiliate balances**
```sql
UPDATE affiliates
SET
  balance_approved = GREATEST(0, balance_approved - {{ $json.total }}),
  total_earned = total_earned + {{ $json.total }}
WHERE id = '{{ $json.affiliate_id }}'
```

**11. Resend: Send payout email** (HTTP Request node)
```
POST https://api.resend.com/emails
Auth: Bearer {{ $env.RESEND_API_KEY }}
Body (JSON):
{
  "from": "hello@fbazn.com",
  "to": "{{ $json.email }}",
  "subject": "Your FBAZN affiliate payout is on its way — £{{ $json.total.toFixed(2) }}",
  "html": "<p>Hi {{ $json.full_name }},</p><p>Your payout of <strong>£{{ $json.total.toFixed(2) }}</strong> for {{ periodLabel }} is on its way via Stripe. It should arrive within 1–3 business days.</p><p>— FBAZN</p>"
}
```

---

## Monthly commission renewal (separate job or add to AffiliateMonthlyPayout)

After processing payouts, generate the next month's commission rows for all active referrals that still have `commissions_remaining > 0`:

```sql
-- Get referrals that need a new commission row next month
SELECT r.id, r.affiliate_id, r.plan, r.plan_amount, r.commissions_remaining,
       (12 - r.commissions_remaining + 1) AS next_month_number
FROM affiliate_referrals r
WHERE r.status = 'approved'
  AND r.commissions_remaining > 0
  AND NOT EXISTS (
    SELECT 1 FROM affiliate_commissions c
    WHERE c.referral_id = r.id
      AND c.commission_month = DATE_TRUNC('month', NOW())::date
  )
```

Then insert a new commission row for each with `status = 'pending'` and decrement `commissions_remaining`.

---

## Required env vars in n8n

| Variable | Value |
|----------|-------|
| `STRIPE_SECRET_KEY` | From Stripe dashboard |
| `RESEND_API_KEY` | `re_D5KMqrFo_7HbbUDAVxMrzuLyyocvpV4yg` |
| Supabase connection | Configure Postgres credential with the Supabase connection string |
