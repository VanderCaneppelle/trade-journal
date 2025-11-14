import { Database } from './supabase/database.types'

type Trade = Database['public']['Tables']['trades']['Row']

export interface TradeMetrics {
  totalTrades: number
  winningTrades: number
  losingTrades: number
  winRate: number
  totalPnL: number
  averageTrade: number
  averageDailyProfit: number
  profitFactor: number
  sharpeRatio: number
  maxDrawdown: number
  maxDrawdownPercent: number
  consistencyScore: number
  largestWin: number
  largestLoss: number
  averageWin: number
  averageLoss: number
  expectancy: number
}

export function calculateMetrics(trades: Trade[]): TradeMetrics {
  if (trades.length === 0) {
    return {
      totalTrades: 0,
      winningTrades: 0,
      losingTrades: 0,
      winRate: 0,
      totalPnL: 0,
      averageTrade: 0,
      averageDailyProfit: 0,
      profitFactor: 0,
      sharpeRatio: 0,
      maxDrawdown: 0,
      maxDrawdownPercent: 0,
      consistencyScore: 0,
      largestWin: 0,
      largestLoss: 0,
      averageWin: 0,
      averageLoss: 0,
      expectancy: 0,
    }
  }

  const totalTrades = trades.length
  const winningTrades = trades.filter(t => t.pnl > 0).length
  const losingTrades = trades.filter(t => t.pnl <= 0).length
  const winRate = (winningTrades / totalTrades) * 100

  const totalPnL = trades.reduce((sum, t) => sum + t.pnl, 0)
  const averageTrade = totalPnL / totalTrades

  // Calculate daily profits
  const dailyProfits = calculateDailyProfits(trades)
  const averageDailyProfit = dailyProfits.reduce((sum, p) => sum + p, 0) / dailyProfits.length

  // Profit Factor
  const grossProfit = trades.filter(t => t.pnl > 0).reduce((sum, t) => sum + t.pnl, 0)
  const grossLoss = Math.abs(trades.filter(t => t.pnl < 0).reduce((sum, t) => sum + t.pnl, 0))
  const profitFactor = grossLoss === 0 ? grossProfit : grossProfit / grossLoss

  // Sharpe Ratio (simplified - using daily returns)
  const sharpeRatio = calculateSharpeRatio(dailyProfits)

  // Max Drawdown
  const { maxDrawdown, maxDrawdownPercent } = calculateMaxDrawdown(trades)

  // Consistency Score (0-100, based on percentage of profitable days)
  const profitableDays = dailyProfits.filter(p => p > 0).length
  const consistencyScore = dailyProfits.length > 0 ? (profitableDays / dailyProfits.length) * 100 : 0

  // Win/Loss stats
  const wins = trades.filter(t => t.pnl > 0)
  const losses = trades.filter(t => t.pnl < 0)
  
  const largestWin = wins.length > 0 ? Math.max(...wins.map(t => t.pnl)) : 0
  const largestLoss = losses.length > 0 ? Math.min(...losses.map(t => t.pnl)) : 0
  const averageWin = wins.length > 0 ? wins.reduce((sum, t) => sum + t.pnl, 0) / wins.length : 0
  const averageLoss = losses.length > 0 ? losses.reduce((sum, t) => sum + t.pnl, 0) / losses.length : 0

  // Expectancy
  const expectancy = (winRate / 100) * averageWin + ((100 - winRate) / 100) * averageLoss

  return {
    totalTrades,
    winningTrades,
    losingTrades,
    winRate,
    totalPnL,
    averageTrade,
    averageDailyProfit,
    profitFactor,
    sharpeRatio,
    maxDrawdown,
    maxDrawdownPercent,
    consistencyScore,
    largestWin,
    largestLoss,
    averageWin,
    averageLoss,
    expectancy,
  }
}

function calculateDailyProfits(trades: Trade[]): number[] {
  const dailyMap = new Map<string, number>()
  
  trades.forEach(trade => {
    const date = new Date(trade.timestamp).toISOString().split('T')[0]
    const current = dailyMap.get(date) || 0
    dailyMap.set(date, current + trade.pnl)
  })
  
  return Array.from(dailyMap.values())
}

function calculateSharpeRatio(dailyProfits: number[]): number {
  if (dailyProfits.length < 2) return 0
  
  const mean = dailyProfits.reduce((sum, p) => sum + p, 0) / dailyProfits.length
  const squaredDiffs = dailyProfits.map(p => Math.pow(p - mean, 2))
  const variance = squaredDiffs.reduce((sum, d) => sum + d, 0) / dailyProfits.length
  const stdDev = Math.sqrt(variance)
  
  if (stdDev === 0) return 0
  
  // Sharpe Ratio = (Mean Return) / (Std Dev of Returns)
  // Multiply by sqrt(252) to annualize (trading days in a year)
  return (mean / stdDev) * Math.sqrt(252)
}

function calculateMaxDrawdown(trades: Trade[]): { maxDrawdown: number; maxDrawdownPercent: number } {
  if (trades.length === 0) return { maxDrawdown: 0, maxDrawdownPercent: 0 }
  
  // Sort trades by timestamp
  const sortedTrades = [...trades].sort((a, b) => 
    new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  )
  
  let peak = 0
  let maxDrawdown = 0
  let maxDrawdownPercent = 0
  let currentEquity = 0
  
  sortedTrades.forEach(trade => {
    currentEquity += trade.pnl
    
    if (currentEquity > peak) {
      peak = currentEquity
    }
    
    const drawdown = peak - currentEquity
    const drawdownPercent = peak > 0 ? (drawdown / peak) * 100 : 0
    
    if (drawdown > maxDrawdown) {
      maxDrawdown = drawdown
      maxDrawdownPercent = drawdownPercent
    }
  })
  
  return { maxDrawdown, maxDrawdownPercent }
}

export interface EquityPoint {
  date: string
  equity: number
  pnl: number
}

export function calculateEquityCurve(trades: Trade[]): EquityPoint[] {
  if (trades.length === 0) return []
  
  const sortedTrades = [...trades].sort((a, b) => 
    new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  )
  
  let equity = 0
  const equityCurve: EquityPoint[] = []
  
  sortedTrades.forEach(trade => {
    equity += trade.pnl
    equityCurve.push({
      date: new Date(trade.timestamp).toISOString().split('T')[0],
      equity: equity,
      pnl: trade.pnl,
    })
  })
  
  return equityCurve
}

export interface DailyStats {
  date: string
  pnl: number
  trades: number
  wins: number
  losses: number
  winRate: number
}

export function calculateDailyStats(trades: Trade[]): DailyStats[] {
  const dailyMap = new Map<string, Trade[]>()
  
  trades.forEach(trade => {
    const date = new Date(trade.timestamp).toISOString().split('T')[0]
    const current = dailyMap.get(date) || []
    current.push(trade)
    dailyMap.set(date, current)
  })
  
  return Array.from(dailyMap.entries()).map(([date, dayTrades]) => {
    const pnl = dayTrades.reduce((sum, t) => sum + t.pnl, 0)
    const wins = dayTrades.filter(t => t.pnl > 0).length
    const losses = dayTrades.filter(t => t.pnl <= 0).length
    const winRate = dayTrades.length > 0 ? (wins / dayTrades.length) * 100 : 0
    
    return {
      date,
      pnl,
      trades: dayTrades.length,
      wins,
      losses,
      winRate,
    }
  }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
}

export interface SetupStats {
  setup: string
  trades: number
  wins: number
  losses: number
  winRate: number
  totalPnL: number
  averagePnL: number
}

export function calculateSetupStats(trades: Trade[]): SetupStats[] {
  const setupMap = new Map<string, Trade[]>()
  
  trades.forEach(trade => {
    const setup = trade.setup || 'No Setup'
    const current = setupMap.get(setup) || []
    current.push(trade)
    setupMap.set(setup, current)
  })
  
  return Array.from(setupMap.entries()).map(([setup, setupTrades]) => {
    const wins = setupTrades.filter(t => t.pnl > 0).length
    const losses = setupTrades.filter(t => t.pnl <= 0).length
    const totalPnL = setupTrades.reduce((sum, t) => sum + t.pnl, 0)
    const winRate = setupTrades.length > 0 ? (wins / setupTrades.length) * 100 : 0
    
    return {
      setup,
      trades: setupTrades.length,
      wins,
      losses,
      winRate,
      totalPnL,
      averagePnL: totalPnL / setupTrades.length,
    }
  }).sort((a, b) => b.totalPnL - a.totalPnL)
}

