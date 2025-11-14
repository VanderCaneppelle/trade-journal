"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { SetupStats } from '@/lib/metrics'
import { formatCurrency } from '@/lib/utils'

interface SetupPerformanceProps {
  data: SetupStats[]
}

export function SetupPerformance({ data }: SetupPerformanceProps) {
  const formatPercent = (value: number) => `${value.toFixed(1)}%`

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Performance by Setup</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Bar Chart */}
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis
                dataKey="setup"
                stroke="hsl(var(--muted-foreground))"
                style={{ fontSize: '12px' }}
              />
              <YAxis
                tickFormatter={formatCurrency}
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
                formatter={(value: number) => [formatCurrency(value), 'Total P&L']}
              />
              <Bar dataKey="totalPnL" radius={[4, 4, 0, 0]}>
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.totalPnL >= 0 ? 'hsl(142, 76%, 46%)' : 'hsl(0, 84%, 60%)'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>

          {/* Table */}
          <div className="rounded-md border border-border/50">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Setup</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Trades</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Win Rate</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Avg P&L</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Total P&L</th>
                </tr>
              </thead>
              <tbody>
                {data.map((setup, index) => (
                  <tr key={index} className="border-b border-border/50 last:border-0 hover:bg-accent/50">
                    <td className="px-4 py-3 font-medium">{setup.setup}</td>
                    <td className="px-4 py-3 text-right">{setup.trades}</td>
                    <td className="px-4 py-3 text-right">
                      <span className={setup.winRate >= 50 ? 'text-profit' : 'text-loss'}>
                        {formatPercent(setup.winRate)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className={setup.averagePnL >= 0 ? 'text-profit' : 'text-loss'}>
                        {formatCurrency(setup.averagePnL)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-bold">
                      <span className={setup.totalPnL >= 0 ? 'text-profit' : 'text-loss'}>
                        {formatCurrency(setup.totalPnL)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

