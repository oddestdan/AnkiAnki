# AnkiAnki

A modern full-stack web application built with Next.js 15, featuring TypeScript, Tailwind CSS, Prisma ORM, shadcn/ui components, and Google OAuth authentication.

## 🚀 Features

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Prisma** - Type-safe database ORM
- **shadcn/ui** - Beautiful, accessible UI components
- **NextAuth.js** - OAuth authentication with Google
- **ESLint** - Code linting and formatting
- **SQLite** - Lightweight database for development

## 📦 Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd anki-anki
```

2. Install dependencies:
```bash
npm install
```

3. Set up the database:
```bash
# Create .env.local file with required configuration
echo 'DATABASE_URL="file:./dev.db"' > .env.local
echo 'NEXTAUTH_URL="http://localhost:3000"' >> .env.local
echo 'NEXTAUTH_SECRET="your-nextauth-secret-key-here"' >> .env.local
echo 'GOOGLE_CLIENT_ID="your-google-client-id-here"' >> .env.local
echo 'GOOGLE_CLIENT_SECRET="your-google-client-secret-here"' >> .env.local

# Push the database schema
npx prisma db push

# Generate Prisma client
npx prisma generate
```

4. Set up Google OAuth:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing one
   - Enable the Google+ API
   - Go to "Credentials" and create an OAuth 2.0 Client ID
   - Set the authorized redirect URI to `http://localhost:3000/api/auth/callback/google`
   - Copy the Client ID and Client Secret to your `.env.local` file

5. Start the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔐 Authentication

This project includes Google OAuth authentication with the following features:

- **Protected Routes** - The demo page requires authentication
- **User Profile** - Display user name/email with avatar in the top right
- **Logout Functionality** - Users can sign out via the profile dropdown
- **Error Handling** - Dedicated error pages for authentication failures
- **User Preferences** - Database schema includes theme preferences

### Authentication Flow

1. Users visit `/demo` and are redirected to `/auth/signin` if not authenticated
2. Users can sign in with their Google account
3. Upon successful authentication, users are redirected to `/demo`
4. If authentication fails, users are redirected to `/auth/error`
5. Users can logout via the profile dropdown in the top right

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── auth/              # Authentication pages
│   │   ├── signin/        # Sign-in page
│   │   └── error/         # Auth error page
│   ├── demo/              # Protected demo page
│   ├── unauthorized/      # Unauthorized access page
│   ├── api/auth/          # NextAuth API routes
│   ├── globals.css        # Global styles with Tailwind
│   ├── layout.tsx         # Root layout with SessionProvider
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── auth/              # Authentication components
│   │   ├── auth-guard.tsx # Route protection component
│   │   └── user-profile.tsx # User profile dropdown
│   ├── providers/         # Context providers
│   │   └── session-provider.tsx # NextAuth SessionProvider
│   └── ui/               # shadcn/ui components
├── lib/                  # Utility functions
│   ├── auth.ts           # NextAuth configuration
│   ├── prisma.ts         # Prisma client configuration
│   └── utils.ts          # General utilities
prisma/
├── schema.prisma         # Database schema with OAuth tables
└── dev.db               # SQLite database (created after setup)
```

## 🎨 UI Components

This project includes shadcn/ui components:
- Button
- Card
- Input
- Label
- Form
- DropdownMenu
- Avatar

To add more components:
```bash
npx shadcn@latest add <component-name>
```

## 🗄️ Database

The project includes OAuth-ready database schema with:
- **User** model with OAuth fields
- **Account** model for OAuth provider accounts
- **Session** model for user sessions
- **VerificationToken** model for email verification

### Database Commands

```bash
# View database in Prisma Studio
npx prisma studio

# Reset database
npx prisma db push --force-reset

# Generate Prisma client after schema changes
npx prisma generate
```

## 🛠️ Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Environment Variables

Create a `.env.local` file in the root directory:
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

## 🎯 Demo

Visit `/demo` to see a comprehensive showcase of all integrated technologies. This page is protected and requires Google OAuth authentication.

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License.
