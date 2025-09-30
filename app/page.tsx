import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowUpRight, ArrowDownRight, X } from "lucide-react"

const openPositions = [
  {
    symbol: "AAPL",
    name: "Apple Inc.",
    shares: 50,
    avgPrice: 178.25,
    currentPrice: 182.5,
    value: 9125,
    profitLoss: 212.5,
    profitLossPercent: 2.38,
  },
  {
    symbol: "TSLA",
    name: "Tesla Inc.",
    shares: 25,
    avgPrice: 245.8,
    currentPrice: 238.45,
    value: 5961.25,
    profitLoss: -183.75,
    profitLossPercent: -2.99,
  },
  {
    symbol: "NVDA",
    name: "NVIDIA Corp.",
    shares: 30,
    avgPrice: 485.6,
    currentPrice: 512.3,
    value: 15369,
    profitLoss: 801,
    profitLossPercent: 5.5,
  },
]

export default function PortfolioPage() {
  const totalValue = openPositions.reduce((sum, pos) => sum + pos.value, 0)
  const totalProfitLoss = openPositions.reduce((sum, pos) => sum + pos.profitLoss, 0)
  const cashBalance = 25430.75

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Portfolio</h1>
          <p className="text-muted-foreground">Manage your positions and execute trades</p>
        </div>
        <div className="flex gap-3">
          <Button className="bg-success text-success-foreground hover:bg-success/90">
            <ArrowUpRight className="mr-2 h-4 w-4" />
            Buy
          </Button>
          <Button variant="destructive">
            <ArrowDownRight className="mr-2 h-4 w-4" />
            Sell
          </Button>
          <Button
            variant="outline"
            className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground bg-transparent"
          >
            <X className="mr-2 h-4 w-4" />
            Close All Positions
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardDescription className="text-muted-foreground">Total Portfolio Value</CardDescription>
            <CardTitle className="text-3xl font-mono text-foreground">
              ${totalValue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </CardTitle>
          </CardHeader>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardDescription className="text-muted-foreground">Cash Balance</CardDescription>
            <CardTitle className="text-3xl font-mono text-foreground">
              ${cashBalance.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </CardTitle>
          </CardHeader>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardDescription className="text-muted-foreground">Total P/L</CardDescription>
            <CardTitle className={`text-3xl font-mono ${totalProfitLoss >= 0 ? "text-success" : "text-destructive"}`}>
              {totalProfitLoss >= 0 ? "+" : ""}$
              {totalProfitLoss.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Open Positions</CardTitle>
          <CardDescription className="text-muted-foreground">Your current holdings and performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {openPositions.map((position) => (
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
                    <p className="text-sm text-muted-foreground">{position.name}</p>
                  </div>
                </div>

                <div className="grid grid-cols-5 gap-8 text-right">
                  <div>
                    <p className="text-xs text-muted-foreground">Shares</p>
                    <p className="font-mono font-medium text-foreground">{position.shares}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Avg Price</p>
                    <p className="font-mono font-medium text-foreground">${position.avgPrice.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Current</p>
                    <p className="font-mono font-medium text-foreground">${position.currentPrice.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Value</p>
                    <p className="font-mono font-medium text-foreground">${position.value.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">P/L</p>
                    <p
                      className={`font-mono font-medium ${position.profitLoss >= 0 ? "text-success" : "text-destructive"}`}
                    >
                      {position.profitLoss >= 0 ? "+" : ""}${position.profitLoss.toFixed(2)}
                      <span className="ml-1 text-xs">
                        ({position.profitLossPercent >= 0 ? "+" : ""}
                        {position.profitLossPercent.toFixed(2)}%)
                      </span>
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
