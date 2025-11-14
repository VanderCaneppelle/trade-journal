import { createServerSupabaseClient } from '@/lib/supabase/server'
import { Header } from '@/components/header'
import { SetupManager } from '@/components/management/setup-manager'
import { TagManager } from '@/components/management/tag-manager'

export const dynamic = 'force-dynamic'

export default async function ManagementPage() {
  const supabase = await createServerSupabaseClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return null
  }

  // Fetch setups and tags
  const { data: setups } = await supabase
    .from('setups')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const { data: tags } = await supabase
    .from('tags')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="flex flex-col min-h-screen">
      <Header 
        title="Management" 
        subtitle="Manage your trading setups and tags"
      />
      
      <div className="flex-1 p-6 space-y-6">
        <div>
          <h2 className="text-3xl font-bold">Trade Management</h2>
          <p className="text-muted-foreground">Organize your trades with custom setups and tags</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SetupManager initialSetups={setups || []} />
          <TagManager initialTags={tags || []} />
        </div>

        {/* Info Card */}
        <div className="rounded-lg border border-border/50 bg-card/50 p-6">
          <h3 className="text-lg font-semibold mb-2">💡 Pro Tip</h3>
          <p className="text-muted-foreground">
            Use setups to categorize your trading strategies (e.g., "Trend Continuation", "Breakout", "Reversal"). 
            Use tags to add context to individual trades (e.g., "Followed Plan", "Emotional Trade", "Perfect Entry").
            This will help you analyze which strategies work best and identify patterns in your trading behavior.
          </p>
        </div>
      </div>
    </div>
  )
}

