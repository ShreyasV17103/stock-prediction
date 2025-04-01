"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { AlertCircle, TrendingUp, TrendingDown, RefreshCw } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import StockChart from "@/components/stock-chart"
import PredictionChart from "@/components/prediction-chart"
import StockMetrics from "@/components/stock-metrics"
import { fetchStockData, fetchPrediction } from "@/lib/api"

interface StockDashboardProps {
  defaultTicker: string
}

export default function StockDashboard({ defaultTicker }: StockDashboardProps) {
  const [ticker, setTicker] = useState(defaultTicker)
  const [stockData, setStockData] = useState<any>(null)
  const [predictionData, setPredictionData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        setError(null)

        // Fetch historical stock data
        const data = await fetchStockData(ticker)
        setStockData(data)

        // Fetch prediction data
        const prediction = await fetchPrediction(ticker)
        setPredictionData(prediction)
      } catch (err) {
        setError("Failed to load stock data. Please try again later.")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [ticker])

  const refreshData = () => {
    setLoading(true)
    fetchStockData(ticker)
      .then((data) => setStockData(data))
      .catch((err) => {
        setError("Failed to refresh data")
        console.error(err)
      })
      .finally(() => setLoading(false))
  }

  const priceChange = stockData?.priceChange || 0
  const priceChangePercent = stockData?.priceChangePercent || 0
  const isPositive = priceChange >= 0

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">{ticker}</h2>
          <p className="text-gray-500 dark:text-gray-400">{stockData?.companyName || "Loading..."}</p>
        </div>
        <div className="flex items-center gap-2">
          <div className={`text-xl font-bold ${isPositive ? "text-green-600" : "text-red-600"}`}>
            ${stockData?.currentPrice?.toFixed(2) || "0.00"}
          </div>
          <div className={`flex items-center ${isPositive ? "text-green-600" : "text-red-600"}`}>
            {isPositive ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
            {priceChange.toFixed(2)} ({priceChangePercent.toFixed(2)}%)
          </div>
          <Button variant="outline" size="icon" onClick={refreshData} disabled={loading}>
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </div>

      <Tabs defaultValue="charts">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="charts">Charts</TabsTrigger>
          <TabsTrigger value="predictions">Predictions</TabsTrigger>
          <TabsTrigger value="metrics">Metrics</TabsTrigger>
        </TabsList>

        <TabsContent value="charts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Historical Price Data</CardTitle>
              <CardDescription>Last 6 months of {ticker} stock price</CardDescription>
            </CardHeader>
            <CardContent>
              <StockChart data={stockData?.historicalData || []} loading={loading} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="predictions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Price Predictions</CardTitle>
              <CardDescription>30-day price forecast using machine learning models</CardDescription>
            </CardHeader>
            <CardContent>
              <PredictionChart
                historicalData={stockData?.historicalData || []}
                predictionData={predictionData?.predictions || []}
                loading={loading}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="metrics" className="space-y-4">
          <StockMetrics
            metrics={stockData?.metrics || {}}
            predictions={predictionData?.metrics || {}}
            loading={loading}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}

