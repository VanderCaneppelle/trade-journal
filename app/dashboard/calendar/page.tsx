import { createServerSupabaseClient } from '@/lib/supabase/server'
import { Header } from '@/components/header'
import { TradingCalendar } from '@/components/calendar/trading-calendar'
import { KPICard } from '@/components/dashboard/kpi-card'
import { calculateDailyStats, calculateMetrics } from '@/lib/metrics'
import { formatCurrency, formatNumber } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export default async function CalendarPage() {
  const supabase = await createServerSupabaseClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return null
  }

  // Fetch all trades from the last 90 days for calendar view
  const ninetyDaysAgo = new Date()
  ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90)
  
  const { data: trades } = await supabase
    .from('trades')
    .select('*')
    .eq('user_id', user.id)
    .gte('timestamp', ninetyDaysAgo.toISOString())
    .order('timestamp', { ascending: false })

  const allTrades = trades || []
  
  const dailyStats = calculateDailyStats(allTrades)
  const metrics = calculateMetrics(allTrades)

  // Calculate some specific calendar metrics
  const profitableDays = dailyStats.filter(d => d.pnl > 0).length
  const totalDays = dailyStats.length
  const profitableDaysPercent = totalDays > 0 ? (profitableDays / totalDays) * 100 : 0
  
  const bestDay = dailyStats.length > 0 
    ? dailyStats.reduce((best, day) => day.pnl > best.pnl ? day : best, dailyStats[0])
    : null
    
  const worstDay = dailyStats.length > 0
    ? dailyStats.reduce((worst, day) => day.pnl < worst.pnl ? day : worst, dailyStats[0])
    : null

  return (
    <div className="flex flex-col min-h-screen">
      <Header 
        title="Calendar" 
        subtitle="Daily performance tracking"
      />
      
      <div className="flex-1 p-6 space-y-6">
        <div>
          <h2 className="text-3xl font-bold">Trading Calendar</h2>
          <p className="text-muted-foreground">View your daily trading performance at a glance</p>
        </div>

        {/* Summary KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard
            title="Total Trading Days"
            value={totalDays}
            subtitle="in the last 90 days"
            icon="Activity"
          />
          
          <KPICard
            title="Profitable Days"
            value={`${formatNumber(profitableDaysPercent, 1)}%`}
            subtitle={`${profitableDays} of ${totalDays} days`}
            icon="TrendingUp"
            valueColor={profitableDaysPercent >= 60 ? 'profit' : 'neutral'}
          />
          
          <KPICard
            title="Best Day"
            value={bestDay ? formatCurrency(bestDay.pnl) : '$0'}
            subtitle={bestDay ? new Date(bestDay.date).toLocaleDateString() : '-'}
            icon="Award"
            valueColor="profit"
          />
          
          <KPICard
            title="Worst Day"
            value={worstDay ? formatCurrency(worstDay.pnl) : '$0'}
            subtitle={worstDay ? new Date(worstDay.date).toLocaleDateString() : '-'}
            icon="Target"
            valueColor="loss"
          />
        </div>

        {/* Calendar */}
        <TradingCalendar dailyStats={dailyStats} />
      </div>
    </div>
  )
}

