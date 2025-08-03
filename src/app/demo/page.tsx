import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ThemeToggle } from "@/components/theme-toggle"

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">
              AnkiAnki
            </h1>
            <p className="text-muted-foreground text-lg">
              A complete full-stack setup with modern tools
            </p>
          </div>
          <ThemeToggle />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>shadcn/ui Components</CardTitle>
              <CardDescription>
                Beautiful, accessible components built with Radix UI and Tailwind CSS
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="Enter your email" />
              </div>
              <Button className="w-full">Submit</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Prisma Database</CardTitle>
              <CardDescription>
                Type-safe database access with auto-generated client
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Database schema includes a User model with:
                </p>
                <ul className="text-sm space-y-1">
                  <li>• id (String, unique)</li>
                  <li>• email (String, unique)</li>
                  <li>• name (String, optional)</li>
                  <li>• createdAt (DateTime)</li>
                  <li>• updatedAt (DateTime)</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tailwind CSS</CardTitle>
              <CardDescription>
                Utility-first CSS framework for rapid UI development
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <div className="w-4 h-4 bg-blue-500 rounded"></div>
                  <div className="w-4 h-4 bg-green-500 rounded"></div>
                  <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                  <div className="w-4 h-4 bg-red-500 rounded"></div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Customizable design system with dark mode support
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Next.js 15</CardTitle>
              <CardDescription>
                React framework with App Router and TypeScript
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Features included:
                </p>
                <ul className="text-sm space-y-1">
                  <li>• App Router</li>
                  <li>• TypeScript</li>
                  <li>• ESLint</li>
                  <li>• Tailwind CSS</li>
                  <li>• Import aliases (@/*)</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Getting Started</CardTitle>
              <CardDescription>
                Next steps to get your application running
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">1. Database Setup</h4>
                  <code className="text-sm bg-muted p-2 rounded block">
                    npx prisma db push
                  </code>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">2. Generate Prisma Client</h4>
                  <code className="text-sm bg-muted p-2 rounded block">
                    npx prisma generate
                  </code>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">3. Start Development Server</h4>
                  <code className="text-sm bg-muted p-2 rounded block">
                    npm run dev
                  </code>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 