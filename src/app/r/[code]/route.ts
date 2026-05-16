import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-admin'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params
  const supabase = createAdminClient()

  const { data: affiliate } = await supabase
    .from('affiliates')
    .select('id')
    .eq('code', code.toUpperCase())
    .eq('status', 'active')
    .single()

  const destination = new URL('/', request.url)
  destination.hostname = 'fbazn.com'
  destination.protocol = 'https:'
  destination.port = ''

  const response = NextResponse.redirect(destination)

  if (affiliate) {
    // Record click
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ?? ''
    const ipHash = ip
      ? Buffer.from(ip).toString('base64').slice(0, 32)
      : null

    await supabase.from('affiliate_clicks').insert({
      affiliate_id: affiliate.id,
      ip_hash: ipHash,
      referrer: request.headers.get('referer') ?? null,
    })

    // Set referral cookies on .fbazn.com so app.fbazn.com can read them
    const maxAge = 60 * 60 * 24 * 30 // 30 days
    response.cookies.set('fbazn_ref', code.toUpperCase(), {
      domain: '.fbazn.com',
      maxAge,
      path: '/',
      sameSite: 'lax',
    })
    response.cookies.set('fbazn_ref_at', new Date().toISOString(), {
      domain: '.fbazn.com',
      maxAge,
      path: '/',
      sameSite: 'lax',
    })
  }

  return response
}
