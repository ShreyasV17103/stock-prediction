"use client"

import type React from "react"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { SearchIcon } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface AssetSelectorProps {
  onAssetSelect: (type: "stock" | "crypto", symbol: string) => void
  onTimeframeChange: (timeframe: string) => void
}

export default function AssetSelector({ onAssetSelect, onTimeframeChange }: AssetSelectorProps) {
  const [stockSymbol, setStockSymbol] = useState("")
  const [cryptoSymbol, setCryptoSymbol] = useState("")
  const [assetType, setAssetType] = useState<"stock" | "crypto">("stock")

  const handleSearch = () => {
    if (assetType === "stock" && stockSymbol) {
      onAssetSelect("stock", stockSymbol.toUpperCase())
    } else if (assetType === "crypto" && cryptoSymbol) {
      onAssetSelect("crypto", cryptoSymbol.toUpperCase())
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  const popularStocks = [
    { symbol: "AAPL", name: "Apple" },
    { symbol: "MSFT", name: "Microsoft" },
    { symbol: "GOOGL", name: "Alphabet" },
    { symbol: "AMZN", name: "Amazon" },
    { symbol: "TSLA", name: "Tesla" },
    { symbol: "NVDA", name: "NVIDIA" },
  ]

  const popularCryptos = [
    { symbol: "BTC", name: "Bitcoin" },
    { symbol: "ETH", name: "Ethereum" },
    { symbol: "BNB", name: "Binance Coin" },
    { symbol: "SOL", name: "Solana" },
    { symbol: "XRP", name: "Ripple" },
    { symbol: "ADA", name: "Cardano" },
  ]

  return (
    <div className="space-y-4">
      <Tabs defaultValue="stock" onValueChange={(value) => setAssetType(value as "stock" | "crypto")}>
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="stock">Stocks</TabsTrigger>
            <TabsTrigger value="crypto">Cryptocurrencies</TabsTrigger>
          </TabsList>

          <Select defaultValue="1d" onValueChange={onTimeframeChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Prediction Timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1d">Intraday</SelectItem>
              <SelectItem value="1w">1 Week</SelectItem>
              <SelectItem value="15d">15 Days</SelectItem>
              <SelectItem value="3m">3 Months</SelectItem>
              <SelectItem value="6m">6 Months</SelectItem>
              <SelectItem value="1y">1 Year</SelectItem>
              <SelectItem value="3y">3 Years</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <TabsContent value="stock" className="space-y-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Input
                type="text"
                placeholder="Search stock ticker (e.g., AAPL, MSFT)"
                className="pl-10"
                value={stockSymbol}
                onChange={(e) => setStockSymbol(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
            <Button onClick={handleSearch}>Search</Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
            {popularStocks.map((stock) => (
              <Button
                key={stock.symbol}
                variant="outline"
                className="h-auto py-2"
                onClick={() => onAssetSelect("stock", stock.symbol)}
              >
                <div className="text-left">
                  <div className="font-bold">{stock.symbol}</div>
                  <div className="text-xs text-muted-foreground">{stock.name}</div>
                </div>
              </Button>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="crypto" className="space-y-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Input
                type="text"
                placeholder="Search crypto (e.g., BTC, ETH)"
                className="pl-10"
                value={cryptoSymbol}
                onChange={(e) => setCryptoSymbol(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
            <Button onClick={handleSearch}>Search</Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
            {popularCryptos.map((crypto) => (
              <Button
                key={crypto.symbol}
                variant="outline"
                className="h-auto py-2"
                onClick={() => onAssetSelect("crypto", crypto.symbol)}
              >
                <div className="text-left">
                  <div className="font-bold">{crypto.symbol}</div>
                  <div className="text-xs text-muted-foreground">{crypto.name}</div>
                </div>
              </Button>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

