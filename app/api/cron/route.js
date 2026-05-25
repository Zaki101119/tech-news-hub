// app/api/cron/route.js
import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import axios from 'axios'

export const dynamic = 'force-dynamic'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const isSupabaseConfigured = 
  supabaseUrl && 
  supabaseUrl !== 'your_supabase_url_here' && 
  supabaseUrl.trim() !== '' &&
  supabaseServiceKey &&
  supabaseServiceKey !== 'your_supabase_service_role_key_here' &&
  supabaseServiceKey.trim() !== ''

const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseServiceKey) 
  : null

const NEWS_API_KEY = process.env.NEWS_API_KEY

const generateSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

async function scrapeCategory(query, category) {
  if (!isSupabaseConfigured || !NEWS_API_KEY || NEWS_API_KEY === 'your_newsapi_key_here') {
    // Return mock successful scrape for local dry runs
    console.log(`🔌 [Mock Scrape]: Simulating scrape for category "${category}"`)
    return 1 // Return 1 simulated new article
  }

  try {
    const response = await axios.get('https://newsapi.org/v2/everything', {
      params: {
        q: query,
        sortBy: 'publishedAt',
        language: 'en',
        apiKey: NEWS_API_KEY,
        pageSize: 4,
      },
    })

    const articles = response.data.articles || []
    let addedCount = 0

    for (const article of articles) {
      if (!article.title || article.title.includes('[Removed]')) continue
      const slug = generateSlug(article.title)
      
      // Check if already exists
      const { data: existing } = await supabase
        .from('articles')
        .select('id')
        .eq('slug', slug)
        .single()

      if (!existing) {
        await supabase.from('articles').insert([
          {
            title: article.title,
            excerpt: article.description || article.title,
            content: article.content || article.description || article.title,
            category: category,
            image_url: article.urlToImage || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800',
            slug: slug,
            published_at: new Date().toISOString(),
            source_url: article.url,
          },
        ])
        addedCount++
      }
    }
    return addedCount
  } catch (error) {
    console.error(`Error scraping ${category}:`, error.message)
    return 0
  }
}

export async function GET(request) {
  // Verify authorization secret (if configured in production Vercel)
  const authHeader = request.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET
  
  if (
    cronSecret && 
    cronSecret !== 'your_cron_secret_here' &&
    authHeader !== `Bearer ${cronSecret}`
  ) {
    return new Response('Unauthorized', { status: 401 })
  }

  console.log('🚀 Triggering scheduled news scraping API...')

  const aiCount = await scrapeCategory('(AI OR "artificial intelligence" OR "machine learning")', 'AI Tools')
  const devCount = await scrapeCategory('(smartphone OR "tech device" OR gadget OR laptop OR tablet)', 'Tech Devices')
  const indCount = await scrapeCategory('technology OR startup OR innovation', 'Industry News')

  return NextResponse.json({
    success: true,
    mode: isSupabaseConfigured ? 'supabase production' : 'local mock simulation',
    timestamp: new Date().toISOString(),
    added: {
      'AI Tools': aiCount,
      'Tech Devices': devCount,
      'Industry News': indCount,
    }
  })
}
