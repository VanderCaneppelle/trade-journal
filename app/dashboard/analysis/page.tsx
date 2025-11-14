import { createServerSupabaseClient } from '@/lib/supabase/server'
import { Header } from '@/components/header'
import { KPICard } from '@/components/dashboard/kpi-card'
import { SetupPerformance } from '@/components/analysis/setup-performance'
import { WinLossDistribution } from '@/components/analysis/win-loss-distribution'
import { HourlyHeatmap } from '@/components/analysis/hourly-heatmap'
import { calculateMetrics, calculateSetupStats } from '@/lib/metrics'
import { formatCurrency, formatNumber } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export default async function AnalysisPage() {
  const supabase = await createServerSupabaseClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return null
  }

  // Fetch all trades for comprehensive analysis
  const { data: trades } = await supabase
    .from('trades')
    .select('*')
    .eq('user_id', user.id)
    .order('timestamp', { ascending: false })

  const allTrades = trades || []
  
  const metrics = calculateMetrics(allTrades)
  const setupStats = calculateSetupStats(allTrades)

  return (
    <div className="flex flex-col min-h-screen">
      <Header 
        title="Analysis" 
        subtitle="Deep dive into your trading performance"
      />
      
      <div className="flex-1 p-6 space-y-6">
        <div>
          <h2 className="text-3xl font-bold">Advanced Analytics</h2>
          <p className="text-muted-foreground">Detailed breakdown of your trading patterns and performance</p>
        </div>

        {/* Advanced Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard
            title="Average Win"
            value={formatCurrency(metrics.averageWin)}
            subtitle="per winning trade"
            icon="TrendingUp"
            valueColor="profit"
          />
          
          <KPICard
            title="Average Loss"
            value={formatCurrency(metrics.averageLoss)}
            subtitle="per losing trade"
            icon="Target"
            valueColor="loss"
          />
          
          <KPICard
            title="Largest Win"
            value={formatCurrency(metrics.largestWin)}
            subtitle="🎯 Best trade"
            icon="Award"
            valueColor="profit"
          />
          
          <KPICard
            title="Expectancy"
            value={formatCurrency(metrics.expectancy)}
            subtitle="per trade"
            icon="Zap"
            valueColor={metrics.expectancy >= 0 ? 'profit' : 'loss'}
          />
        </div>

        {/* Risk Metrics */}
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
          />
          
          <KPICard
            title="R:R Ratio"
            value={formatNumber(Math.abs(metrics.averageWin / metrics.averageLoss), 2)}
            subtitle="Risk/Reward ratio"
          />
          
          <KPICard
            title="Max DD %"
            value={`${formatNumber(metrics.maxDrawdownPercent, 2)}%`}
            subtitle="Maximum drawdown"
            valueColor="loss"
          />
          
          <KPICard
            title="Max Drawdown"
            value={formatCurrency(metrics.maxDrawdown)}
            subtitle="⚠ Largest drawdown"
            icon="TrendingDown"
            valueColor="loss"
          />
        </div>

        {/* Charts and Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SetupPerformance data={setupStats} />
          <WinLossDistribution trades={allTrades} />
        </div>

        {/* Heatmap */}
        <HourlyHeatmap trades={allTrades} />
      </div>
    </div>
  )
}

