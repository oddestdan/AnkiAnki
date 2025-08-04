# Deploying AnkiAnki to Vercel

## Prerequisites

1. **Database Setup**: Since this app uses SQLite with Prisma, you'll need to migrate to a production database. Options include:
   - PostgreSQL (recommended for Vercel)
   - MySQL
   - SQLite (not recommended for production)

2. **Environment Variables**: You'll need to set up the following environment variables in Vercel:

   ```
   DATABASE_URL="your-production-database-url"
   NEXTAUTH_URL="https://your-app-name.vercel.app"
   NEXTAUTH_SECRET="your-secret-key-here"
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"
   ```

## Deployment Steps

### 1. Database Migration

If you want to use PostgreSQL (recommended):

1. Update your `prisma/schema.prisma` file:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```

2. Set up a PostgreSQL database (you can use services like Supabase, Railway, Neon, or Vercel Postgres)

3. Update your environment variables with the PostgreSQL connection string

### 2. Deploy to Vercel

1. **Install Vercel CLI** (optional but recommended):
   ```bash
   npm i -g vercel
   ```

2. **Deploy via Vercel Dashboard**:
   - Go to [Vercel](https://vercel.com)
   - Click "New Project"
   - Import your GitHub/GitLab/Bitbucket repository
   - Vercel will automatically detect it's a Next.js project

3. **Configure environment variables**:
   - In your Vercel project dashboard, go to Settings > Environment Variables
   - Add all the required environment variables listed above

4. **Deploy**:
   - Click "Deploy"
   - Vercel will automatically build and deploy your app

### 3. Alternative: Deploy via CLI

1. **Login to Vercel**:
   ```bash
   vercel login
   ```

2. **Deploy**:
   ```bash
   vercel
   ```

3. **Follow the prompts** to configure your project

### 4. Post-Deployment

1. **Run database migrations**:
   ```bash
   npx prisma db push
   ```
   Or if using migrations:
   ```bash
   npx prisma migrate deploy
   ```

2. **Update Google OAuth**:
   - Go to Google Cloud Console
   - Add your Vercel domain to the authorized redirect URIs
   - Update the redirect URI to: `https://your-app-name.vercel.app/api/auth/callback/google`

## Vercel-Specific Features

### 1. Edge Functions (Optional)
If you want to use Vercel Edge Functions for better performance, you can add this to your `next.config.ts`:

```typescript
const nextConfig: NextConfig = {
  experimental: {
    runtime: 'edge',
  },
};
```

### 2. Vercel Postgres (Recommended)
Vercel offers managed PostgreSQL databases:

1. In your Vercel dashboard, go to Storage
2. Create a new Postgres database
3. The connection string will be automatically added to your environment variables

### 3. Automatic Deployments
Vercel automatically deploys when you push to your main branch and creates preview deployments for pull requests.

## Troubleshooting

- **Build Errors**: Check the Vercel build logs in your dashboard
- **Environment Variables**: Ensure all variables are set in Vercel dashboard
- **Database Connection**: Make sure your database is accessible from Vercel's servers
- **OAuth Issues**: Verify Google OAuth redirect URIs include your Vercel domain

## Files Created for Deployment

- `vercel.json`: Vercel configuration file
- Updated deployment guide for Vercel-specific instructions

## Benefits of Vercel over Netlify for Next.js

1. **Native Next.js Support**: Vercel is created by the Next.js team
2. **Better Performance**: Optimized for Next.js applications
3. **Edge Functions**: Built-in support for edge computing
4. **Automatic Optimizations**: Image optimization, code splitting, etc.
5. **Preview Deployments**: Automatic preview deployments for PRs
6. **Analytics**: Built-in analytics and performance monitoring 