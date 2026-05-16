import { NextRequest, NextResponse } from 'next/server'

const AUTH_TOKEN = process.env.REDDIT_MONITOR_SECRET

export async function GET(request: NextRequest) {
  const token = request.headers.get('x-auth-token')
  if (!token || token !== AUTH_TOKEN) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  }

  try {
    const response = await fetch(
      'https://www.reddit.com/r/FulfillmentByAmazon+AmazonSeller+amazonsellers/new.json?limit=50',
      {
        headers: {
          'User-Agent': 'script:fbazn-monitor:v1.0 (by /u/ArbitrageAndy_UK)',
        },
        next: { revalidate: 0 },
      }
    )

    if (!response.ok) {
      return NextResponse.json(
        { error: `Reddit returned ${response.status}` },
        { status: 502 }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
