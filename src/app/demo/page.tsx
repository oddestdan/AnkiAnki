import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ThemeToggle } from "@/components/theme-toggle/theme-toggle"
import { UserProfile } from "@/components/auth/user-profile"
import { AuthGuard } from "@/components/auth/auth-guard"

export default function DemoPage() {
  return (
    <AuthGuard>
      <div className="h-screen w-screen bg-background flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex-shrink-0 p-4 border-b">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                AnkiAnki
              </h1>
              <p className="text-muted-foreground text-sm">
                A complete full-stack setup with modern tools
              </p>
            </div>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <UserProfile />
            </div>
          </div>
        </div>

        {/* Main Content - 3 Columns */}
        <div className="flex-1 flex overflow-hidden">
          {/* Column 1 - Components */}
          <div className="w-1/3 border-r overflow-hidden flex flex-col">
            <div className="flex-shrink-0 p-4 border-b">
              <h2 className="text-lg font-semibold">shadcn/ui Components</h2>
              <p className="text-sm text-muted-foreground">
                Beautiful, accessible components built with Radix UI and Tailwind CSS
              </p>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="Enter your email" />
                </div>
                <Button className="w-full">Submit</Button>
                
                {/* Additional content to demonstrate scrolling */}
                {Array.from({ length: 20 }).map((_, i) => (
                  <Card key={i}>
                    <CardContent className="p-4">
                      <p className="text-sm">Component example {i + 1}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Column 2 - Database */}
          <div className="w-1/3 border-r overflow-hidden flex flex-col">
            <div className="flex-shrink-0 p-4 border-b">
              <h2 className="text-lg font-semibold">Prisma Database</h2>
              <p className="text-sm text-muted-foreground">
                Type-safe database access with auto-generated client
              </p>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-4">
                <Card>
                  <CardContent className="p-4">
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
                        <li>• themePreference (String, optional)</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                {/* Additional database content */}
                {Array.from({ length: 15 }).map((_, i) => (
                  <Card key={i}>
                    <CardContent className="p-4">
                      <h4 className="font-medium mb-2">Table {i + 1}</h4>
                      <p className="text-sm text-muted-foreground">
                        Database table with relationships and constraints
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Column 3 - Getting Started */}
          <div className="w-1/3 overflow-hidden flex flex-col">
            <div className="flex-shrink-0 p-4 border-b">
              <h2 className="text-lg font-semibold">Getting Started</h2>
              <p className="text-sm text-muted-foreground">
                Next steps to get your application running
              </p>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-4">
                <Card>
                  <CardContent className="p-4">
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
                        <h4 className="font-semibold mb-2">3. Set up Google OAuth</h4>
                        <code className="text-sm bg-muted p-2 rounded block">
                          Add GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET to .env
                        </code>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">4. Start Development Server</h4>
                        <code className="text-sm bg-muted p-2 rounded block">
                          npm run dev
                        </code>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Additional setup content */}
                {Array.from({ length: 10 }).map((_, i) => (
                  <Card key={i}>
                    <CardContent className="p-4">
                      <h4 className="font-medium mb-2">Step {i + 5}</h4>
                      <p className="text-sm text-muted-foreground">
                        Additional configuration and setup instructions
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  )
} 