const Parser = require('rss-parser')
const { createClient } = require('@supabase/supabase-js')
const slugify = require('slugify')
require('dotenv').config()

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const parser = new Parser()
const FEED_URL = 'https://developer-docs.amazon.com/amazon-shipping/changelog.rss' // You can test with this

async function run() {
  console.log('Fetching RSS feed...')
  const feed = await parser.parseURL(FEED_URL)

  for (const item of feed.items) {
    const slug = slugify(item.title || '', { lower: true, strict: true })

    const { error } = await supabase.from('rss_posts').upsert({
      slug,
      title: item.title,
      content: item.contentSnippet || item.content || '',
      link: item.link,
      published_at: item.pubDate ? new Date(item.pubDate) : new Date(),
      source: feed.title || 'RSS Feed',
    }, { onConflict: 'slug' })

    if (error) {
      console.error(`❌ Error inserting "${item.title}":`, error.message)
    } else {
      console.log(`✅ Inserted "${item.title}"`)
    }
  }

  console.log('All done.')
}

run()
