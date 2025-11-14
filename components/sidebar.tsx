"use client"

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { 
  LayoutDashboard, 
  Calendar, 
  TrendingUp, 
  Settings,
  FolderKanban,
  LogOut
} from 'lucide-react'
import { Button } from './ui/button'
import { Separator } from './ui/separator'
import { createClient } from '@/lib/supabase/client'

const navItems = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Calendar',
    href: '/dashboard/calendar',
    icon: Calendar,
  },
  {
    title: 'Analysis',
    href: '/dashboard/analysis',
    icon: TrendingUp,
  },
  {
    title: 'Management',
    href: '/dashboard/management',
    icon: FolderKanban,
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <div className="flex h-screen w-64 flex-col fixed left-0 top-0 border-r border-border/50 bg-card/50 backdrop-blur-md">
      {/* Logo */}
      <div className="flex h-16 items-center border-b border-border/50 px-6">
        <Link href="/dashboard" className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-profit to-profit-light flex items-center justify-center">
            <TrendingUp className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-profit to-profit-light bg-clip-text text-transparent">
            TradeJournal
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || pathname?.startsWith(item.href + '/')
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center space-x-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-profit/10 text-profit shadow-sm shadow-profit/20"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              <Icon className={cn("h-5 w-5", isActive && "text-profit")} />
              <span>{item.title}</span>
            </Link>
          )
        })}
      </nav>

      <Separator className="mx-3" />

      {/* Bottom Section */}
      <div className="space-y-1 px-3 py-4">
        <Link
          href="/dashboard/settings"
          className={cn(
            "flex items-center space-x-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
            pathname === '/dashboard/settings'
              ? "bg-profit/10 text-profit"
              : "text-muted-foreground hover:bg-accent hover:text-foreground"
          )}
        >
          <Settings className="h-5 w-5" />
          <span>Settings</span>
        </Link>
        
        <Button
          onClick={handleSignOut}
          variant="ghost"
          className="w-full justify-start text-muted-foreground hover:text-foreground"
        >
          <LogOut className="mr-3 h-5 w-5" />
          Sign Out
        </Button>
      </div>
    </div>
  )
}

