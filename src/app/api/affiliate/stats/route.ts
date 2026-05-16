import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-admin'
import { createRouteClient } from '@/lib/supabase-server'

export async function GET(_request: NextRequest) {
  const supabaseAuth = await createRouteClient()
  const { data: { user } } = await supabaseAuth.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  }

  const supabase = createAdminClient()

  const { data: affiliate } = await supabase
    .from('affiliates')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (!affiliate) {
    return NextResponse.json({ error: 'Not an affiliate' }, { status: 404 })
  }

  const [referralsRes, commissionsRes, payoutsRes, rankRes, clicksRes] = await Promise.all([
    supabase
      .from('affiliate_referrals')
      .select('*')
      .eq('affiliate_id', affiliate.id)
      .order('created_at', { ascending: false }),

    supabase
      .from('affiliate_commissions')
      .select('*')
      .eq('affiliate_id', affiliate.id)
      .order('commission_month', { ascending: false }),

    supabase
      .from('affiliate_payouts')
      .select('*')
      .eq('affiliate_id', affiliate.id)
      .order('scheduled_for', { ascending: false }),

    supabase
      .from('affiliate_leaderboard')
      .select('rank, total_referrals, total_revenue')
      .eq('id', affiliate.id)
      .single(),

    supabase
      .from('affiliate_clicks')
      .select('id', { count: 'exact', head: true })
      .eq('affiliate_id', affiliate.id),
  ])

  return NextResponse.json({
    affiliate,
    referrals: referralsRes.data ?? [],
    commissions: commissionsRes.data ?? [],
    payouts: payoutsRes.data ?? [],
    leaderboard: rankRes.data ?? { rank: null, total_referrals: 0, total_revenue: 0 },
    totalClicks: clicksRes.count ?? 0,
  })
}
