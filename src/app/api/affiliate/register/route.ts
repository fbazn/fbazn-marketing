import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-admin'
import { sanitiseCode } from '@/lib/affiliate'

export async function POST(request: NextRequest) {
  const { full_name, email, password, code } = await request.json()

  if (!full_name || !email || !password || !code) {
    return NextResponse.json({ error: 'All fields are required.' }, { status: 400 })
  }

  const cleanCode = sanitiseCode(code)
  if (cleanCode.length < 2) {
    return NextResponse.json({ error: 'Code must be at least 2 characters.' }, { status: 400 })
  }

  const supabase = createAdminClient()

  // Check code is not taken
  const { data: existing } = await supabase
    .from('affiliates')
    .select('id')
    .eq('code', cleanCode)
    .single()

  if (existing) {
    return NextResponse.json({ error: 'That referral code is already taken.' }, { status: 409 })
  }

  // Create Supabase auth user
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  })

  if (authError || !authData.user) {
    if (authError?.message?.includes('already registered')) {
      return NextResponse.json({ error: 'An account with that email already exists.' }, { status: 409 })
    }
    return NextResponse.json({ error: 'Failed to create account. Please try again.' }, { status: 500 })
  }

  // Create affiliate record
  const { error: affiliateError } = await supabase.from('affiliates').insert({
    user_id: authData.user.id,
    email,
    full_name,
    code: cleanCode,
  })

  if (affiliateError) {
    // Roll back auth user
    await supabase.auth.admin.deleteUser(authData.user.id)
    return NextResponse.json({ error: 'Failed to create affiliate profile.' }, { status: 500 })
  }

  return NextResponse.json({ success: true, code: cleanCode })
}
