import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-admin'
import { sanitiseCode } from '@/lib/affiliate'

export async function POST(request: NextRequest) {
  const { full_name, email, password, code, linkExisting } = await request.json()

  const cleanCode = sanitiseCode(code)
  if (cleanCode.length < 2) {
    return NextResponse.json({ error: 'Code must be at least 2 characters.' }, { status: 400 })
  }

  const supabase = createAdminClient()

  // Check code is not taken
  const { data: codeConflict } = await supabase
    .from('affiliates')
    .select('id')
    .eq('code', cleanCode)
    .single()

  if (codeConflict) {
    return NextResponse.json({ error: 'That referral code is already taken.' }, { status: 409 })
  }

  // ── Link existing FBAZN user to affiliate ──────────────────────────────────
  if (linkExisting) {
    const authHeader = request.headers.get('Authorization')
    const token = authHeader?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 })
    }

    // Verify the session token and get the user
    const { data: { user }, error: userError } = await supabase.auth.getUser(token)
    if (userError || !user) {
      return NextResponse.json({ error: 'Session invalid. Please sign in again.' }, { status: 401 })
    }

    // Check they don't already have an affiliate account
    const { data: alreadyAffiliate } = await supabase
      .from('affiliates')
      .select('id')
      .eq('user_id', user.id)
      .maybeSingle()

    if (alreadyAffiliate) {
      return NextResponse.json({ error: 'You already have an affiliate account.' }, { status: 409 })
    }

    const { error: insertError } = await supabase.from('affiliates').insert({
      user_id: user.id,
      email: user.email,
      full_name,
      code: cleanCode,
    })

    if (insertError) {
      return NextResponse.json({ error: 'Failed to create affiliate profile.' }, { status: 500 })
    }

    return NextResponse.json({ success: true, code: cleanCode })
  }

  // ── New user registration ──────────────────────────────────────────────────
  if (!full_name || !email || !password) {
    return NextResponse.json({ error: 'All fields are required.' }, { status: 400 })
  }

  // Create Supabase auth user
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  })

  if (authError || !authData.user) {
    // Email already exists in auth.users — signal the frontend to show link flow
    if (authError?.message?.toLowerCase().includes('already registered') ||
        authError?.message?.toLowerCase().includes('already been registered')) {
      return NextResponse.json({ existingUser: true })
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
