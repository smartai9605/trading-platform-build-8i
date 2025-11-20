"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowUpRight, ArrowDownRight, X, AlertTriangle } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;


export default function PortfolioPage() {

  const [accounts, setAccounts] = useState<any[]>([])
  const [openPositions, setOpenPositions] = useState<any[]>([])
  const [combinedPositions, setCombinedPositions] = useState<any[]>([])
  const [confirmationModal, setConfirmationModal] = useState<{
    isOpen: boolean
    title: string
    message: string
    onConfirm: () => void
    confirmText?: string
    cancelText?: string
  }>({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
    confirmText: "OK",
    cancelText: "Cancel"
  })

  const showConfirmationModal = (title: string, message: string, onConfirm: () => void, confirmText = "OK", cancelText = "Cancel") => {
    setConfirmationModal({
      isOpen: true,
      title,
      message,
      onConfirm,
      confirmText,
      cancelText
    })
  }

  const hideConfirmationModal = () => {
    setConfirmationModal(prev => ({ ...prev, isOpen: false }))
  }

  const handleConfirm = () => {
    confirmationModal.onConfirm()
    hideConfirmationModal()
  }

  const getAccounts = async () => {
    const accounts = await fetch(`${BACKEND_URL}/portfolio`, {
    })
    console.log("accounts : ", accounts)
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
      
      // Create detailed account information array
      const detailedAccounts: any[] = []
      
      // Process each account from account_summary
      if (data.account_summary) {
        Object.entries(data.account_summary).forEach(([accountId, accountData]: [string, any]) => {
          const accountPositions = positionsByAccount[accountId] || []
          
          const detailedAccount = {
            account: accountId,
            NetLiquidation: accountData.NetLiquidation,
            TotalCashValue: accountData.TotalCashValue,
            positions: accountPositions,
            totalMarketValue: accountPositions.reduce((sum, pos) => sum + (pos.marketValue || 0), 0),
            positionCount: accountPositions.length
          }
          
          detailedAccounts.push(detailedAccount)
        })
      }
      
      console.log('Detailed accounts:', detailedAccounts)
      
      setCombinedPositions(detailedAccounts)
      setAccounts(detailedAccounts)
      setOpenPositions(data.positions || [])
    }
  }

  const buyAllPositions = async () => {
    // Collect all accounts with their quantities
    const accountEntries: any[] = []
    let symbol = ""
    
    combinedPositions.forEach((position, index) => {
      const symbolInput = document.getElementById(`symbol-${index}`) as HTMLInputElement
      const quantityInput = document.getElementById(`quantity-${index}`) as HTMLInputElement
      
      if (quantityInput?.value) {
        accountEntries.push({
          "account": position.account,
          "quantity": quantityInput.value,
          "symbol": symbolInput.value
        })
        if (symbolInput?.value) {
          symbol = symbolInput.value
        }
      }
    })
    
    console.log("Account entries:", JSON.stringify(accountEntries, null, 2))
    
    for (const account of accountEntries) {
      const payload = {
        "symbol": account.symbol,
        "orderType": "buy",
        "account": account.account,
        "tradeValue": account.quantity,
        "type": "quantity",
        "price" : "100"
      }
      console.log("buy single position payload : ", JSON.stringify(payload))
      
      const res = await fetch(`${BACKEND_URL}/futuresignal`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })
      if (res.ok) {
        const data = await res.json()
        console.log(data)
        getAccounts()
        toast.success("Buy single position successful")
      } else {
        toast.error("Buy single position failed")
      }
    }
  }

  const handleBuyAllPositions = () => {
    showConfirmationModal(
      "Confirm Buy All Positions",
      "Are you sure you want to buy positions for all accounts? This action cannot be undone.",
      buyAllPositions,
      "Buy All",
      "Cancel"
    )
  }


  const sellAllPositions = async () => {
    // Collect all accounts with their quantities
    const accountEntries: any[] = []
    let symbol = ""
    
    combinedPositions.forEach((position, index) => {
      const symbolInput = document.getElementById(`symbol-${index}`) as HTMLInputElement
      const quantityInput = document.getElementById(`quantity-${index}`) as HTMLInputElement
      
      if (quantityInput?.value) {
        accountEntries.push({
          "account": position.account,
          "quantity": quantityInput.value,
          "symbol": symbolInput.value
        })
        if (symbolInput?.value) {
          symbol = symbolInput.value
        }
      }
    })
    
    for (const account of accountEntries) {
      const payload = {
        "symbol": account.symbol,
        "orderType": "sell",
        "account": account.account,
        "tradeValue": account.quantity,
        "type": "quantity",
        "price" : "100"
      }
      console.log("close single position payload : ", JSON.stringify(payload))
      
      const res = await fetch(`${BACKEND_URL}/futuresignal`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })
      if (res.ok) {
        const data = await res.json()
        getAccounts()
        toast.success("Close single position successful")
      } else {
        toast.error("Close single position failed")
      }
    }
  }

  const handleCloseAllPositions = () => {
    showConfirmationModal(
      "Confirm Close All Positions",
      "Are you sure you want to close all positions? This action cannot be undone.",
      closeAllPositions,
      "Close All",
      "Cancel"
    )
  }

  const buySinglePosition = async (account: string, index: number) => {
    console.log("Buy", account)
    const symbol = document.getElementById(`symbol-${index}`) as HTMLInputElement
    const quantity = document.getElementById(`quantity-${index}`) as HTMLInputElement
    const payload = {
      "symbol": symbol.value,
      "type": "buy",
      "quantity": parseInt(quantity.value),
      "account": account,
    }
    console.log(JSON.stringify(payload))

    const res = await fetch(`${BACKEND_URL}/futuresignal`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })

    if (res.ok) {
      const data = await res.json()
      console.log(data)
      getAccounts()
      toast.success("Buy single position successful")
    } else {
      toast.error("Buy single position failed")
    }
  }

  const handleBuySinglePosition = (account: string, index: number) => {
    const symbol = document.getElementById(`symbol-${index}`) as HTMLInputElement
    const quantity = document.getElementById(`quantity-${index}`) as HTMLInputElement
    
    showConfirmationModal(
      "Confirm Buy Position",
      `Are you sure you want to buy ${quantity?.value || '0'} shares of ${symbol?.value || 'symbol'} for account ${account}?`,
      () => buySinglePosition(account, index),
      "Buy",
      "Cancel"
    )
  }

  const closeAllPositions = async () => {
    const res = await fetch(`${BACKEND_URL}/closeall`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
    if (res.ok) {
      const data = await res.json()
      console.log(data)
      getAccounts()
      toast.success("Close all positions successful")
    } else {
      toast.error("Close all positions failed")
    }
  }

  const handleSellAllPositions = () => {
    showConfirmationModal(
      "Confirm Sell All Positions",
      "Are you sure you want to sell all positions? This action cannot be undone.",
      sellAllPositions,
      "Sell All",
      "Cancel"
    )
  }

  const sellSinglePosition = async (account: string, index: number) => {
    console.log("Sell", account)
    const symbol = document.getElementById(`symbol-${index}`) as HTMLInputElement
    const quantity = document.getElementById(`quantity-${index}`) as HTMLInputElement
    const payload = {
      "symbol": symbol.value,
      "type": "sell",
      "quantity": parseInt(quantity.value),
      "account": account,
    }
    console.log(JSON.stringify(payload))

    const res = await fetch(`${BACKEND_URL}/futuresignal`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })

    if (res.ok) {
      const data = await res.json()
      console.log(data)
      getAccounts()
      toast.success("Sell single position successful")
    } else {
      toast.error("Sell single position failed")
    }
  }

  const handleSellSinglePosition = (account: string, index: number) => {
    const symbol = document.getElementById(`symbol-${index}`) as HTMLInputElement
    const quantity = document.getElementById(`quantity-${index}`) as HTMLInputElement
    
    showConfirmationModal(
      "Confirm Sell Position",
      `Are you sure you want to sell ${quantity?.value || '0'} shares of ${symbol?.value || 'symbol'} for account ${account}?`,
      () => sellSinglePosition(account, index),
      "Sell",
      "Cancel"
    )
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
        <div className="flex flex-wrap gap-2 sm:gap-3">
          <Button className="bg-sky-500 text-primary-foreground hover:bg-sky-500/90 text-xs sm:text-sm" onClick={getAccounts}>
            <ArrowUpRight className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Accounts</span>
            <span className="sm:hidden">Acc</span>
          </Button>
          <Button className="bg-success text-success-foreground hover:bg-success/90 text-xs sm:text-sm" onClick={handleBuyAllPositions}>
            <ArrowUpRight className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Buy All</span>
            <span className="sm:hidden">Buy</span>
          </Button>
          <Button variant="destructive" className="text-xs sm:text-sm" onClick={handleSellAllPositions}>
            <ArrowDownRight className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Sell All</span>
            <span className="sm:hidden">Sell</span>
          </Button>
          <Button
            variant="outline"
            className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground bg-transparent text-xs sm:text-sm"
            onClick={handleCloseAllPositions}
          >
            <X className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Close All Positions</span>
            <span className="sm:hidden">Close</span>
          </Button>
        </div>
      </div>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
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
                    <div className="flex flex-col sm:flex-row gap-2">
                      <div className="flex gap-2 flex-1">
                        <Input
                          id={`quantity-${index}`}
                          type="number"
                          placeholder="Quantity"
                          className="flex-1"
                        />
                        <Input
                          id={`symbol-${index}`}
                          type="text"
                          placeholder="Symbol"
                          className="flex-1"
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" className="bg-success hover:bg-success/90 flex-1 sm:flex-none" onClick={() => handleBuySinglePosition(position.account, index)}>
                          Buy
                        </Button>
                        <Button size="sm" variant="destructive" className="flex-1 sm:flex-none" onClick={() => handleSellSinglePosition(position.account, index)}>
                          Sell
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Confirmation Modal */}
      {confirmationModal.isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-lg p-4 sm:p-6 max-w-md w-full shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
                <AlertTriangle className="h-5 w-5 text-destructive" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">{confirmationModal.title}</h3>
            </div>
            <p className="text-muted-foreground mb-6">{confirmationModal.message}</p>
            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={hideConfirmationModal}
                className="border-border text-foreground hover:bg-secondary"
              >
                {confirmationModal.cancelText}
              </Button>
              <Button
                variant="destructive"
                onClick={handleConfirm}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {confirmationModal.confirmText}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
