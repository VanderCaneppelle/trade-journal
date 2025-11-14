"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { Database } from '@/lib/supabase/database.types'

type Trade = Database['public']['Tables']['trades']['Row']

interface WinLossDistributionProps {
  trades: Trade[]
}

export function WinLossDistribution({ trades }: WinLossDistributionProps) {
  // Create distribution buckets
  const buckets = [
    { range: '< -$200', min: -Infinity, max: -200, count: 0, color: 'hsl(0, 84%, 50%)' },
    { range: '-$200 to -$100', min: -200, max: -100, count: 0, color: 'hsl(0, 84%, 55%)' },
    { range: '-$100 to -$50', min: -100, max: -50, count: 0, color: 'hsl(0, 84%, 60%)' },
    { range: '-$50 to $0', min: -50, max: 0, count: 0, color: 'hsl(0, 84%, 65%)' },
    { range: '$0 to $50', min: 0, max: 50, count: 0, color: 'hsl(142, 76%, 40%)' },
    { range: '$50 to $100', min: 50, max: 100, count: 0, color: 'hsl(142, 76%, 42%)' },
    { range: '$100 to $200', min: 100, max: 200, count: 0, color: 'hsl(142, 76%, 44%)' },
    { range: '> $200', min: 200, max: Infinity, count: 0, color: 'hsl(142, 76%, 46%)' },
  ]

  trades.forEach(trade => {
    const bucket = buckets.find(b => trade.pnl >= b.min && trade.pnl < b.max)
    if (bucket) bucket.count++
  })

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Win/Loss Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={buckets}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              dataKey="range"
              stroke="hsl(var(--muted-foreground))"
              style={{ fontSize: '11px' }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis
              stroke="hsl(var(--muted-foreground))"
              style={{ fontSize: '12px' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--popover))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                fontSize: '12px',
              }}
              formatter={(value: number) => [value, 'Trades']}
            />
            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
              {buckets.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

