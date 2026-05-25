// scripts/generateNews.js
const axios = require('axios')
const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const NEWS_API_KEY = process.env.NEWS_API_KEY // Get from newsapi.org
const PRODUCTHUNT_API_KEY = process.env.PRODUCTHUNT_API_KEY // Get from producthunt.com

// Generate slug from title
const generateSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

// Fetch AI Tool News
async function fetchAIToolNews() {
  try {
    const response = await axios.get('https://newsapi.org/v2/everything', {
      params: {
        q: '(AI OR "artificial intelligence" OR "machine learning")',
        sortBy: 'publishedAt',
        language: 'en',
        apiKey: NEWS_API_KEY,
        pageSize: 5,
      },
    })

    const articles = response.data.articles.slice(0, 5)

    for (const article of articles) {
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
            category: 'AI Tools',
            image_url: article.urlToImage,
            slug: slug,
            published_at: new Date().toISOString(),
            source_url: article.url,
          },
        ])
        console.log(`✓ Added AI article: ${article.title}`)
      }
    }
  } catch (error) {
    console.error('Error fetching AI news:', error.message)
  }
}

// Fetch Tech Device News
async function fetchDeviceNews() {
  try {
    const response = await axios.get('https://newsapi.org/v2/everything', {
      params: {
        q: '(smartphone OR "tech device" OR gadget OR laptop OR tablet)',
        sortBy: 'publishedAt',
        language: 'en',
        apiKey: NEWS_API_KEY,
        pageSize: 5,
      },
    })

    const articles = response.data.articles.slice(0, 5)

    for (const article of articles) {
      const slug = generateSlug(article.title)
      
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
            category: 'Tech Devices',
            image_url: article.urlToImage,
            slug: slug,
            published_at: new Date().toISOString(),
            source_url: article.url,
          },
        ])
        console.log(`✓ Added device article: ${article.title}`)
      }
    }
  } catch (error) {
    console.error('Error fetching device news:', error.message)
  }
}

// Fetch Industry News
async function fetchIndustryNews() {
  try {
    const response = await axios.get('https://newsapi.org/v2/everything', {
      params: {
        q: 'technology OR startup OR innovation',
        sortBy: 'publishedAt',
        language: 'en',
        apiKey: NEWS_API_KEY,
        pageSize: 5,
      },
    })

    const articles = response.data.articles.slice(0, 5)

    for (const article of articles) {
      const slug = generateSlug(article.title)
      
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
            category: 'Industry News',
            image_url: article.urlToImage,
            slug: slug,
            published_at: new Date().toISOString(),
            source_url: article.url,
          },
        ])
        console.log(`✓ Added industry article: ${article.title}`)
      }
    }
  } catch (error) {
    console.error('Error fetching industry news:', error.message)
  }
}

// Run all fetches
async function main() {
  console.log('🚀 Starting automated news generation...')
  console.log(`⏰ ${new Date().toISOString()}`)

  await fetchAIToolNews()
  await fetchDeviceNews()
  await fetchIndustryNews()

  console.log('✅ News generation complete!')
  process.exit(0)
}

main().catch((error) => {
  console.error('Fatal error:', error)
  process.exit(1)
})
