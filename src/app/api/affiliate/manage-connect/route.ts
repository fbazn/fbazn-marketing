import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-admin'
import { createRouteClient } from '@/lib/supabase-server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST() {
  const supabaseAuth = await createRouteClient()
  const { data: { user } } = await supabaseAuth.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  }

  const supabase = createAdminClient()
  const { data: affiliate } = await supabase
    .from('affiliates')
    .select('stripe_connect_account_id')
    .eq('user_id', user.id)
    .single()

  if (!affiliate?.stripe_connect_account_id) {
    return NextResponse.json({ error: 'No Stripe account connected' }, { status: 400 })
  }

  try {
    const session = await stripe.accountSessions.create({
      account: affiliate.stripe_connect_account_id,
      components: {
        account_management: { enabled: true },
      },
    })
    return NextResponse.json({ clientSecret: session.client_secret })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Stripe error'
    console.error('[manage-connect] Stripe error:', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
