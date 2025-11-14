"use client"

import { Card, CardContent } from '@/components/ui/card'
import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

interface KPICardProps {
  title: string
  value: string | number
  subtitle?: string
  icon?: LucideIcon
  trend?: 'up' | 'down' | 'neutral'
  trendValue?: string
  valueColor?: 'profit' | 'loss' | 'neutral'
  delay?: number
}

export function KPICard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendValue,
  valueColor = 'neutral',
  delay = 0,
}: KPICardProps) {
  const colorClasses = {
    profit: 'text-profit',
    loss: 'text-loss',
    neutral: 'text-foreground',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
    >
      <Card className="relative overflow-hidden group hover:border-profit/30 transition-all duration-300">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="space-y-2 flex-1">
              <p className="text-sm font-medium text-muted-foreground">
                {title}
              </p>
              <p className={cn("text-3xl font-bold", colorClasses[valueColor])}>
                {value}
              </p>
              {subtitle && (
                <p className="text-xs text-muted-foreground">{subtitle}</p>
              )}
              {trendValue && (
                <div className="flex items-center space-x-1">
                  <span
                    className={cn(
                      "text-xs font-medium",
                      trend === 'up' && "text-profit",
                      trend === 'down' && "text-loss",
                      trend === 'neutral' && "text-muted-foreground"
                    )}
                  >
                    {trendValue}
                  </span>
                </div>
              )}
            </div>
            {Icon && (
              <div className="rounded-lg bg-profit/10 p-3 group-hover:bg-profit/20 transition-colors">
                <Icon className="h-5 w-5 text-profit" />
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

