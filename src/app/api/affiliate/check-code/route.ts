import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-admin'
import { sanitiseCode } from '@/lib/affiliate'

export async function GET(request: NextRequest) {
  const raw = request.nextUrl.searchParams.get('code') ?? ''
  const code = sanitiseCode(raw)

  if (code.length < 2) {
    return NextResponse.json({ available: false, reason: 'Too short' })
  }

  const supabase = createAdminClient()
  const { data } = await supabase
    .from('affiliates')
    .select('id')
    .eq('code', code)
    .single()

  return NextResponse.json({ available: !data, code })
}
