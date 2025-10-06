"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowUpRight, ArrowDownRight, X } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

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

  const [accounts, setAccounts] = useState<any[]>([])
  const [openPositions, setOpenPositions] = useState<any[]>([])
  const [combinedPositions, setCombinedPositions] = useState<any[]>([])

  const getAccounts = async () => {
    const accounts = await fetch(`${BACKEND_URL}/portfolio`, {
    })
    console.log(accounts)
    if (accounts.ok) {
      const data = await accounts.json()
      console.log(data)
      
      // Group positions by account
      const positionsByAccount: Record<string, any[]> = {}
      
      if (data.positions && Array.isArray(data.positions)) {
        data.positions.forEach((position: any) => {
          const accountId = position.account
          if (!positionsByAccount[accountId]) {
            positionsByAccount[accountId] = []
          }
          positionsByAccount[accountId].push(position)
        })
      }
      
      console.log('Positions grouped by account:', positionsByAccount)
      
      // Convert to array format if needed
      const combinedPositions = Object.entries(positionsByAccount).map(([account, positions]) => ({
        account,
        positions,
        totalMarketValue: positions.reduce((sum, pos) => sum + (pos.marketValue || 0), 0),
        positionCount: positions.length
      }))

      setCombinedPositions(combinedPositions)
      
      console.log('Combined positions:', combinedPositions)
      
      setAccounts(combinedPositions)
      setOpenPositions(data.positions || [])
    }
  }

  const buyAllPositions = async () => {
    // Collect all accounts with their quantities
    const accountEntries: string[] = []
    let symbol = ""
    
    combinedPositions.forEach((position, index) => {
      const symbolInput = document.getElementById(`symbol-${index}`) as HTMLInputElement
      const quantityInput = document.getElementById(`quantity-${index}`) as HTMLInputElement
      
      if (quantityInput?.value) {
        accountEntries.push(`{${position.account} , ${quantityInput.value}}`)
        if (symbolInput?.value) {
          symbol = symbolInput.value
        }
      }
    })
    
    const accountString = accountEntries.join(" , ")
    
    const payload = {
      "symbol": symbol,
      "orderType": "buy",
      "account": accountString,
      "type": "quantity"
    }
    console.log(JSON.stringify(payload))

    // const res = await fetch(`${BACKEND_URL}/futureall`, {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify(payload),
    // })

    // if (res.ok) {
    //   const data = await res.json()
    //   console.log(data)
    //   toast.success("Buy all positions successful")
    // } else {
    //   toast.error("Buy all positions failed")
    // }
  }


  const closeAllPositions = async () => {
    console.log("Close All")

    // const res = await fetch(`${BACKEND_URL}/closeall`, {
    //   method: "GET",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    // })

    // if (res.ok) {
    //   const data = await res.json()
    //   console.log(data)
    //   toast.success("Sell all positions successful")
    // } else {
    //   toast.error("Sell all positions failed")
    // }
  }

  const buySinglePosition = async (account: string, index: number) => {
    console.log("Buy", account)
    const symbol = document.getElementById(`symbol-${index}`) as HTMLInputElement
    const quantity = document.getElementById(`quantity-${index}`) as HTMLInputElement
    const payload = {
      "symbol": symbol.value,
      "orderType": "buy",
      "account": `{${account} , ${quantity.value}}`,
      "type" : "quantity"
    }
    console.log(JSON.stringify(payload))

    // const res = await fetch(`${BACKEND_URL}/futureall`, {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify(payload),
    // })

    // if (res.ok) {
    //   const data = await res.json()
    //   console.log(data)
    //   toast.success("Buy single position successful")
    // } else {
    //   toast.error("Buy single position failed")
    // }
  }

  const sellAllPositions = async () => {
    console.log("Sell All")
  }

  const sellSinglePosition = (account: string) => {
    console.log("Sell", account)
  }

  useEffect(() => {
    getAccounts()
  }, [])

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
          <Button className="bg-sky-500 text-primary-foreground hover:bg-sky-500/90" onClick={getAccounts}>
            <ArrowUpRight className="mr-2 h-4 w-4" />
            Accounts
          </Button>
          <Button className="bg-success text-success-foreground hover:bg-success/90" onClick={buyAllPositions}>
            <ArrowUpRight className="mr-2 h-4 w-4" />
            Buy All
          </Button>
          <Button variant="destructive" onClick={sellAllPositions}>
            <ArrowDownRight className="mr-2 h-4 w-4" />
            Sell All
          </Button>
          <Button
            variant="outline"
            className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground bg-transparent"
            onClick={closeAllPositions}
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
            {combinedPositions.map((position, index) => (
              <div
                key={index}
                className="rounded-lg border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="space-y-4">
                  {/* Account Header */}
                  <div className="flex items-center justify-between pb-3 border-b border-border">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                        <span className="text-sm font-bold text-primary">{position.account.slice(0, 2).toUpperCase()}</span>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Account ID</Label>
                        <p className="font-mono text-sm font-semibold text-foreground">{position.account}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Label className="text-xs text-muted-foreground">Positions</Label>
                      <p className="text-sm font-semibold text-foreground">{position.positionCount}</p>
                    </div>
                  </div>

                  {/* Positions Grid */}
                  <div className="space-y-3">
                    <Label className="text-xs text-muted-foreground">Current Holdings</Label>
                    <div className="flex flex-wrap gap-2">
                      {position.positions.map((pos: any, idx: number) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2 rounded-md border border-border bg-secondary/30 px-3 py-1.5 transition-colors hover:bg-secondary/50"
                        >
                          <span className="text-xs font-bold text-primary">{pos.symbol}</span>
                          <span className="text-xs text-muted-foreground">|</span>
                          <span className="text-xs font-medium text-foreground">{pos.position}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Trade Action */}
                  <div className="space-y-2 pt-2">
                    <Label htmlFor={`quantity-${index}`} className="text-sm font-medium">
                      Order Quantity
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id={`quantity-${index}`}
                        type="number"
                        placeholder="Enter quantity"
                        className="flex-1"
                      />
                      <Input
                        id={`symbol-${index}`}
                        type="text"
                        placeholder="Enter symbol"
                        className="flex-1"
                      />
                      <Button size="sm" className="bg-success hover:bg-success/90" onClick={() => buySinglePosition(position.account, index)}>
                        Buy
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => sellSinglePosition(position.account)}>
                        Sell
                      </Button>
                    </div>
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
