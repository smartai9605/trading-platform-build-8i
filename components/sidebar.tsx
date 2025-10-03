"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Newspaper, TrendingUp, Menu, Bell, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { useAuth } from "@/hooks/useAuth"

const navigation = [
  {
    name: "Portfolio",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    name: "AI News",
    href: "/ai-news",
    icon: Newspaper,
  },
  {
    name: "Profit/Loss",
    href: "/profit-loss",
    icon: TrendingUp,
  },
  {
    name: "Alerts",
    href: "/alerts",
    icon: Bell,
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const { user, logout } = useAuth()

  // Hide sidebar on auth pages
  if (pathname === '/signin' || pathname === '/signup') {
    return null
  }

  // Get user initials
  const getInitials = () => {
    if (user) {
      return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase()
    }
    return 'U'
  }

  return (
    <div
      className={cn(
        "flex flex-col border-r border-sidebar-border bg-sidebar transition-all duration-300",
        isCollapsed ? "w-16" : "w-64",
      )}
    >
      <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-4">
        {!isCollapsed && <h1 className="font-mono text-xl font-bold text-primary">TradeHub</h1>}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-sidebar-foreground hover:bg-sidebar-accent"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      <nav className="flex-1 space-y-1 p-3">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              )}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {!isCollapsed && <span>{item.name}</span>}
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-sidebar-border p-4">
        <div className={cn("flex items-center gap-3", isCollapsed ? "justify-center" : "justify-between")}>
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-mono font-bold text-sm">
              {getInitials()}
            </div>
            {!isCollapsed && user && (
              <div className="flex flex-col min-w-0 flex-1">
                <span className="text-sm font-medium text-sidebar-foreground truncate">
                  {user.firstName} {user.lastName}
                </span>
                <span className="text-xs text-muted-foreground truncate">{user.email}</span>
              </div>
            )}
          </div>
          {!isCollapsed && (
            <Button
              variant="ghost"
              size="icon"
              onClick={logout}
              className="text-sidebar-foreground hover:bg-sidebar-accent shrink-0"
              title="Logout"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
