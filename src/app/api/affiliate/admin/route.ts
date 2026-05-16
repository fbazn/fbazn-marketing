import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-admin'
import { createRouteClient } from '@/lib/supabase-server'

const ADMIN_EMAIL = process.env.AFFILIATE_ADMIN_EMAIL

async function verifyAdmin(): Promise<boolean> {
  const supabaseAuth = await createRouteClient()
  const { data: { user } } = await supabaseAuth.auth.getUser()
  return !!user && user.email === ADMIN_EMAIL
}

export async function GET(request: NextRequest) {
  if (!await verifyAdmin()) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  }

  const supabase = createAdminClient()
  const view = request.nextUrl.searchParams.get('view') ?? 'overview'

  if (view === 'overview') {
    const [affiliatesRes, referralsRes, upcomingRes, commissionsRes] = await Promise.all([
      supabase.from('affiliates').select('*').order('created_at', { ascending: false }),
      supabase.from('affiliate_referrals').select('*').order('created_at', { ascending: false }).limit(50),
      supabase.from('affiliate_payouts').select(`*, affiliates(full_name, code)`).eq('status', 'scheduled').order('scheduled_for'),
      supabase.from('affiliate_commissions').select('status, commission_amount').in('status', ['pending', 'approved']),
    ])

    const pendingCommissionTotal = commissionsRes.data
      ?.filter(c => c.status === 'pending')
      .reduce((s, c) => s + c.commission_amount, 0) ?? 0

    const approvedCommissionTotal = commissionsRes.data
      ?.filter(c => c.status === 'approved')
      .reduce((s, c) => s + c.commission_amount, 0) ?? 0

    return NextResponse.json({
      affiliates: affiliatesRes.data ?? [],
      recentReferrals: referralsRes.data ?? [],
      upcomingPayouts: upcomingRes.data ?? [],
      summary: {
        totalAffiliates: affiliatesRes.data?.length ?? 0,
        activeAffiliates: affiliatesRes.data?.filter(a => a.status === 'active').length ?? 0,
        pendingCommissions: pendingCommissionTotal,
        approvedCommissions: approvedCommissionTotal,
      },
    })
  }

  if (view === 'leaderboard') {
    const { data } = await supabase
      .from('affiliate_leaderboard')
      .select('*')
      .order('rank')
      .limit(50)
    return NextResponse.json({ leaderboard: data ?? [] })
  }

  return NextResponse.json({ error: 'Unknown view' }, { status: 400 })
}

export async function PATCH(request: NextRequest) {
  if (!await verifyAdmin()) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  }

  const { affiliateId, action } = await request.json()
  if (!affiliateId || !action) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  const supabase = createAdminClient()

  if (action === 'suspend') {
    await supabase.from('affiliates').update({ status: 'suspended' }).eq('id', affiliateId)
  } else if (action === 'activate') {
    await supabase.from('affiliates').update({ status: 'active' }).eq('id', affiliateId)
  } else if (action === 'approve_referral') {
    const { referralId } = await request.json()
    await supabase
      .from('affiliate_referrals')
      .update({ status: 'approved', approved_at: new Date().toISOString() })
      .eq('id', referralId)
    await supabase
      .from('affiliate_commissions')
      .update({ status: 'approved' })
      .eq('referral_id', referralId)
  }

  return NextResponse.json({ success: true })
}
