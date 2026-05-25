// app/layout.jsx
import './globals.css'
import Link from 'next/link'

export const metadata = {
  title: 'TechPulse Daily - AI Tools, Devices & Industry News',
  description: 'Stay updated with the latest in AI, tech gadgets, and industry innovations',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-slate-100 min-h-screen flex flex-col justify-between selection:bg-cyan-500/30 selection:text-cyan-200">
        {/* Navigation */}
        <nav className="fixed top-0 left-0 right-0 bg-slate-950/70 backdrop-blur-xl border-b border-slate-900/80 z-50 transition-all duration-300">
          <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-9 h-9 bg-gradient-to-tr from-cyan-400 to-indigo-500 rounded-xl flex items-center justify-center font-black text-white text-base shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-400/40 group-hover:scale-105 transition-all duration-300">
                TP
                <div className="absolute -inset-0.5 bg-gradient-to-tr from-cyan-400 to-indigo-500 rounded-xl blur opacity-30 group-hover:opacity-75 transition duration-300 -z-10"></div>
              </div>
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent group-hover:text-cyan-400 transition-colors duration-300">TechPulse<span className="text-cyan-400">.</span></span>
            </Link>

            <div className="flex gap-8 items-center">
              <Link href="/" className="text-slate-300 hover:text-cyan-400 transition-all duration-300 text-sm font-semibold tracking-wide hover:translate-y-[-1px]">Home</Link>
              <Link href="/admin" className="text-slate-300 hover:text-cyan-400 transition-all duration-300 text-sm font-semibold tracking-wide hover:translate-y-[-1px]">Admin</Link>
              <button className="btn-neon px-5 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl text-xs font-bold text-white uppercase tracking-wider hover:shadow-cyan-500/20 shadow-md transition-all duration-300">
                Subscribe
              </button>
            </div>
          </div>
        </nav>

        {/* Ambient background glow objects */}
        <div className="relative w-full overflow-hidden flex-grow pt-16">
          <div className="ambient-glow-1"></div>
          <div className="ambient-glow-2"></div>
          {children}
        </div>

        {/* Footer */}
        <footer className="bg-slate-950 border-t border-slate-900 z-10 relative">
          <div className="max-w-6xl mx-auto px-4 py-16">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
              <div>
                <h3 className="font-black text-lg text-white mb-4">TechPulse<span className="text-cyan-400">.</span></h3>
                <p className="text-slate-400 text-sm leading-relaxed">Your premium daily dashboard for spatial computing, revolutionary AI utilities, and emerging software paradigms.</p>
              </div>
              <div>
                <h4 className="font-bold text-sm uppercase tracking-wider text-slate-300 mb-4">Categories</h4>
                <ul className="space-y-3 text-slate-400 text-sm">
                  <li><Link href="/" className="hover:text-cyan-400 transition-colors duration-200">AI Tools</Link></li>
                  <li><Link href="/" className="hover:text-cyan-400 transition-colors duration-200">Tech Devices</Link></li>
                  <li><Link href="/" className="hover:text-cyan-400 transition-colors duration-200">Industry News</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-sm uppercase tracking-wider text-slate-300 mb-4">Legal</h4>
                <ul className="space-y-3 text-slate-400 text-sm">
                  <li><Link href="/" className="hover:text-cyan-400 transition-colors duration-200">Privacy Policy</Link></li>
                  <li><Link href="/" className="hover:text-cyan-400 transition-colors duration-200">Terms of Service</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-sm uppercase tracking-wider text-slate-300 mb-4">Network</h4>
                <ul className="space-y-3 text-slate-400 text-sm">
                  <li><a href="#" className="hover:text-cyan-400 transition-colors duration-200 flex items-center gap-2"><span>Twitter / X</span></a></li>
                  <li><a href="#" className="hover:text-cyan-400 transition-colors duration-200 flex items-center gap-2"><span>LinkedIn</span></a></li>
                </ul>
              </div>
            </div>

            <div className="h-px bg-slate-900 my-8"></div>
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-slate-500 text-xs">
              <p>&copy; {new Date().getFullYear()} TechPulse Daily. Designed for visionary builders.</p>
              <div className="flex gap-4">
                <a href="#" className="hover:text-slate-400 transition-colors">Sitemap</a>
                <span>•</span>
                <a href="#" className="hover:text-slate-400 transition-colors">Contact Support</a>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}
