"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Database } from '@/lib/supabase/database.types'
import { cn } from '@/lib/utils'

type Trade = Database['public']['Tables']['trades']['Row']

interface HourlyHeatmapProps {
  trades: Trade[]
}

export function HourlyHeatmap({ trades }: HourlyHeatmapProps) {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const hours = Array.from({ length: 24 }, (_, i) => i)

  // Create a map for hour x day
  const heatmapData: Map<string, { count: number; pnl: number }> = new Map()

  trades.forEach(trade => {
    const date = new Date(trade.timestamp)
    const day = date.getDay()
    const hour = date.getHours()
    const key = `${day}-${hour}`
    
    const existing = heatmapData.get(key) || { count: 0, pnl: 0 }
    heatmapData.set(key, {
      count: existing.count + 1,
      pnl: existing.pnl + trade.pnl,
    })
  })

  // Find max values for normalization
  const maxCount = Math.max(...Array.from(heatmapData.values()).map(v => v.count), 1)

  const getColor = (day: number, hour: number) => {
    const key = `${day}-${hour}`
    const data = heatmapData.get(key)
    
    if (!data) return 'bg-muted/20'
    
    const intensity = Math.min((data.count / maxCount) * 100, 100)
    
    if (data.pnl >= 0) {
      if (intensity > 75) return 'bg-profit'
      if (intensity > 50) return 'bg-profit/80'
      if (intensity > 25) return 'bg-profit/60'
      return 'bg-profit/40'
    } else {
      if (intensity > 75) return 'bg-loss'
      if (intensity > 50) return 'bg-loss/80'
      if (intensity > 25) return 'bg-loss/60'
      return 'bg-loss/40'
    }
  }

  const getData = (day: number, hour: number) => {
    const key = `${day}-${hour}`
    return heatmapData.get(key)
  }

  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Trading Activity Heatmap</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <div className="min-w-[800px]">
            {/* Hours header */}
            <div className="flex mb-2">
              <div className="w-24" /> {/* Space for day labels */}
              {hours.filter(h => h % 2 === 0).map(hour => (
                <div key={hour} className="flex-1 text-center text-xs text-muted-foreground">
                  {hour}:00
                </div>
              ))}
            </div>

            {/* Heatmap grid */}
            <div className="space-y-1">
              {days.map((day, dayIndex) => (
                <div key={day} className="flex items-center">
                  <div className="w-24 text-sm font-medium text-muted-foreground pr-2">
                    {day}
                  </div>
                  <div className="flex-1 flex gap-1">
                    {hours.map(hour => {
                      const data = getData(dayIndex, hour)
                      return (
                        <div
                          key={hour}
                          className={cn(
                            "flex-1 h-8 rounded border border-border/30 transition-all cursor-pointer hover:ring-2 hover:ring-profit",
                            getColor(dayIndex, hour)
                          )}
                          title={data ? `${data.count} trades, $${data.pnl.toFixed(2)}` : 'No trades'}
                        />
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Legend */}
            <div className="mt-4 flex items-center justify-center space-x-6 text-xs">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded bg-profit" />
                <span className="text-muted-foreground">High Profit Activity</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded bg-loss" />
                <span className="text-muted-foreground">High Loss Activity</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded bg-muted/20 border border-border" />
                <span className="text-muted-foreground">No Activity</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

