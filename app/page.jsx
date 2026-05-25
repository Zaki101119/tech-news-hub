// app/page.jsx
'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { fetchArticles } from '@/lib/supabase'
import { formatDistanceToNow } from 'date-fns'

export default function Home() {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [activeCategory, setActiveCategory] = useState('All')
  const [mounted, setMounted] = useState(false)

  // Prevent hydration mismatches
  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const loadArticles = async () => {
      setLoading(true)
      const { data } = await fetchArticles(9, page * 9, activeCategory)
      setArticles(data || [])
      setLoading(false)
    }
    loadArticles()
  }, [page, activeCategory])

  const safeFormatDistance = (dateString) => {
    if (!mounted) return 'some time ago'
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true })
    } catch (e) {
      return 'recently'
    }
  }

  const handleCategoryChange = (cat) => {
    setActiveCategory(cat)
    setPage(0)
  }

  return (
    <main className="min-h-screen pb-24 relative">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-6 animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
            Live Tech Scraper Active
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight">
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent text-shimmer">
              TechPulse Daily
            </span>
          </h1>
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed font-light">
            Stay ahead of the curve with spatial computing insights, state-of-the-art AI tooling reviews, and major technology paradigm shifts.
          </p>
        </div>
      </section>

      {/* Categories Toolbar */}
      <div className="max-w-6xl mx-auto px-4 mb-16 relative z-10">
        <div className="glass-panel p-2.5 rounded-2xl flex gap-2 overflow-x-auto scrollbar-none shadow-xl shadow-black/30 border border-slate-800/80">
          {['All', 'AI Tools', 'Tech Devices', 'Industry News', 'Tutorials'].map((cat) => {
            const isActive = activeCategory === cat
            return (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider whitespace-nowrap transition-all duration-300 ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-lg shadow-cyan-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                {cat}
              </button>
            )
          })}
        </div>
      </div>

      {/* Grid Section */}
      <section className="max-w-6xl mx-auto px-4 relative z-10">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-[420px] bg-slate-900/60 border border-slate-850 rounded-2xl animate-pulse flex flex-col justify-end p-6 gap-3">
                <div className="w-1/3 h-4 bg-slate-800 rounded"></div>
                <div className="w-full h-8 bg-slate-800 rounded"></div>
                <div className="w-2/3 h-4 bg-slate-800 rounded"></div>
              </div>
            ))}
          </div>
        ) : articles.length > 0 ? (
          <>
            {/* Featured Article - Interactive 3D Perspective */}
            {articles[0] && page === 0 && (
              <Link href={`/article/${articles[0].slug}`} className="block mb-16 card-perspective group">
                <div className="card-tilt glass-panel rounded-3xl overflow-hidden cursor-pointer border border-slate-800/80 hover:border-cyan-500/30 shadow-2xl shadow-black/50 p-4 md:p-6 grid grid-cols-1 md:grid-cols-12 gap-8">
                  <div className="relative h-64 md:h-[400px] md:col-span-7 rounded-2xl overflow-hidden shadow-inner shadow-black">
                    <Image
                      src={articles[0].image_url || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800'}
                      alt={articles[0].title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent"></div>
                    <span className="absolute top-4 left-4 bg-cyan-500/20 backdrop-blur-md border border-cyan-400/40 text-cyan-300 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg">
                      Featured
                    </span>
                  </div>
                  
                  <div className="flex flex-col justify-center md:col-span-5 pr-4 card-inner-3d">
                    <span className="text-indigo-400 text-xs font-black uppercase tracking-wider mb-2">
                      {articles[0].category}
                    </span>
                    <h2 className="text-2xl md:text-4xl font-extrabold mb-4 text-white leading-tight group-hover:text-cyan-400 transition-colors duration-300">
                      {articles[0].title}
                    </h2>
                    <p className="text-slate-455 text-sm md:text-base leading-relaxed mb-6 font-light line-clamp-3">
                      {articles[0].excerpt}
                    </p>
                    <div className="flex items-center justify-between mt-auto">
                      <span className="text-xs text-slate-500 font-medium">
                        {safeFormatDistance(articles[0].published_at)}
                      </span>
                      <span className="text-cyan-400 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 group-hover:translate-x-1.5 transition-transform duration-300">
                        Explore Paradigm <span className="text-sm">→</span>
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            )}

            {/* Other Articles - 3D Glow Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {(page === 0 ? articles.slice(1) : articles).map((article) => (
                <Link key={article.id} href={`/article/${article.slug}`} className="card-perspective block group h-full">
                  <div className="card-tilt glass-panel rounded-2xl overflow-hidden border border-slate-900 hover:border-indigo-500/30 flex flex-col h-full shadow-lg shadow-black/20">
                    <div className="relative h-56 overflow-hidden">
                      <Image
                        src={article.image_url || 'https://images.unsplash.com/photo-1633356122544-f134324ef6db?w=500'}
                        alt={article.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent"></div>
                      <span className="absolute top-4 right-4 bg-slate-950/80 backdrop-blur-md border border-slate-800 text-slate-300 text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md">
                        {article.category}
                      </span>
                    </div>
                    
                    <div className="p-6 flex flex-col flex-grow card-inner-3d">
                      <h3 className="font-extrabold text-lg text-white mb-3 line-clamp-2 leading-snug group-hover:text-cyan-400 transition-colors duration-300">
                        {article.title}
                      </h3>
                      <p className="text-slate-455 text-xs md:text-sm font-light leading-relaxed mb-6 line-clamp-3">
                        {article.excerpt}
                      </p>
                      
                      <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-900/60">
                        <span className="text-[11px] text-slate-500">
                          {safeFormatDistance(article.published_at)}
                        </span>
                        <span className="text-indigo-400 font-extrabold text-[11px] uppercase tracking-wider flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                          Read <span className="text-sm">→</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-center items-center gap-6 mt-16">
              <button
                onClick={() => setPage(Math.max(0, page - 1))}
                disabled={page === 0}
                className="btn-neon px-5 py-2.5 bg-slate-900 border border-slate-800 hover:border-cyan-500/30 rounded-xl text-slate-400 disabled:opacity-30 disabled:pointer-events-none hover:text-cyan-400 font-bold text-xs uppercase tracking-wider transition-all duration-300"
              >
                Previous
              </button>
              
              <span className="text-xs uppercase tracking-widest text-slate-500 font-bold">
                Page <span className="text-cyan-400">{page + 1}</span>
              </span>
              
              <button
                onClick={() => setPage(page + 1)}
                disabled={articles.length < 9}
                className="btn-neon px-5 py-2.5 bg-slate-900 border border-slate-800 hover:border-cyan-500/30 rounded-xl text-slate-400 disabled:opacity-30 disabled:pointer-events-none hover:text-cyan-400 font-bold text-xs uppercase tracking-wider transition-all duration-300"
              >
                Next
              </button>
            </div>
          </>
        ) : (
          <div className="glass-panel text-center py-20 rounded-3xl border border-slate-900">
            <div className="text-5xl mb-4 animate-bounce">📭</div>
            <h3 className="font-extrabold text-xl text-white mb-2">No articles found</h3>
            <p className="text-slate-400 text-sm max-w-sm mx-auto">
              We couldn't find any articles matching the selected category. Check back later or create one in the dashboard!
            </p>
            <Link href="/admin" className="inline-flex btn-neon mt-6 px-6 py-3 bg-gradient-to-r from-cyan-500 to-indigo-600 rounded-xl font-bold text-xs uppercase tracking-wider text-white">
              Create First Article
            </Link>
          </div>
        )}
      </section>
    </main>
  )
}
