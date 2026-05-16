import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 30

const AUTH_TOKEN = process.env.REDDIT_MONITOR_SECRET

export async function GET(request: NextRequest) {
  const token = request.headers.get('x-auth-token')
  if (!token || token !== AUTH_TOKEN) {
    return NextResponse.json({ error: 'Unauthorised', envSet: Boolean(AUTH_TOKEN) }, { status: 401 })
  }

  const url = 'https://www.reddit.com/r/FulfillmentByAmazon+AmazonSeller+amazonsellers/new.json?limit=50'

  try {
    const start = Date.now()
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'script:fbazn-monitor:v1.0 (by /u/ArbitrageAndy_UK)',
        Accept: 'application/json',
      },
      cache: 'no-store',
    })
    const elapsed = Date.now() - start

    if (!response.ok) {
      const bodyText = (await response.text()).slice(0, 400)
      return NextResponse.json(
        {
          error: `Reddit returned ${response.status}`,
          elapsedMs: elapsed,
          bodySnippet: bodyText,
        },
        { status: 200 } // return 200 so we see the diagnostics through CF
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 200 }
    )
  }
}
