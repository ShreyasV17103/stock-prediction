"use client"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Chart,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartArea,
  ChartLine,
  ChartXAxis,
  ChartYAxis,
  ChartLegend,
} from "@/components/ui/chart"
import { format, addDays, addWeeks, addMonths } from "date-fns"

interface PredictionChartProps {
  historicalData: Array<{ date: string; price: number }>
  predictionData: Array<{
    day: number
    prediction: number
    lower_bound: number
    upper_bound: number
  }>
  loading: boolean
  timeframe: string
}

export default function PredictionChart({ historicalData, predictionData, loading, timeframe }: PredictionChartProps) {
  if (loading) {
    return <Skeleton className="w-full h-[400px]" />
  }

  // If no data, show placeholder
  if (!historicalData || historicalData.length === 0 || !predictionData || predictionData.length === 0) {
    return (
      <div className="flex items-center justify-center h-[400px] border rounded-md bg-muted/20">
        <p className="text-muted-foreground">No prediction data available</p>
      </div>
    )
  }

  // Get the last date from historical data as the starting point for predictions
  const lastHistoricalDate = new Date(historicalData[historicalData.length - 1].date)

  // Format historical data for chart
  const formattedHistoricalData = historicalData.map((item) => ({
    date: new Date(item.date),
    actual: item.price,
    prediction: null,
    lower_bound: null,
    upper_bound: null,
  }))

  // Format prediction data for chart based on timeframe
  const formattedPredictionData = predictionData.map((item) => {
    let predictionDate

    switch (timeframe) {
      case "1d": // Intraday (hours)
        predictionDate = new Date(lastHistoricalDate)
        predictionDate.setHours(predictionDate.getHours() + item.day)
        break
      case "1w": // 1 Week (days)
        predictionDate = addDays(lastHistoricalDate, item.day)
        break
      case "15d": // 15 Days (days)
        predictionDate = addDays(lastHistoricalDate, item.day)
        break
      case "3m": // 3 Months (weeks)
        predictionDate = addWeeks(lastHistoricalDate, Math.floor(item.day / 7))
        break
      case "6m": // 6 Months (weeks)
        predictionDate = addWeeks(lastHistoricalDate, Math.floor(item.day / 7))
        break
      case "1y": // 1 Year (months)
        predictionDate = addMonths(lastHistoricalDate, Math.floor(item.day / 30))
        break
      case "3y": // 3 Years (months)
        predictionDate = addMonths(lastHistoricalDate, Math.floor(item.day / 30))
        break
      default:
        predictionDate = addDays(lastHistoricalDate, item.day)
    }

    return {
      date: predictionDate,
      actual: null,
      prediction: item.prediction,
      lower_bound: item.lower_bound,
      upper_bound: item.upper_bound,
    }
  })

  // Combine both datasets
  const combinedData = [...formattedHistoricalData, ...formattedPredictionData]

  // Format date based on timeframe
  const formatDate = (date: Date) => {
    switch (timeframe) {
      case "1d": // Intraday
        return format(date, "HH:mm")
      case "1w": // 1 Week
      case "15d": // 15 Days
        return format(date, "MMM dd")
      case "3m": // 3 Months
      case "6m": // 6 Months
        return format(date, "MMM dd")
      case "1y": // 1 Year
      case "3y": // 3 Years
        return format(date, "MMM yyyy")
      default:
        return format(date, "MMM dd")
    }
  }

  return (
    <ChartContainer className="h-[400px]">
      <Chart>
        <ChartTooltip>
          <ChartTooltipContent formatValues={(v) => (v ? `$${v.toFixed(2)}` : "N/A")} />
        </ChartTooltip>
        <ChartLegend />
        <ChartArea>
          <ChartLine
            name="Historical"
            data={combinedData}
            dataKey="actual"
            xKey="date"
            strokeWidth={2}
            stroke="#3b82f6"
          />
          <ChartLine
            name="Prediction"
            data={combinedData}
            dataKey="prediction"
            xKey="date"
            strokeWidth={2}
            stroke="#10b981"
            strokeDasharray="5 5"
          />
          <ChartLine
            name="Upper Bound"
            data={combinedData}
            dataKey="upper_bound"
            xKey="date"
            strokeWidth={1}
            stroke="#10b981"
            opacity={0.5}
          />
          <ChartLine
            name="Lower Bound"
            data={combinedData}
            dataKey="lower_bound"
            xKey="date"
            strokeWidth={1}
            stroke="#10b981"
            opacity={0.5}
          />
        </ChartArea>
        <ChartXAxis dataKey="date" tickFormatter={(value) => formatDate(new Date(value))} />
        <ChartYAxis tickFormatter={(value) => `$${value}`} />
      </Chart>
    </ChartContainer>
  )
}

