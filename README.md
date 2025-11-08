# Unspun Media Annotation System

A Next.js-based web application for sentence-level bias detection and annotation in news articles.

## Phase 1 - Complete ✅

This implementation includes:

- **Landing Page** (`/`) - Welcome page with login/signup links
- **Authentication** - Login (`/login`) and signup (`/signup`) pages with Supabase auth
- **Admin Dashboard** (`/dashboard`) - Overview with article statistics
- **Article Management** (`/articles`) - List articles and add new ones manually
- **API Routes** - Backend endpoints for article CRUD and dashboard stats

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database & Auth**: Supabase
- **Deployment**: Vercel (recommended)

## Getting Started

### 1. Prerequisites

- Node.js 18+ installed
- Supabase account (free tier works)
- Vercel account (optional, for deployment)

### 2. Set Up Supabase

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Once created, go to **Settings** → **API** and copy:
   - Project URL
   - Anon/Public key
   - Service Role key (keep secret!)

3. In the Supabase SQL Editor, run this schema to create the tables:

```sql
-- Create articles table
CREATE TABLE articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  source TEXT NOT NULL,
  publication_date DATE NOT NULL,
  ingestion_date TIMESTAMP DEFAULT NOW(),
  raw_html TEXT,
  cleaned_text TEXT,
  metadata JSONB,
  status TEXT DEFAULT 'queued',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create annotators table
CREATE TABLE annotators (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  role TEXT DEFAULT 'annotator',
  is_active BOOLEAN DEFAULT true,
  articles_completed INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create annotations table
CREATE TABLE annotations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id UUID REFERENCES articles(id),
  annotator_id UUID REFERENCES annotators(id),
  sentence_id TEXT NOT NULL,
  bias_present BOOLEAN NOT NULL,
  bias_type TEXT,
  bias_explanation TEXT,
  suggested_rewrite TEXT,
  confidence_level INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create sentences table
CREATE TABLE sentences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id UUID REFERENCES articles(id),
  sentence_text TEXT NOT NULL,
  sentence_order INTEGER NOT NULL,
  paragraph_number INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create assignments table
CREATE TABLE assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id UUID REFERENCES articles(id),
  annotator_id UUID REFERENCES annotators(id),
  assigned_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP,
  status TEXT DEFAULT 'assigned'
);

-- Enable Row Level Security
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE annotators ENABLE ROW LEVEL SECURITY;
ALTER TABLE annotations ENABLE ROW LEVEL SECURITY;
ALTER TABLE sentences ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;

-- Create policies (for now, allow authenticated users to access everything)
CREATE POLICY "Allow authenticated users" ON articles FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated users" ON annotators FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated users" ON annotations FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated users" ON sentences FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated users" ON assignments FOR ALL TO authenticated USING (true);
```

### 3. Configure Environment Variables

1. Copy the example environment file:
   ```bash
   cp .env.local.example .env.local
   ```

2. Edit `.env.local` and add your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```

### 4. Run Locally

```bash
# Install dependencies (if not already done)
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Deploy to Vercel

1. Push your code to GitHub:
   ```bash
   git add .
   git commit -m "Initial Unspun annotation system setup"
   git push origin claude/build-unspun-annotation-system-011CUvrqXMpD9HQwK5pRxjeT
   ```

2. Go to [vercel.com](https://vercel.com) and import your repository

3. Add the same environment variables from `.env.local` to Vercel:
   - Go to **Settings** → **Environment Variables**
   - Add all variables from your `.env.local`

4. Deploy! Vercel will give you a public URL like:
   `https://unspun-annotation.vercel.app`

## Usage

### Testing in Browser

1. **Sign Up**: Go to `/signup` and create an account
2. **Log In**: Use your credentials at `/login`
3. **Dashboard**: View article statistics at `/dashboard`
4. **Add Article**: Navigate to `/articles` and click "Add Article"
   - Enter article URL, title, source, and publication date
   - Optionally paste article text (or fetch automatically later)
5. **View Articles**: See all articles in the list with their status

### Browser Testing Checklist

- ✅ Open app in new Chrome tab
- ✅ Sign up for new account
- ✅ Log in successfully
- ✅ See admin dashboard
- ✅ Add a test article
- ✅ Article appears in list
- ✅ Open in incognito tab (test as different user)

## Project Structure

```
unspun-dashboard/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── signup/page.tsx
│   ├── (admin)/
│   │   ├── layout.tsx (admin sidebar layout)
│   │   ├── dashboard/page.tsx
│   │   ├── articles/page.tsx
│   │   ├── annotators/page.tsx (placeholder)
│   │   └── settings/page.tsx (placeholder)
│   ├── api/
│   │   ├── articles/route.ts
│   │   └── dashboard/stats/route.ts
│   ├── layout.tsx (root layout)
│   ├── page.tsx (landing page)
│   └── globals.css
├── lib/
│   └── supabase/
│       ├── client.ts (browser client)
│       ├── server.ts (server client)
│       └── middleware.ts (auth middleware)
├── types/
│   └── database.ts (TypeScript types)
├── middleware.ts (auth middleware)
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.js
```

## API Routes

### `GET /api/articles`
List all articles (requires authentication)

**Response**: Array of article objects

### `POST /api/articles`
Create a new article (requires authentication)

**Body**:
```json
{
  "url": "https://example.com/article",
  "title": "Article Title",
  "source": "CNN",
  "publication_date": "2025-11-08",
  "article_text": "Optional article text..."
}
```

**Response**: Created article object

### `GET /api/dashboard/stats`
Get article count by status (requires authentication)

**Response**:
```json
{
  "queued": 5,
  "in_progress": 3,
  "completed": 12,
  "ready_to_publish": 2
}
```

## What's Next (Phase 2)

After Phase 1 is working and deployed:

- [ ] Annotator management (CRUD operations)
- [ ] Assignment system (assign 2 annotators per article)
- [ ] Sentence segmentation (parse articles into sentences)
- [ ] Annotator dashboard (view assigned articles)
- [ ] Annotation interface (sentence-by-sentence review)
- [ ] Claude AI integration for bias suggestions
- [ ] Conflict resolution workflow
- [ ] Export functionality

## Common Issues

### "Database connection failed"
- Check Supabase credentials in `.env.local`
- Ensure Supabase project is active
- Verify RLS policies are created

### "Unauthorized" errors
- Make sure you're logged in
- Check authentication token is valid
- Clear cookies and log in again

### TypeScript errors
- Run `npm install` to ensure all types are installed
- Restart your editor/IDE

## Support

For issues or questions:
1. Check the [Next.js docs](https://nextjs.org/docs)
2. Check the [Supabase docs](https://supabase.com/docs)
3. Check the browser console for error messages

## License

MIT
