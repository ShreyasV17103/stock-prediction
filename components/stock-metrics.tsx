"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

interface MetricsProps {
  metrics: {
    pe_ratio?: number
    market_cap?: number
    dividend_yield?: number
    volume?: number
    avg_volume?: number
    high_52w?: number
    low_52w?: number
  }
  predictions: {
    target_price?: number
    confidence?: number
    risk_level?: string
    recommendation?: string
  }
  loading: boolean
}

export default function StockMetrics({ metrics, predictions, loading }: MetricsProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Skeleton className="w-full h-[200px]" />
        <Skeleton className="w-full h-[200px]" />
      </div>
    )
  }

  const formatMarketCap = (value?: number) => {
    if (!value) return "N/A"
    if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`
    if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`
    return `$${value.toLocaleString()}`
  }

  const formatVolume = (value?: number) => {
    if (!value) return "N/A"
    if (value >= 1e9) return `${(value / 1e9).toFixed(2)}B`
    if (value >= 1e6) return `${(value / 1e6).toFixed(2)}M`
    if (value >= 1e3) return `${(value / 1e3).toFixed(2)}K`
    return value.toLocaleString()
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Key Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-2 gap-4">
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">P/E Ratio</dt>
              <dd className="text-lg font-semibold">{metrics.pe_ratio?.toFixed(2) || "N/A"}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Market Cap</dt>
              <dd className="text-lg font-semibold">{formatMarketCap(metrics.market_cap)}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Dividend Yield</dt>
              <dd className="text-lg font-semibold">
                {metrics.dividend_yield ? `${(metrics.dividend_yield * 100).toFixed(2)}%` : "N/A"}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Volume</dt>
              <dd className="text-lg font-semibold">{formatVolume(metrics.volume)}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Avg. Volume</dt>
              <dd className="text-lg font-semibold">{formatVolume(metrics.avg_volume)}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">52W Range</dt>
              <dd className="text-lg font-semibold">
                {metrics.low_52w && metrics.high_52w
                  ? `$${metrics.low_52w.toFixed(2)} - $${metrics.high_52w.toFixed(2)}`
                  : "N/A"}
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Prediction Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-2 gap-4">
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Target Price</dt>
              <dd className="text-lg font-semibold">
                {predictions.target_price ? `$${predictions.target_price.toFixed(2)}` : "N/A"}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Confidence</dt>
              <dd className="text-lg font-semibold">
                {predictions.confidence ? `${(predictions.confidence * 100).toFixed(1)}%` : "N/A"}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Risk Level</dt>
              <dd className="text-lg font-semibold">{predictions.risk_level || "N/A"}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Recommendation</dt>
              <dd className="text-lg font-semibold">{predictions.recommendation || "N/A"}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>
    </div>
  )
}

