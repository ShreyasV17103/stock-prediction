"use client"

import { useState } from "react"
import { Suspense } from "react"
import AssetSelector from "@/components/asset-selector"
import AssetDashboard from "@/components/asset-dashboard"
import GlobalMarkets from "@/components/global-markets"
import LoadingDashboard from "@/components/loading-dashboard"

export default function Home() {
  const [assetType, setAssetType] = useState<"stock" | "crypto">("stock")
  const [symbol, setSymbol] = useState("AAPL")
  const [timeframe, setTimeframe] = useState("1d")

  const handleAssetSelect = (type: "stock" | "crypto", newSymbol: string) => {
    setAssetType(type)
    setSymbol(newSymbol)
  }

  const handleTimeframeChange = (newTimeframe: string) => {
    setTimeframe(newTimeframe)
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100">Financial Market Prediction</h1>

        <div className="mb-6">
          <AssetSelector onAssetSelect={handleAssetSelect} onTimeframeChange={handleTimeframeChange} />
        </div>

        <div className="mb-8">
          <GlobalMarkets />
        </div>

        <Suspense fallback={<LoadingDashboard />}>
          <AssetDashboard assetType={assetType} symbol={symbol} timeframe={timeframe} />
        </Suspense>
      </div>
    </main>
  )
}

