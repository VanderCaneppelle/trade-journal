"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { DailyStats } from '@/lib/metrics'
import { formatCurrency } from '@/lib/utils'

interface TradingCalendarProps {
  dailyStats: DailyStats[]
}

export function TradingCalendar({ dailyStats }: TradingCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const firstDayOfMonth = new Date(year, month, 1)
  const lastDayOfMonth = new Date(year, month + 1, 0)
  const daysInMonth = lastDayOfMonth.getDate()
  const startingDayOfWeek = firstDayOfMonth.getDay()

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  // Create a map of dates to stats
  const statsMap = new Map<string, DailyStats>()
  dailyStats.forEach(stat => {
    statsMap.set(stat.date, stat)
  })

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1))
  }

  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1))
  }

  const goToToday = () => {
    setCurrentDate(new Date())
  }

  const getPnLColor = (pnl: number) => {
    if (pnl > 0) return 'bg-profit/20 border-profit/40 hover:bg-profit/30'
    if (pnl < 0) return 'bg-loss/20 border-loss/40 hover:bg-loss/30'
    return 'bg-muted/20 border-border/40 hover:bg-muted/30'
  }

  const getPnLIntensity = (pnl: number, maxPnl: number) => {
    const intensity = Math.abs(pnl) / maxPnl
    return Math.min(intensity * 100, 100)
  }

  const maxPnl = Math.max(...dailyStats.map(s => Math.abs(s.pnl)))

  // Generate calendar days
  const calendarDays = []
  
  // Add empty cells for days before the month starts
  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarDays.push(
      <div key={`empty-${i}`} className="aspect-square p-2" />
    )
  }

  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    const stats = statsMap.get(dateStr)
    const isToday = new Date().toDateString() === new Date(year, month, day).toDateString()

    calendarDays.push(
      <div
        key={day}
        className={cn(
          "aspect-square p-2 border rounded-lg transition-all cursor-pointer",
          stats ? getPnLColor(stats.pnl) : "border-border/40 hover:bg-accent/50",
          isToday && "ring-2 ring-profit"
        )}
      >
        <div className="flex flex-col h-full">
          <div className={cn(
            "text-sm font-semibold mb-1",
            isToday && "text-profit"
          )}>
            {day}
          </div>
          {stats && (
            <div className="flex-1 flex flex-col justify-between text-xs">
              <div className={cn(
                "font-bold",
                stats.pnl >= 0 ? "text-profit" : "text-loss"
              )}>
                {formatCurrency(stats.pnl)}
              </div>
              <div className="text-muted-foreground">
                {stats.trades} {stats.trades === 1 ? 'trade' : 'trades'}
              </div>
              <div className="text-muted-foreground">
                {stats.winRate.toFixed(0)}% WR
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Trading Calendar</CardTitle>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={goToToday}>
              Today
            </Button>
            <Button variant="outline" size="icon" onClick={goToPreviousMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="font-semibold min-w-[140px] text-center">
              {monthNames[month]} {year}
            </span>
            <Button variant="outline" size="icon" onClick={goToNextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-2">
          {/* Day headers */}
          {dayNames.map(day => (
            <div key={day} className="text-center text-sm font-semibold text-muted-foreground p-2">
              {day}
            </div>
          ))}
          
          {/* Calendar days */}
          {calendarDays}
        </div>

        {/* Legend */}
        <div className="mt-6 flex items-center justify-center space-x-6 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded bg-profit/20 border border-profit/40" />
            <span className="text-muted-foreground">Profitable Day</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded bg-loss/20 border border-loss/40" />
            <span className="text-muted-foreground">Loss Day</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded border-2 border-profit" />
            <span className="text-muted-foreground">Today</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

