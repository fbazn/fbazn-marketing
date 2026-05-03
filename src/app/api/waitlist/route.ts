import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
)

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({})) as { email?: string; plan?: string }
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
  const plan = body.plan

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Invalid email.' }, { status: 400 })
  }

  if (plan !== 'pro' && plan !== 'business') {
    return NextResponse.json({ error: 'Invalid plan.' }, { status: 400 })
  }

  const { error } = await supabase.from('waitlist').insert({ email, plan })

  if (error && error.code !== '23505') {
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
