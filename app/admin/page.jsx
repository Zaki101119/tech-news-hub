// app/admin/page.jsx
'use client'
import { useState, useEffect } from 'react'
import { getDatabaseMode, createArticle, fetchArticles, deleteArticle, updateArticle } from '@/lib/supabase'
import { format } from 'date-fns'

export default function AdminDashboard() {
  const [articles, setArticles] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [dbMode, setDbMode] = useState('mock')
  const [mounted, setMounted] = useState(false)

  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: 'AI Tools',
    image_url: '',
    slug: '',
  })

  // Prevent hydration mismatches
  useEffect(() => {
    setMounted(true)
    setDbMode(getDatabaseMode())
    loadArticles()
  }, [])

  const loadArticles = async () => {
    const { data } = await fetchArticles(50)
    setArticles(data || [])
  }

  // Auto-generate slug
  useEffect(() => {
    if (formData.title) {
      const slug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
      setFormData(prev => ({ ...prev, slug }))
    }
  }, [formData.title])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (editingId) {
        await updateArticle(editingId, {
          ...formData,
          published_at: new Date().toISOString(),
        })
      } else {
        await createArticle({
          ...formData,
          published_at: new Date().toISOString(),
        })
      }

      // Reset form
      setFormData({
        title: '',
        excerpt: '',
        content: '',
        category: 'AI Tools',
        image_url: '',
        slug: '',
      })
      setEditingId(null)
      setShowForm(false)

      // Reload articles
      await loadArticles()
    } catch (error) {
      alert('Error saving article: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this article?')) {
      await deleteArticle(id)
      await loadArticles()
    }
  }

  const handleEdit = (article) => {
    setFormData(article)
    setEditingId(article.id)
    setShowForm(true)
  }

  const safeFormatDate = (dateStr) => {
    if (!mounted) return 'Date loading'
    try {
      return format(new Date(dateStr), 'MMM dd, yyyy')
    } catch (e) {
      return 'Recently'
    }
  }

  return (
    <div className="min-h-screen py-12 px-4 md:px-8 relative">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-16 relative z-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-4xl font-extrabold tracking-tight text-white">
                Admin Console
              </h1>
              {mounted && (
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                  dbMode === 'supabase'
                    ? 'bg-purple-500/10 border border-purple-500/30 text-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.15)]'
                    : 'bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.15)]'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${dbMode === 'supabase' ? 'bg-purple-400 animate-ping' : 'bg-cyan-400 animate-ping'}`}></span>
                  Mode: {dbMode} storage
                </span>
              )}
            </div>
            <p className="text-slate-400 text-sm font-light">
              Create, edit, and orchestrate the content streams that feed TechPulse.
            </p>
          </div>
          
          <button
            onClick={() => {
              setFormData({
                title: '',
                excerpt: '',
                content: '',
                category: 'AI Tools',
                image_url: '',
                slug: '',
              })
              setEditingId(null)
              setShowForm(!showForm)
            }}
            className="btn-neon px-6 py-3.5 bg-gradient-to-r from-cyan-500 to-indigo-600 rounded-xl text-xs font-black uppercase tracking-wider text-white shadow-xl transition-all duration-300"
          >
            {showForm ? 'Close Panel' : '＋ Deploy News Card'}
          </button>
        </div>

        {/* Dynamic Glass Form */}
        {showForm && (
          <form onSubmit={handleSubmit} className="glass-panel rounded-2xl p-8 mb-16 border border-slate-800 shadow-2xl relative z-10 animate-fade-in">
            <h2 className="text-xl font-bold mb-6 text-white tracking-wide uppercase text-xs text-slate-400 border-b border-slate-900 pb-3 flex justify-between">
              <span>{editingId ? 'Edit Article Parameters' : 'Orchestrate New Entry'}</span>
              <span className="text-cyan-400 font-black">Ready for publishing</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Article Heading</label>
                <input
                  type="text"
                  placeholder="e.g. Apple Vision Pro V2 leaked specs"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-slate-900/60 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none transition-all"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Focus Paradigm</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full bg-slate-900/60 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:border-indigo-500 focus:outline-none transition-all cursor-pointer"
                >
                  <option>AI Tools</option>
                  <option>Tech Devices</option>
                  <option>Industry News</option>
                  <option>Tutorials</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Resource slug (Auto)</label>
                <input
                  type="text"
                  placeholder="auto-generated-slug"
                  value={formData.slug}
                  disabled
                  className="w-full bg-slate-900/20 border border-slate-800/40 rounded-xl px-4 py-3 text-sm text-slate-500 opacity-60 cursor-not-allowed"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Hero Image Unsplash URL</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/photo-..."
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  className="w-full bg-slate-900/60 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none transition-all"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2 mb-6">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Brief Executive Summary</label>
              <textarea
                placeholder="Write a compelling 2-line summary for article feeds..."
                required
                rows="2"
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                className="w-full bg-slate-900/60 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none transition-all resize-none"
              />
            </div>

            <div className="flex flex-col gap-2 mb-8">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Full Editorial Content</label>
              <textarea
                placeholder="Compose the full technical breakdown here..."
                required
                rows="8"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="w-full bg-slate-900/60 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none transition-all resize-y min-h-[150px]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-4 bg-gradient-to-r from-cyan-500 to-indigo-600 rounded-xl font-bold text-xs uppercase tracking-wider text-white shadow-xl hover:shadow-cyan-500/25 transition disabled:opacity-50"
            >
              {loading ? 'Transmitting Data...' : editingId ? 'Update Editorial Package' : 'Broadcast Entry to Feed'}
            </button>
          </form>
        )}

        {/* Premium List of Articles */}
        <div className="relative z-10">
          <h2 className="text-xl font-bold tracking-tight text-white mb-6 uppercase text-xs tracking-widest text-slate-500 flex items-center gap-2">
            📊 Feed Inventory <span>({articles.length})</span>
          </h2>
          
          <div className="space-y-4">
            {articles.length > 0 ? (
              articles.map((article) => (
                <div key={article.id} className="glass-panel rounded-2xl p-6 border border-slate-900 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-slate-800 hover:bg-slate-900/40 transition duration-300">
                  <div className="flex-1">
                    <h3 className="font-extrabold text-base text-white mb-2 leading-snug group-hover:text-cyan-400">
                      {article.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="bg-slate-900 px-3 py-1 border border-slate-850 rounded-lg text-[10px] font-bold text-indigo-400 uppercase tracking-wider">
                        {article.category}
                      </span>
                      <span className="text-[11px] text-slate-500">
                        {safeFormatDate(article.published_at)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 w-full sm:w-auto">
                    <button
                      onClick={() => handleEdit(article)}
                      className="px-4 py-2 flex-1 sm:flex-none text-center bg-indigo-600/10 hover:bg-indigo-600/30 border border-indigo-500/30 rounded-xl font-bold text-xs uppercase tracking-wider text-indigo-300 hover:text-white transition duration-300"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(article.id)}
                      className="px-4 py-2 flex-1 sm:flex-none text-center bg-rose-600/10 hover:bg-rose-600/30 border border-rose-500/30 rounded-xl font-bold text-xs uppercase tracking-wider text-rose-300 hover:text-white transition duration-300"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="glass-panel text-center py-16 rounded-2xl border border-slate-900">
                <p className="text-slate-400 text-sm">Orchestrate the first broadcast above!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
