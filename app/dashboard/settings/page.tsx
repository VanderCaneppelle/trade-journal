import { createServerSupabaseClient } from '@/lib/supabase/server'
import { Header } from '@/components/header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Code } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function SettingsPage() {
  const supabase = await createServerSupabaseClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return null
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header 
        title="Settings" 
        subtitle="Configure your trading journal"
      />
      
      <div className="flex-1 p-6 space-y-6">
        <div>
          <h2 className="text-3xl font-bold">Settings</h2>
          <p className="text-muted-foreground">Manage your account and API integration</p>
        </div>

        {/* User Info */}
        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
            <CardDescription>Your account details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between py-2 border-b border-border/50">
              <span className="text-muted-foreground">Email</span>
              <span className="font-medium">{user.email}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-border/50">
              <span className="text-muted-foreground">User ID</span>
              <code className="font-mono text-xs bg-muted px-2 py-1 rounded">{user.id}</code>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-muted-foreground">Account Created</span>
              <span className="font-medium">
                {new Date(user.created_at).toLocaleDateString()}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* API Integration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Code className="mr-2 h-5 w-5" />
              NinjaTrader Integration
            </CardTitle>
            <CardDescription>Connect your NinjaTrader platform to automatically log trades</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">API Endpoint</h4>
              <code className="block bg-muted p-3 rounded-md text-xs overflow-x-auto">
                POST {process.env.NEXT_PUBLIC_SITE_URL || 'https://your-domain.com'}/api/collect-trade
              </code>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Your User ID</h4>
              <code className="block bg-muted p-3 rounded-md text-xs overflow-x-auto">
                {user.id}
              </code>
              <p className="text-xs text-muted-foreground mt-1">
                Include this in your API requests
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Example Request</h4>
              <pre className="bg-muted p-3 rounded-md text-xs overflow-x-auto">
{`{
  "timestamp": "2025-01-01T14:33:00Z",
  "symbol": "MNQ",
  "side": "LONG",
  "quantity": 1,
  "entry_price": 18000.50,
  "exit_price": 18004.00,
  "pnl": 70.00,
  "setup": "Trend Continuation",
  "tags": ["Followed Plan"],
  "user_id": "${user.id}",
  "api_key": "your-api-key"
}`}
              </pre>
            </div>

            <div className="rounded-lg border border-profit/30 bg-profit/5 p-4">
              <h4 className="font-semibold mb-2 text-profit">Setup Instructions</h4>
              <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                <li>Copy your User ID above</li>
                <li>Configure your API key in .env.local (API_SECRET_KEY)</li>
                <li>Use the endpoint above in your NinjaTrader script</li>
                <li>Send POST requests with trade data after each trade closes</li>
              </ol>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

