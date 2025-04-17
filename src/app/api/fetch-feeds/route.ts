import { NextRequest, NextResponse } from 'next/server'
import Parser from 'rss-parser'
import { createClient } from '@supabase/supabase-js'
import slugify from 'slugify'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const FEED_URL = 'https://developer-docs.amazon.com/amazon-shipping/changelog.rss'
const parser = new Parser()

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET

  if (authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  try {
    console.log('📡 Fetching RSS feed...')
    const feed = await parser.parseURL(FEED_URL)

    for (const item of feed.items) {
      const slug = slugify(item.title || '', { lower: true, strict: true })

      const { error } = await supabase.from('rss_posts').upsert(
        {
          slug,
          title: item.title,
          content: item.contentSnippet || item.content || '',
          link: item.link,
          published_at: item.pubDate ? new Date(item.pubDate) : new Date(),
          source: feed.title || 'RSS Feed'
        },
        { onConflict: 'slug' }
      )

      if (error) {
        console.error(`❌ Error inserting "${item.title}":`, error.message)
      } else {
        console.log(`✅ Inserted "${item.title}"`)
      }
    }

    return NextResponse.json({ message: 'RSS feed processed' })
  } catch (err: any) {
    console.error('❌ Cron failed:', err.message)
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
  }
}
