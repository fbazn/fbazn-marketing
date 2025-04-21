const Parser = require('rss-parser')
const { createClient } = require('@supabase/supabase-js')
const slugify = require('slugify')
require('dotenv').config()

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const parser = new Parser()

// ✅ Add as many FBA-related RSS feeds here as you'd like:
const FEED_URLS = [
  'https://developer-docs.amazon.com/amazon-shipping/changelog.rss',
  'https://www.junglescout.com/blog/feed/',
  'https://sellerengine.com/feed/',
  'https://channelx.world/tag/amazon/feed/',
  'https://www.repricerexpress.com/feed/',
  'https://www.webretailer.com/feed/',
  'https://www.ecomcrew.com/blog/feed/',
  'https://amzadvisers.com/feed/',
]

async function run() {
  console.log('🚀 Starting RSS fetch...');

  for (const url of FEED_URLS) {
    try {
      console.log(`🔗 Fetching feed: ${url}`);
      const feed = await parser.parseURL(url);

      for (const item of feed.items) {
        const slug = slugify(item.title || '', { lower: true, strict: true });

        const { error } = await supabase.from('rss_posts').upsert({
          slug,
          title: item.title,
          content: item.contentSnippet || item.content || '',
          link: item.link,
          published_at: item.pubDate ? new Date(item.pubDate) : new Date(),
          source: feed.title || new URL(url).hostname,
        }, { onConflict: 'slug' });

        if (error) {
          console.error(`❌ Error inserting "${item.title}":`, error.message);
        } else {
          console.log(`✅ Inserted "${item.title}"`);
        }
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      console.error(`❌ Failed to parse ${url}:`, message);
    }
  }

  console.log('🎉 All feeds processed.');
}

run();
