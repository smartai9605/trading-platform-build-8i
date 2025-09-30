"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, DollarSign, Percent } from "lucide-react"
import { Line, LineChart, Bar, BarChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const performanceData = [
  { date: "Jan", profit: 1250, loss: -450, net: 800 },
  { date: "Feb", profit: 2100, loss: -680, net: 1420 },
  { date: "Mar", profit: 1800, loss: -920, net: 880 },
  { date: "Apr", profit: 2450, loss: -550, net: 1900 },
  { date: "May", profit: 3200, loss: -1100, net: 2100 },
  { date: "Jun", profit: 2800, loss: -780, net: 2020 },
]

const positionPL = [
  { symbol: "AAPL", realized: 1250, unrealized: 212.5, total: 1462.5 },
  { symbol: "TSLA", realized: -450, unrealized: -183.75, total: -633.75 },
  { symbol: "NVDA", realized: 2100, unrealized: 801, total: 2901 },
  { symbol: "MSFT", realized: 880, unrealized: 145, total: 1025 },
  { symbol: "GOOGL", realized: -320, unrealized: 92, total: -228 },
]

const metrics = [
  { label: "Total Realized P/L", value: 3460, change: 12.5, icon: DollarSign },
  { label: "Total Unrealized P/L", value: 1066.75, change: 8.2, icon: TrendingUp },
  { label: "Win Rate", value: 68.5, change: 3.1, icon: Percent, isPercentage: true },
  { label: "Average Win", value: 1850, change: 5.4, icon: TrendingUp },
]

export default function ProfitLossPage() {
  const totalPL = metrics[0].value + metrics[1].value
  const totalChange = (totalPL / (totalPL - metrics[0].value * (metrics[0].change / 100)) - 1) * 100

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Profit & Loss</h1>
        <p className="text-muted-foreground">Track your trading performance and analyze your results</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => {
          const Icon = metric.icon
          const isPositive = metric.change >= 0
          return (
            <Card key={metric.label} className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardDescription className="text-sm font-medium text-muted-foreground">{metric.label}</CardDescription>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold font-mono text-foreground">
                  {metric.isPercentage ? `${metric.value}%` : `$${metric.value.toLocaleString()}`}
                </div>
                <p className={`text-xs flex items-center gap-1 ${isPositive ? "text-success" : "text-destructive"}`}>
                  {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  {isPositive ? "+" : ""}
                  {metric.change.toFixed(1)}% from last month
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Performance Over Time</CardTitle>
            <CardDescription className="text-muted-foreground">Monthly profit and loss breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                profit: {
                  label: "Profit",
                  color: "hsl(var(--success))",
                },
                loss: {
                  label: "Loss",
                  color: "hsl(var(--destructive))",
                },
                net: {
                  label: "Net P/L",
                  color: "hsl(var(--primary))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="profit"
                    stroke="var(--color-profit)"
                    strokeWidth={2}
                    name="Profit"
                    dot={{ fill: "var(--color-profit)" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="net"
                    stroke="var(--color-net)"
                    strokeWidth={2}
                    name="Net P/L"
                    dot={{ fill: "var(--color-net)" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">P/L by Position</CardTitle>
            <CardDescription className="text-muted-foreground">Realized vs unrealized gains/losses</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                realized: {
                  label: "Realized",
                  color: "hsl(var(--primary))",
                },
                unrealized: {
                  label: "Unrealized",
                  color: "hsl(var(--chart-2))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={positionPL}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="symbol" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Bar dataKey="realized" fill="var(--color-realized)" name="Realized" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="unrealized" fill="var(--color-unrealized)" name="Unrealized" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Detailed Position P/L</CardTitle>
          <CardDescription className="text-muted-foreground">
            Breakdown of realized and unrealized gains/losses
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {positionPL.map((position) => (
              <div
                key={position.symbol}
                className="flex items-center justify-between rounded-lg border border-border bg-secondary/50 p-4"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 font-mono font-bold text-primary">
                    {position.symbol.slice(0, 2)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{position.symbol}</h3>
                    <p className="text-sm text-muted-foreground">Position P/L</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-8 text-right">
                  <div>
                    <p className="text-xs text-muted-foreground">Realized</p>
                    <p
                      className={`font-mono font-medium ${position.realized >= 0 ? "text-success" : "text-destructive"}`}
                    >
                      {position.realized >= 0 ? "+" : ""}${position.realized.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Unrealized</p>
                    <p
                      className={`font-mono font-medium ${position.unrealized >= 0 ? "text-success" : "text-destructive"}`}
                    >
                      {position.unrealized >= 0 ? "+" : ""}${position.unrealized.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Total</p>
                    <p className={`font-mono font-bold ${position.total >= 0 ? "text-success" : "text-destructive"}`}>
                      {position.total >= 0 ? "+" : ""}${position.total.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
