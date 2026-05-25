// lib/supabase.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const isSupabaseConfigured = 
  supabaseUrl && 
  supabaseUrl !== 'your_supabase_url_here' && 
  supabaseUrl.trim() !== '' &&
  supabaseAnonKey &&
  supabaseAnonKey !== 'your_supabase_anon_key_here' &&
  supabaseAnonKey.trim() !== ''

// Create real client only if configured, otherwise create a mock proxy object to prevent crash
export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null

// Initial premium mock articles
const DEFAULT_MOCK_ARTICLES = [
  {
    id: 1,
    title: "Claude 3.5 Sonnet Redefines Coding: The New Industry Standard",
    excerpt: "Anthropic's latest model achieves historic breakthroughs in software engineering, outperforming competitors in reasoning and coding benchmarks.",
    content: "Anthropic has officially released Claude 3.5 Sonnet, setting a new industry benchmark for graduate-level reasoning, undergraduate-level knowledge, and coding proficiency. In comprehensive tests, the model demonstrates a dramatic improvement in understanding nuance, humor, and complex instructions, and is exceptionally good at writing, editing, and translating code.\n\nDevelopers around the world are reporting 2-3x productivity boosts, particularly when using Sonnet for codebase analysis, refactoring, and automated test generation. The model's large 200k context window allows it to process entire project directories, making it an invaluable partner for pair-programming and complex software architecture planning.",
    category: "AI Tools",
    image_url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80",
    slug: "claude-3-5-sonnet-redefines-coding",
    source_url: "https://anthropic.com",
    published_at: new Date(Date.now() - 3600000 * 3).toISOString(), // 3 hours ago
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 2,
    title: "Apple Vision Pro: A Deep Dive Into Spatial Computing's Future",
    excerpt: "We spent 30 days living inside Apple's revolutionary headset. Here is the honest truth about productivity, entertainment, and fatigue.",
    content: "Apple's entry into the spatial computing arena, the Vision Pro, represents a massive leap forward in display technology and hand-eye tracking. With dual micro-OLED displays boasting more pixels than a 4K TV for each eye, the visual clarity is absolutely stunning. Text is razor-sharp, and movie watching feels like sitting in a private theater.\n\nHowever, after a month of daily usage, the weight of the device (around 650 grams) remains a noticeable bottleneck for long-term productivity. While working with multiple virtual screens is incredibly futuristic, the physical fatigue makes it hard to recommend as a full 8-hour desktop replacement just yet. Nevertheless, as a first-generation product, it sets an unbelievably high bar for the industry.",
    category: "Tech Devices",
    image_url: "https://images.unsplash.com/photo-1608248597481-496100c80836?w=800&auto=format&fit=crop&q=80",
    slug: "apple-vision-pro-deep-dive",
    source_url: "https://apple.com",
    published_at: new Date(Date.now() - 3600000 * 12).toISOString(), // 12 hours ago
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 3,
    title: "The Rise of Decentralized AI: Why Open Source is Winning the Race",
    excerpt: "As tech giants lock down proprietary models, a global community of open-source developers is building faster, cheaper alternatives.",
    content: "While OpenAI and Google continue to build massive proprietary LLMs behind closed walls, the open-source AI community is experiencing an unprecedented renaissance. Led by models like Meta's Llama 3, Mistral AI, and community-driven fine-tunes on Hugging Face, developers are proving that smaller, highly-optimized models can compete directly with multi-billion dollar giants.\n\nThe main advantages of decentralized, open-source AI are privacy, customizability, and cost. Companies can host models on their own infrastructure, ensuring sensitive data never leaves their servers, while fine-tuning on specific domains allows these models to outperform generalist models at a fraction of the operational cost.",
    category: "Industry News",
    image_url: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80",
    slug: "rise-of-decentralized-ai-open-source",
    source_url: "https://huggingface.co",
    published_at: new Date(Date.now() - 3600000 * 24).toISOString(), // 1 day ago
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 4,
    title: "Mastering Next.js 14 App Router: A Comprehensive Performance Guide",
    excerpt: "Learn how to leverage Server Components, streaming, and advanced caching to build lightning-fast web applications.",
    content: "Next.js 14 has completely transformed modern web development with the stable introduction of the App Router and React Server Components. By moving components to the server by default, Next.js dramatically reduces the JavaScript bundle size sent to the client, leading to instant load times and perfect SEO scores.\n\nIn this guide, we dive deep into optimizing your Next.js application. We cover the difference between Static and Dynamic rendering, how to implement streaming with Suspense boundaries, and how to configure the Next.js Data Cache to minimize external database calls. Following these best practices will ensure your applications are optimized for Core Web Vitals and provide an elite user experience.",
    category: "Tutorials",
    image_url: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80",
    slug: "mastering-nextjs-14-app-router",
    source_url: "https://nextjs.org",
    published_at: new Date(Date.now() - 3600000 * 48).toISOString(), // 2 days ago
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
]

// Mock Database Helpers
const getMockData = () => {
  if (typeof window === 'undefined') return DEFAULT_MOCK_ARTICLES
  const data = localStorage.getItem('tech_pulse_articles')
  if (!data) {
    localStorage.setItem('tech_pulse_articles', JSON.stringify(DEFAULT_MOCK_ARTICLES))
    return DEFAULT_MOCK_ARTICLES
  }
  return JSON.parse(data)
}

const saveMockData = (articles) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('tech_pulse_articles', JSON.stringify(articles))
  }
}

// Check database mode helper (used in admin to render badge)
export const getDatabaseMode = () => {
  return isSupabaseConfigured ? 'supabase' : 'mock'
}

// Client-side helper functions
export const fetchArticles = async (limit = 10, offset = 0, category = 'All') => {
  if (isSupabaseConfigured) {
    try {
      let query = supabase
        .from('articles')
        .select('*')
        .order('published_at', { ascending: false })
      
      if (category && category !== 'All') {
        query = query.eq('category', category)
      }
      
      const { data, error } = await query.range(offset, offset + limit - 1)
      return { data, error }
    } catch (e) {
      console.warn("Supabase fetch failed, falling back to mock", e)
    }
  }

  // Local/Mock Fallback Mode
  console.log("🔌 Running in [Mock Mode]: Data loaded from local storage.")
  const allArticles = getMockData()
  const filtered = category === 'All' 
    ? allArticles 
    : allArticles.filter(a => a.category.toLowerCase() === category.toLowerCase())
  
  // Sort by published_at desc
  const sorted = [...filtered].sort((a, b) => new Date(b.published_at) - new Date(a.published_at))
  const paginated = sorted.slice(offset, offset + limit)
  return { data: paginated, error: null }
}

export const fetchArticleBySlug = async (slug) => {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('slug', slug)
        .single()
      return { data, error }
    } catch (e) {
      console.warn("Supabase fetchBySlug failed, falling back to mock", e)
    }
  }

  const allArticles = getMockData()
  const article = allArticles.find(a => a.slug === slug)
  return { data: article || null, error: article ? null : new Error("Article not found") }
}

export const createArticle = async (article) => {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('articles')
        .insert([article])
        .select()
      return { data, error }
    } catch (e) {
      console.error("Supabase insert failed", e)
      throw e
    }
  }

  const allArticles = getMockData()
  const newArticle = {
    ...article,
    id: Date.now(),
    published_at: article.published_at || new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
  const updated = [newArticle, ...allArticles]
  saveMockData(updated)
  return { data: [newArticle], error: null }
}

export const updateArticle = async (id, article) => {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('articles')
        .update(article)
        .eq('id', id)
        .select()
      return { data, error }
    } catch (e) {
      console.error("Supabase update failed", e)
      throw e
    }
  }

  const allArticles = getMockData()
  const updated = allArticles.map(a => {
    if (a.id === Number(id) || a.id === id) {
      return { ...a, ...article, updated_at: new Date().toISOString() }
    }
    return a
  })
  saveMockData(updated)
  const modified = updated.find(a => a.id === Number(id) || a.id === id)
  return { data: [modified], error: null }
}

export const deleteArticle = async (id) => {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('articles')
        .delete()
        .eq('id', id)
      return { data, error }
    } catch (e) {
      console.error("Supabase delete failed", e)
      throw e
    }
  }

  const allArticles = getMockData()
  const filtered = allArticles.filter(a => a.id !== Number(id) && a.id !== id)
  saveMockData(filtered)
  return { data: null, error: null }
}

export const fetchCategories = async () => {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
      return { data, error }
    } catch (e) {
      console.warn("Supabase fetchCategories failed", e)
    }
  }

  const defaultCategories = [
    { id: 1, name: 'AI Tools' },
    { id: 2, name: 'Tech Devices' },
    { id: 3, name: 'Industry News' },
    { id: 4, name: 'Tutorials' }
  ]
  return { data: defaultCategories, error: null }
}
