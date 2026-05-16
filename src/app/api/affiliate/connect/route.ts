import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-admin'
import { createRouteClient } from '@/lib/supabase-server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(request: NextRequest) {
  const supabaseAuth = await createRouteClient()
  const { data: { user } } = await supabaseAuth.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  }

  const supabase = createAdminClient()
  const { data: affiliate } = await supabase
    .from('affiliates')
    .select('id, stripe_connect_account_id, stripe_connect_onboarded')
    .eq('user_id', user.id)
    .single()

  if (!affiliate) {
    return NextResponse.json({ error: 'Affiliate not found' }, { status: 404 })
  }

  let accountId = affiliate.stripe_connect_account_id

  if (!accountId) {
    const account = await stripe.accounts.create({
      type: 'express',
      country: 'GB',
      email: user.email,
      capabilities: { transfers: { requested: true } },
    })
    accountId = account.id

    await supabase
      .from('affiliates')
      .update({ stripe_connect_account_id: accountId })
      .eq('id', affiliate.id)
  }

  const origin = request.headers.get('origin') ?? 'https://fbazn.com'

  const accountLink = await stripe.accountLinks.create({
    account: accountId,
    refresh_url: `${origin}/affiliate/dashboard?connect=refresh`,
    return_url: `${origin}/affiliate/dashboard?connect=success`,
    type: 'account_onboarding',
  })

  return NextResponse.json({ url: accountLink.url })
}
