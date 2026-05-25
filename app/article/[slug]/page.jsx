// app/article/[slug]/page.jsx
'use client'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { fetchArticleBySlug } from '@/lib/supabase'
import { formatDistanceToNow } from 'date-fns'

export default function ArticlePage({ params }) {
  const [article, setArticle] = useState(null)
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

  // Prevent hydration mismatches
  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const loadArticle = async () => {
      const { data } = await fetchArticleBySlug(params.slug)
      setArticle(data)
      setLoading(false)
    }
    loadArticle()
  }, [params.slug])

  const safeFormatDistance = (dateString) => {
    if (!mounted) return 'recently'
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true })
    } catch (e) {
      return 'recently'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 rounded-full border-4 border-cyan-500/20 border-t-cyan-500 animate-spin"></div>
        <div className="text-slate-400 text-xs tracking-widest uppercase font-bold">Decoding Transmission...</div>
      </div>
    )
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
        <div className="text-5xl mb-4">🛸</div>
        <h2 className="text-2xl font-black text-white mb-2">Transmission Lost</h2>
        <p className="text-slate-400 text-sm mb-6 max-w-sm text-center font-light">This particular technical coordinate could not be located in our databanks.</p>
        <Link href="/" className="btn-neon px-6 py-3 bg-gradient-to-r from-cyan-500 to-indigo-600 text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-lg">
          Return to Hub
        </Link>
      </div>
    )
  }

  return (
    <article className="min-h-screen pb-24 relative z-10">
      {/* Dynamic Parallax Hero */}
      <div className="relative h-[320px] md:h-[520px] overflow-hidden">
        <Image
          src={article.image_url || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200'}
          alt={article.title}
          fill
          className="object-cover"
          priority
        />
        {/* Glow Shading overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
        <div className="absolute inset-0 bg-slate-950/10"></div>
      </div>

      {/* Article Contents */}
      <div className="max-w-3xl mx-auto px-4 -mt-20 md:-mt-32 relative z-20">
        <div className="glass-panel rounded-3xl p-6 md:p-10 border border-slate-800 shadow-2xl">
          
          {/* Header Metadata */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <span className="bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-[10px] font-black uppercase tracking-widest px-3.5 py-1.5 rounded-lg">
                {article.category}
              </span>
              <Link href="/" className="text-xs text-slate-500 hover:text-cyan-400 transition flex items-center gap-1">
                <span>←</span> Back to Hub
              </Link>
            </div>
            
            <h1 className="text-3xl md:text-5xl font-black text-white leading-tight mb-6">
              {article.title}
            </h1>
            
            <div className="flex items-center gap-4 text-slate-500 text-xs font-medium border-t border-slate-900 pt-6">
              <span>{safeFormatDistance(article.published_at)}</span>
              <span>•</span>
              <span className="text-slate-400">Reading time: ~5 min</span>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-cyan-500/0 via-indigo-500/20 to-cyan-500/0 my-8"></div>

          {/* Editorial Body */}
          <div className="prose prose-invert max-w-none text-slate-350 leading-relaxed font-light text-sm md:text-base">
            <p className="text-lg md:text-xl text-slate-300 font-normal leading-relaxed mb-8 border-l-2 border-cyan-500 pl-4 py-1 italic">
              {article.excerpt}
            </p>

            <div className="bg-slate-950/60 border border-slate-900/60 rounded-2xl p-6 md:p-8 my-8 whitespace-pre-wrap text-slate-300 font-light leading-relaxed">
              {article.content}
            </div>
          </div>

          {/* Interactive Glowing Newsletter Signup */}
          <div className="mt-16 p-8 bg-gradient-to-tr from-cyan-500/5 to-indigo-500/5 border border-slate-800 rounded-2xl text-center relative overflow-hidden shadow-xl">
            <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/10 rounded-full blur-2xl"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl"></div>
            
            <h3 className="text-lg font-extrabold text-white mb-2 tracking-tight">Stay Synced with TechPulse</h3>
            <p className="text-xs text-slate-455 max-w-md mx-auto leading-relaxed mb-6 font-light">
              Receive high-impact daily digests featuring pioneering AI tools, hardware specs, and software development methodologies directly in your inbox.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-grow bg-slate-900 border border-slate-850 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
              />
              <button className="btn-neon px-6 py-3 bg-gradient-to-r from-cyan-500 to-indigo-600 text-white text-xs font-black uppercase tracking-wider rounded-xl whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </div>

        </div>
      </div>
    </article>
  )
}
