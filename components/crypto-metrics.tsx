"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

interface CryptoMetricsProps {
  metrics: {
    market_cap?: number
    volume_24h?: number
    circulating_supply?: number
    max_supply?: number
    all_time_high?: number
    all_time_high_date?: string
    price_change_24h?: number
    price_change_7d?: number
    price_change_30d?: number
  }
  predictions: {
    target_price?: number
    confidence?: number
    risk_level?: string
    recommendation?: string
  }
  loading: boolean
}

export default function CryptoMetrics({ metrics, predictions, loading }: CryptoMetricsProps) {
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
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`
    if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`
    if (value >= 1e3) return `$${(value / 1e3).toFixed(2)}K`
    return `$${value.toLocaleString()}`
  }

  const formatSupply = (value?: number) => {
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
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Market Cap</dt>
              <dd className="text-lg font-semibold">{formatMarketCap(metrics.market_cap)}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">24h Volume</dt>
              <dd className="text-lg font-semibold">{formatVolume(metrics.volume_24h)}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Circulating Supply</dt>
              <dd className="text-lg font-semibold">{formatSupply(metrics.circulating_supply)}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Max Supply</dt>
              <dd className="text-lg font-semibold">
                {metrics.max_supply ? formatSupply(metrics.max_supply) : "Unlimited"}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">All Time High</dt>
              <dd className="text-lg font-semibold">
                {metrics.all_time_high ? `$${metrics.all_time_high.toFixed(2)}` : "N/A"}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">ATH Date</dt>
              <dd className="text-lg font-semibold">
                {metrics.all_time_high_date ? new Date(metrics.all_time_high_date).toLocaleDateString() : "N/A"}
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Price Changes & Prediction</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-2 gap-4">
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">24h Change</dt>
              <dd
                className={`text-lg font-semibold ${metrics.price_change_24h && metrics.price_change_24h >= 0 ? "text-green-600" : "text-red-600"}`}
              >
                {metrics.price_change_24h
                  ? `${metrics.price_change_24h >= 0 ? "+" : ""}${metrics.price_change_24h.toFixed(2)}%`
                  : "N/A"}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">7d Change</dt>
              <dd
                className={`text-lg font-semibold ${metrics.price_change_7d && metrics.price_change_7d >= 0 ? "text-green-600" : "text-red-600"}`}
              >
                {metrics.price_change_7d
                  ? `${metrics.price_change_7d >= 0 ? "+" : ""}${metrics.price_change_7d.toFixed(2)}%`
                  : "N/A"}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">30d Change</dt>
              <dd
                className={`text-lg font-semibold ${metrics.price_change_30d && metrics.price_change_30d >= 0 ? "text-green-600" : "text-red-600"}`}
              >
                {metrics.price_change_30d
                  ? `${metrics.price_change_30d >= 0 ? "+" : ""}${metrics.price_change_30d.toFixed(2)}%`
                  : "N/A"}
              </dd>
            </div>
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
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Recommendation</dt>
              <dd className="text-lg font-semibold">{predictions.recommendation || "N/A"}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>
    </div>
  )
}

