# Deploying AnkiAnki to Vercel

## Prerequisites

1. **Database Setup**: This app has been configured to use PostgreSQL for production deployment. The schema supports PostgreSQL out of the box.

2. **Environment Variables**: You'll need to set up the following environment variables in Vercel:

   ```
   DATABASE_URL="postgresql://username:password@hostname:port/database_name?schema=public"
   NEXTAUTH_URL="https://your-app-name.vercel.app"
   NEXTAUTH_SECRET="your-production-secret-key-generate-random-string"
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"
   ```

## Quick Setup with Vercel Postgres (Recommended)

The fastest way to get started is using Vercel's managed PostgreSQL database:

1. **Deploy to Vercel first** (even if it fails initially)
2. **Add Vercel Postgres**:
   - Go to your Vercel project dashboard
   - Navigate to the "Storage" tab
   - Click "Create Database" → "Postgres"
   - Follow the setup wizard
   - Vercel will automatically add the `DATABASE_URL` environment variable

3. **Add other environment variables** in Vercel dashboard:
   - `NEXTAUTH_URL`: `https://your-app-name.vercel.app`
   - `NEXTAUTH_SECRET`: Generate a random string (you can use: `openssl rand -base64 32`)
   - `GOOGLE_CLIENT_ID`: From Google Cloud Console
   - `GOOGLE_CLIENT_SECRET`: From Google Cloud Console

4. **Redeploy** your application

## Deployment Steps

### 1. Database Migration

The app is already configured for PostgreSQL. After setting up your database:

1. **Create initial migration** (if you haven't already):
   ```bash
   npx prisma migrate dev --name init
   ```

2. **For production deployment**, use:
   ```bash
   npx prisma migrate deploy
   ```
   Or if you prefer (for simple deployments):
   ```bash
   npx prisma db push
   ```

3. **Alternative database providers** (if you don't want to use Vercel Postgres):
   - [Supabase](https://supabase.com) (Free tier available)
   - [Railway](https://railway.app) (Easy PostgreSQL setup)
   - [Neon](https://neon.tech) (Serverless PostgreSQL)
   - [PlanetScale](https://planetscale.com) (MySQL alternative)

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

1. **Run database migrations** (if using Vercel Postgres or external database):
   ```bash
   npx prisma db push
   ```
   Or if you prefer migrations:
   ```bash
   npx prisma migrate deploy
   ```

2. **Update Google OAuth**:
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Navigate to "APIs & Services" → "Credentials"
   - Find your OAuth 2.0 Client ID
   - Add your Vercel domain to "Authorized redirect URIs":
     - `https://your-app-name.vercel.app/api/auth/callback/google`
   - Also add to "Authorized JavaScript origins":
     - `https://your-app-name.vercel.app`

3. **Test your deployment**:
   - Visit your Vercel URL
   - Try signing in with Google OAuth
   - Create a test deck to verify database connectivity

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

### Common Issues

#### OAuth2 Errors
- **"redirect_uri_mismatch"**: Update Google OAuth settings with your Vercel domain
- **"invalid_client"**: Check that `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are correctly set in Vercel
- **"NEXTAUTH_URL not set"**: Ensure `NEXTAUTH_URL` is set to your Vercel domain

#### Database Connection Issues
- **"Can't reach database"**: Verify your `DATABASE_URL` is correct
- **"SSL connection required"**: Most PostgreSQL providers require SSL, ensure your connection string includes `?sslmode=require`
- **"Table doesn't exist"**: Run `prisma db push` or `prisma migrate deploy` after deployment

#### Build/Deployment Issues
- **Build Errors**: Check the Vercel build logs in your dashboard
- **Environment Variables**: Ensure all variables are set in Vercel dashboard
- **Database Connection**: Make sure your database is accessible from Vercel's servers

### Quick Fixes

1. **OAuth not working in production**:
   ```bash
   # Generate a secure NEXTAUTH_SECRET
   openssl rand -base64 32
   ```
   Add this to your Vercel environment variables.

2. **Database schema out of sync**:
   ```bash
   # Push your schema to the database
   npx prisma db push
   ```

3. **Missing tables after deployment**:
   - Go to your Vercel project dashboard
   - Navigate to "Functions" tab
   - Find a serverless function and click "View Source"
   - Open the terminal and run: `npx prisma db push`

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