# OAuth Setup Guide

## Quick Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Set up Environment Variables**
   Create a `.env.local` file in the root directory with:
   ```env
   # Database
   DATABASE_URL="file:./dev.db"
   
   # NextAuth
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-nextauth-secret-key-here"
   
   # Google OAuth
   GOOGLE_CLIENT_ID="your-google-client-id-here"
   GOOGLE_CLIENT_SECRET="your-google-client-secret-here"
   ```

3. **Set up Database**
   ```bash
   npx prisma db push
   npx prisma generate
   ```

4. **Configure Google OAuth**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing one
   - Enable the Google+ API
   - Go to "Credentials" and create an OAuth 2.0 Client ID
   - Set the authorized redirect URI to `http://localhost:3000/api/auth/callback/google`
   - Copy the Client ID and Client Secret to your `.env.local` file

5. **Start Development Server**
   ```bash
   npm run dev
   ```

## Features Implemented

✅ **OAuth2.0 with Google** - Users can log in via Google accounts
✅ **User Profile Display** - Shows user's name/email in top right of demo page
✅ **Authentication Guard** - Demo page is protected and requires login
✅ **Unauthorized Page** - Minimalistic page for failed authentication
✅ **Profile Dropdown** - Logout functionality to clear OAuth credentials
✅ **Database Integration** - User data stored in Prisma with OAuth tables
✅ **User Preferences** - Database schema includes theme preferences for future use

## Authentication Flow

1. User visits `/demo` → Redirected to `/auth/signin` if not authenticated
2. User clicks "Continue with Google" → Google OAuth flow
3. Successful authentication → Redirected to `/demo`
4. Failed authentication → Redirected to `/auth/error`
5. User can logout via profile dropdown → Clears session and redirects to home

## Database Schema

The Prisma schema includes:
- **User** model with OAuth fields (id, name, email, image, themePreference)
- **Account** model for OAuth provider accounts
- **Session** model for user sessions
- **VerificationToken** model for email verification

## Testing

1. Visit `http://localhost:3000/demo`
2. You should be redirected to the sign-in page
3. Click "Continue with Google" to authenticate
4. After successful authentication, you'll see your profile in the top right
5. Try the logout functionality from the profile dropdown 