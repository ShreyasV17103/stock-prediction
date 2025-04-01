"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { TrendingUp, TrendingDown, Globe } from "lucide-react"
import { fetchGlobalMarkets } from "@/lib/api"
import { useEffect } from "react"
import WorldMarketMap from "@/components/world-market-map"

interface MarketData {
  index: string
  name: string
  value: number
  change: number
  changePercent: number
  region: "americas" | "europe" | "asia" | "other"
  country: string
  currency: string
}

export default function GlobalMarkets() {
  const [markets, setMarkets] = useState<MarketData[]>([])
  const [loading, setLoading] = useState(true)
  const [activeRegion, setActiveRegion] = useState("all")

  useEffect(() => {
    const loadMarkets = async () => {
      try {
        setLoading(true)
        const data = await fetchGlobalMarkets()
        setMarkets(data)
      } catch (error) {
        console.error("Failed to load global markets", error)
      } finally {
        setLoading(false)
      }
    }

    loadMarkets()
  }, [])

  const filteredMarkets = activeRegion === "all" ? markets : markets.filter((market) => market.region === activeRegion)

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center">
              <Globe className="mr-2 h-5 w-5" />
              Global Markets
            </CardTitle>
            <CardDescription>Major stock indices from around the world</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" onValueChange={setActiveRegion}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="americas">Americas</TabsTrigger>
            <TabsTrigger value="europe">Europe</TabsTrigger>
            <TabsTrigger value="asia">Asia</TabsTrigger>
          </TabsList>

          <div className="mt-4">
            <WorldMarketMap markets={filteredMarkets} loading={loading} />
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {loading
              ? Array(6)
                  .fill(0)
                  .map((_, i) => <Skeleton key={i} className="h-24 w-full" />)
              : filteredMarkets.map((market) => <MarketCard key={market.index} market={market} />)}
          </div>
        </Tabs>
      </CardContent>
    </Card>
  )
}

function MarketCard({ market }: { market: MarketData }) {
  const isPositive = market.change >= 0

  return (
    <Card className="overflow-hidden">
      <div className={`p-4 ${isPositive ? "bg-green-50 dark:bg-green-900/20" : "bg-red-50 dark:bg-red-900/20"}`}>
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-bold">{market.index}</h3>
            <p className="text-sm text-muted-foreground">{market.name}</p>
          </div>
          <div className="flex items-center">
            <div className="text-2xl font-bold mr-2">
              {market.value.toLocaleString(undefined, {
                minimumFractionDigits: 0,
                maximumFractionDigits: 2,
              })}
            </div>
            <div className={`flex items-center ${isPositive ? "text-green-600" : "text-red-600"}`}>
              {isPositive ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
              <span>
                {market.change.toFixed(2)} ({market.changePercent.toFixed(2)}%)
              </span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}

