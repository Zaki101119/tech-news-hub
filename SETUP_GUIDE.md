# Tech News Hub - Complete Setup Guide

## 🚀 Quick Start (5 minutes)

### Step 1: Create Supabase Database
1. Go to https://supabase.com and create free account
2. Create new project
3. Go to SQL Editor and run this:

```sql
-- Create articles table
CREATE TABLE articles (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT DEFAULT 'AI Tools',
  image_url TEXT,
  slug TEXT UNIQUE NOT NULL,
  source_url TEXT,
  published_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX idx_articles_slug ON articles(slug);
CREATE INDEX idx_articles_published ON articles(published_at DESC);

-- Create categories table
CREATE TABLE categories (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Insert default categories
INSERT INTO categories (name) VALUES 
  ('AI Tools'),
  ('Tech Devices'),
  ('Industry News'),
  ('Tutorials');
```

4. Copy your project credentials:
   - Project URL → NEXT_PUBLIC_SUPABASE_URL
   - Anon Key → NEXT_PUBLIC_SUPABASE_ANON_KEY
   - Service Role Key → SUPABASE_SERVICE_ROLE_KEY (from Settings → API)

### Step 2: Get API Keys
1. **NewsAPI** (for automated news):
   - Go to https://newsapi.org
   - Sign up free (100 requests/day free tier)
   - Copy API key → NEWS_API_KEY

2. **Optional - Product Hunt** (for AI tools):
   - Go to https://producthunt.com/api
   - Create app and get token → PRODUCTHUNT_API_KEY

### Step 3: Install & Run Locally
```bash
# Clone/create project folder
cd your-project

# Install dependencies
npm install

# Create .env.local with your keys (see template above)
nano .env.local

# Run development server
npm run dev
```

Open http://localhost:3000 → You should see the site!

### Step 4: Test Admin Dashboard
1. Go to http://localhost:3000/admin
2. Click "New Article" and publish a test article
3. Check if it appears on homepage

## 🤖 Setup Automatic Publishing

### Option A: Local Scheduler (Simplest)
1. In another terminal, run:
```bash
npm run schedule-posts
```
This runs the news scraper 3 times daily automatically.

### Option B: Deploy to Vercel (Recommended)
1. Push code to GitHub
2. Go to https://vercel.com
3. Import your GitHub repo
4. Add environment variables in Settings
5. Deploy ✅

Vercel will handle cron jobs automatically using their serverless functions.

### Option C: Render Deployment (Alternative)
1. Push to GitHub
2. Go to https://render.com
3. Create new Web Service from GitHub
4. Add environment variables
5. Deploy ✅

## 📊 Earn Money - 3 Monetization Options

### 1. Google AdSense (Easiest)
- Go to https://adsense.google.com
- Apply with your domain
- Once approved, add ad code to website
- **Earnings**: $1-5 per 1,000 views

### 2. Affiliate Links
- Join Amazon Associates (amazon.com/associates)
- Find tech product links
- Add affiliate links in articles
- **Earnings**: 3-10% commission per sale

### 3. Sponsored Posts
- Reach out to tech companies
- Offer "featured article" spots
- **Earnings**: $500-5,000+ per post

### Quick Ads Integration Example:
```jsx
// In your article page, add:
<div className="bg-slate-800 rounded my-8 p-4">
  {/* Google AdSense Code Here */}
  <script async src="//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
</div>
```

## 📱 Mobile Responsive - Already Included!
- Homepage: Responsive grid
- Admin: Mobile-friendly form
- Articles: Mobile-optimized reading

## 🔒 Security Checklist
- [ ] Set RLS (Row Level Security) in Supabase for sensitive tables
- [ ] Add rate limiting to API routes
- [ ] Protect /admin route with password
- [ ] Use environment variables for all secrets

## 🎯 Next Steps
1. ✅ Setup complete
2. 🖼️ Add your logo/branding
3. 📝 Publish first articles
4. 💰 Set up ads/affiliate links
5. 📊 Wait 6 months for AdSense approval
6. 🚀 Scale! Add newsletter, social sharing

## 🆘 Troubleshooting

**Articles not showing?**
- Check Supabase connection in browser DevTools
- Verify environment variables are set
- Check database has articles

**Automated posts not running?**
- Check NewsAPI key is valid
- Verify scheduler is running: `npm run schedule-posts`
- Check logs for errors

**Deployment issues?**
- Make sure all env vars are set in Vercel/Render
- Check build logs for errors
- Ensure Node.js version compatible

## 📧 Support Resources
- Next.js Docs: https://nextjs.org/docs
- Supabase Docs: https://supabase.com/docs
- NewsAPI Docs: https://newsapi.org/docs
- Vercel Deployment: https://vercel.com/docs

---

## 💡 Pro Tips for Faster Success

1. **Content Strategy**:
   - Target long-tail keywords (not "AI", but "GPT-4 alternatives")
   - Write 500-1000 word articles
   - Publish consistently

2. **SEO**:
   - Add meta descriptions
   - Use keywords in titles
   - Link between related articles
   - Submit sitemap to Google Search Console

3. **Traffic**:
   - Share on Twitter/LinkedIn/Reddit
   - Guest post on other tech blogs
   - Build email list early
   - Engage with comments

4. **Monetization Timeline**:
   - Month 1-3: Write quality content (50+ articles)
   - Month 3-6: Apply for AdSense
   - Month 6-12: Start affiliate marketing
   - Month 12+: Pitch sponsored posts

**Your first $100 from this site could take 6-12 months, but it's completely passive once set up!**
