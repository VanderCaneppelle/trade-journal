import { createServerSupabaseClient } from '@/lib/supabase/server'
import { Header } from '@/components/header'
import { KPICard } from '@/components/dashboard/kpi-card'
import { EquityChart } from '@/components/dashboard/equity-chart'
import { DailyPnLChart } from '@/components/dashboard/daily-pnl-chart'
import { TradesTable } from '@/components/dashboard/trades-table'
import { 
  calculateMetrics, 
  calculateEquityCurve, 
  calculateDailyStats 
} from '@/lib/metrics'
import { formatCurrency, formatNumber } from '@/lib/utils'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const supabase = await createServerSupabaseClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return null
  }

  // Fetch trades for the last 30 days
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  
  const { data: trades, error } = await supabase
    .from('trades')
    .select('*')
    .eq('user_id', user.id)
    .gte('timestamp', thirtyDaysAgo.toISOString())
    .order('timestamp', { ascending: false })

  const allTrades = trades || []
  
  // Calculate metrics
  const metrics = calculateMetrics(allTrades)
  const equityCurve = calculateEquityCurve(allTrades)
  const dailyStats = calculateDailyStats(allTrades)

  return (
    <div className="flex flex-col min-h-screen">
      <Header 
        title="Dashboard" 
        subtitle="Last 30 Days"
      />
      
      <div className="flex-1 p-6 space-y-6">
        {/* Time Period Selector */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold">Performance Overview</h2>
            <p className="text-muted-foreground">Track your trading metrics and performance</p>
          </div>
          <Tabs defaultValue="30d">
            <TabsList>
              <TabsTrigger value="7d">7d</TabsTrigger>
              <TabsTrigger value="30d">30d</TabsTrigger>
              <TabsTrigger value="90d">90d</TabsTrigger>
              <TabsTrigger value="1y">1y</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard
            title="Current P&L"
            value={formatCurrency(metrics.totalPnL)}
            subtitle={`${metrics.totalTrades} total trades`}
            icon="DollarSign"
            valueColor={metrics.totalPnL >= 0 ? 'profit' : 'loss'}
            delay={0}
          />
          
          <KPICard
            title="Average Trades"
            value={formatNumber(metrics.totalTrades / 30, 1)}
            subtitle="per day"
            icon="Activity"
            delay={0.1}
          />
          
          <KPICard
            title="Average Daily Profit"
            value={formatCurrency(metrics.averageDailyProfit)}
            icon="TrendingUp"
            valueColor={metrics.averageDailyProfit >= 0 ? 'profit' : 'loss'}
            delay={0.2}
          />
          
          <KPICard
            title="Win Rate"
            value={`${formatNumber(metrics.winRate, 1)}%`}
            subtitle={`${metrics.winningTrades}W / ${metrics.losingTrades}L`}
            icon="Target"
            valueColor={metrics.winRate >= 50 ? 'profit' : 'loss'}
            delay={0.3}
          />
        </div>

        {/* Secondary KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard
            title="Assertividade"
            value={`${formatNumber(metrics.assertiveness, 1)}%`}
            subtitle={
              metrics.assertiveness >= 70 ? "🎯 Excelente precisão" :
              metrics.assertiveness >= 50 ? "✅ Boa assertividade" :
              "⚠️ Precisa melhorar"
            }
            icon="Target"
            valueColor={metrics.assertiveness >= 70 ? 'profit' : metrics.assertiveness >= 50 ? 'neutral' : 'loss'}
            delay={0.4}
          />
          
          <KPICard
            title="Profit Factor"
            value={formatNumber(metrics.profitFactor, 2)}
            subtitle="✨ Excellent strategy"
            icon="BarChart3"
            valueColor={metrics.profitFactor >= 1.5 ? 'profit' : metrics.profitFactor >= 1 ? 'neutral' : 'loss'}
            delay={0.5}
          />
          
          <KPICard
            title="Consistency Score"
            value={formatNumber(metrics.consistencyScore, 0)}
            subtitle="⚡ Moderate consistency"
            icon="Percent"
            valueColor={metrics.consistencyScore >= 60 ? 'profit' : 'neutral'}
            delay={0.6}
          />
          
          <KPICard
            title="Sharpe Ratio"
            value={formatNumber(metrics.sharpeRatio, 2)}
            subtitle="📊 Good risk-adjusted returns"
            icon="TrendingUp"
            valueColor={metrics.sharpeRatio >= 1 ? 'profit' : 'neutral'}
            delay={0.7}
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <EquityChart data={equityCurve} />
          <DailyPnLChart data={dailyStats} />
        </div>

        {/* Trades Table */}
        <TradesTable trades={allTrades.slice(0, 20)} />
      </div>
    </div>
  )
}

