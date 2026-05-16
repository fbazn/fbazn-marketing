import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createAdminClient } from '@/lib/supabase-admin'
import { getPlanAmount, HOLD_DAYS } from '@/lib/affiliate'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET_AFFILIATE!

export async function POST(request: NextRequest) {
  const body = await request.text()
  const sig = request.headers.get('stripe-signature')!

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret)
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const supabase = createAdminClient()

  if (event.type === 'invoice.payment_succeeded') {
    const invoice = event.data.object as Stripe.Invoice
    const customerId = typeof invoice.customer === 'string' ? invoice.customer : invoice.customer?.id
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const subscriptionId = typeof (invoice as any).subscription === 'string' ? (invoice as any).subscription as string : null

    if (!customerId || !subscriptionId) return NextResponse.json({ received: true })

    // Only act on the first successful payment (billing_reason = subscription_create)
    if (invoice.billing_reason !== 'subscription_create') return NextResponse.json({ received: true })

    // Find the referral for this customer
    const { data: referral } = await supabase
      .from('affiliate_referrals')
      .select('id, affiliate_id, status, plan, plan_amount')
      .eq('stripe_customer_id', customerId)
      .eq('status', 'pending')
      .single()

    if (!referral) return NextResponse.json({ received: true })

    // Determine plan from subscription
    const subscription = await stripe.subscriptions.retrieve(subscriptionId)
    const priceAmount = (subscription.items.data[0]?.price.unit_amount ?? 0) / 100

    let plan = referral.plan
    if (!plan) {
      if (priceAmount <= 10) plan = 'starter'
      else if (priceAmount <= 25) plan = 'pro'
      else plan = 'business'
    }

    const grossAmount = getPlanAmount(plan)
    const now = new Date()
    const holdUntil = new Date(now)
    holdUntil.setDate(holdUntil.getDate() + HOLD_DAYS)

    await supabase
      .from('affiliate_referrals')
      .update({
        stripe_subscription_id: subscriptionId,
        plan,
        plan_amount: grossAmount,
        first_payment_at: now.toISOString(),
        hold_until: holdUntil.toISOString(),
      })
      .eq('id', referral.id)

    // Create commission row for month 1 (rate applied at payout time when rank is known)
    const commissionMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    await supabase.from('affiliate_commissions').insert({
      referral_id: referral.id,
      affiliate_id: referral.affiliate_id,
      month_number: 1,
      commission_month: commissionMonth.toISOString().split('T')[0],
      gross_amount: grossAmount,
      rate_applied: 0.20, // base rate — boosted at payout time
      commission_amount: grossAmount * 0.20,
      status: 'pending',
    })
  }

  if (event.type === 'customer.subscription.deleted') {
    const sub = event.data.object as Stripe.Subscription
    const customerId = typeof sub.customer === 'string' ? sub.customer : sub.customer?.id

    if (!customerId) return NextResponse.json({ received: true })

    const { data: referral } = await supabase
      .from('affiliate_referrals')
      .select('id, hold_until, status')
      .eq('stripe_customer_id', customerId)
      .eq('status', 'pending')
      .single()

    if (!referral) return NextResponse.json({ received: true })

    // Only cancel if still within hold period
    const holdUntil = referral.hold_until ? new Date(referral.hold_until) : null
    if (holdUntil && new Date() < holdUntil) {
      await supabase
        .from('affiliate_referrals')
        .update({ status: 'cancelled' })
        .eq('id', referral.id)

      // Delete pending commission row
      await supabase
        .from('affiliate_commissions')
        .delete()
        .eq('referral_id', referral.id)
        .eq('status', 'pending')
    }
  }

  return NextResponse.json({ received: true })
}
