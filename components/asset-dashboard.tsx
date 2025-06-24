"use client"

import CandleChart from "@/components/candle-chart"
import CryptoMetrics from "@/components/crypto-metrics"
import PredictionChart from "@/components/prediction-chart"
import StockChart from "@/components/stock-chart"
import StockMetrics from "@/components/stock-metrics"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { fetchCryptoCandles, fetchCryptoData, fetchPrediction, fetchStockCandles, fetchStockData } from "@/lib/api"
import { AlertCircle, RefreshCw, TrendingDown, TrendingUp } from "lucide-react"
import { useEffect, useState } from "react"

interface AssetDashboardProps {
  assetType: "stock" | "crypto"
  symbol: string
  timeframe: string
}

export default function AssetDashboard({ assetType, symbol, timeframe }: AssetDashboardProps) {
  const [assetData, setAssetData] = useState<any>(null)
  const [candleData, setCandleData] = useState<any>(null)
  const [predictionData, setPredictionData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        setError(null)

        // Fetch asset data based on type
        let data
        if (assetType === "stock") {
          data = await fetchStockData(symbol)
        } else {
          data = await fetchCryptoData(symbol)
        }
        setAssetData(data)

        // Fetch candle data based on type
        let candles
        if (assetType === "stock") {
          candles = await fetchStockCandles(symbol, timeframe)
        } else {
          candles = await fetchCryptoCandles(symbol, timeframe)
        }
        setCandleData(candles)

        // Fetch prediction data
        try {
          const prediction = await fetchPrediction(assetType, symbol, timeframe)
          setPredictionData(prediction)
        } catch (predictionErr: any) {
          setPredictionData(null)
          setError(
            `Prediction error: ${predictionErr?.message || "Failed to fetch predictions. Please try again later."}`
          )
        }
      } catch (err) {
        setError(`Failed to load ${assetType} data. Please try again later.`)
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [assetType, symbol, timeframe])

  const refreshData = () => {
    setLoading(true)
    if (assetType === "stock") {
      fetchStockData(symbol)
        .then((data) => setAssetData(data))
        .catch((err) => {
          setError("Failed to refresh data")
          console.error(err)
        })
        .finally(() => setLoading(false))
    } else {
      fetchCryptoData(symbol)
        .then((data) => setAssetData(data))
        .catch((err) => {
          setError("Failed to refresh data")
          console.error(err)
        })
        .finally(() => setLoading(false))
    }
  }

  const priceChange = assetData?.priceChange || 0
  const priceChangePercent = assetData?.priceChangePercent || 0
  const isPositive = priceChange >= 0

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
          <Button variant="outline" size="sm" onClick={() => window.location.reload()} className="mt-2">
            Retry
          </Button>
        </Alert>
      )}

      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">{symbol}</h2>
          <p className="text-gray-500 dark:text-gray-400">
            {assetType === "stock" ? assetData?.companyName : assetData?.name || "Loading..."}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className={`text-xl font-bold ${isPositive ? "text-green-600" : "text-red-600"}`}>
            ${assetData?.currentPrice?.toFixed(assetType === "crypto" ? 4 : 2) || "0.00"}
          </div>
          <div className={`flex items-center ${isPositive ? "text-green-600" : "text-red-600"}`}>
            {isPositive ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
            {priceChange.toFixed(assetType === "crypto" ? 4 : 2)} ({priceChangePercent.toFixed(2)}%)
          </div>
          <Button variant="outline" size="icon" onClick={refreshData} disabled={loading}>
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </div>

      <Tabs defaultValue="candles">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="candles">Candles</TabsTrigger>
          <TabsTrigger value="line">Line Chart</TabsTrigger>
          <TabsTrigger value="predictions">Predictions</TabsTrigger>
          <TabsTrigger value="metrics">Metrics</TabsTrigger>
        </TabsList>

        <TabsContent value="candles" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Candlestick Chart</CardTitle>
              <CardDescription>
                {timeframe} candlestick chart for {symbol}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CandleChart data={candleData?.candles || []} loading={loading} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="line" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Historical Price Data</CardTitle>
              <CardDescription>
                {timeframe} price history for {symbol}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <StockChart
                data={assetType === "stock" ? assetData?.historicalData || [] : assetData?.priceHistory || []}
                loading={loading}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="predictions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Price Predictions</CardTitle>
              <CardDescription>{timeframe} price forecast using machine learning models</CardDescription>
            </CardHeader>
            <CardContent>
              <PredictionChart
                historicalData={assetType === "stock" ? assetData?.historicalData || [] : assetData?.priceHistory || []}
                predictionData={predictionData?.predictions || []}
                loading={loading}
                timeframe={timeframe}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="metrics" className="space-y-4">
          {assetType === "stock" ? (
            <StockMetrics
              metrics={assetData?.metrics || {}}
              predictions={predictionData?.metrics || {}}
              loading={loading}
            />
          ) : (
            <CryptoMetrics
              metrics={assetData?.metrics || {}}
              predictions={predictionData?.metrics || {}}
              loading={loading}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

