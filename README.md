# AnkiAnki

A modern full-stack web application built with Next.js 15, featuring TypeScript, Tailwind CSS, Prisma ORM, and shadcn/ui components.

## 🚀 Features

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Prisma** - Type-safe database ORM
- **shadcn/ui** - Beautiful, accessible UI components
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
# Create .env file with SQLite configuration
echo 'DATABASE_URL="file:./dev.db"' > .env

# Push the database schema
npx prisma db push

# Generate Prisma client
npx prisma generate
```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── demo/              # Demo page showcasing all features
│   ├── globals.css        # Global styles with Tailwind
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   └── ui/               # shadcn/ui components
├── lib/                  # Utility functions
│   ├── prisma.ts         # Prisma client configuration
│   └── utils.ts          # General utilities
prisma/
├── schema.prisma         # Database schema
└── dev.db               # SQLite database (created after setup)
```

## 🎨 UI Components

This project includes shadcn/ui components:
- Button
- Card
- Input
- Label
- Form

To add more components:
```bash
npx shadcn@latest add <component-name>
```

## 🗄️ Database

The project includes a sample `User` model with:
- `id` (String, unique)
- `email` (String, unique)
- `name` (String, optional)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

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

Create a `.env` file in the root directory:
```env
DATABASE_URL="file:./dev.db"
```

## 🎯 Demo

Visit `/demo` to see a comprehensive showcase of all integrated technologies.

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
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
