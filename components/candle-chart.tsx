"use client"

import { useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import {
  Chart,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartArea,
  ChartXAxis,
  ChartYAxis,
} from "@/components/ui/chart"
import { format } from "date-fns"

interface CandleData {
  date: string
  open: number
  high: number
  low: number
  close: number
  volume: number
}

interface CandleChartProps {
  data: CandleData[]
  loading: boolean
  showVolume?: boolean
  showIndicators?: boolean
}

export default function CandleChart({ data, loading, showVolume = true, showIndicators = true }: CandleChartProps) {
  const [indicators, setIndicators] = useState({
    sma: true,
    ema: false,
    bollinger: false,
    rsi: false,
  })

  if (loading) {
    return <Skeleton className="w-full h-[500px]" />
  }

  // If no data, show placeholder
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[500px] border rounded-md bg-muted/20">
        <p className="text-muted-foreground">No data available</p>
      </div>
    )
  }

  // Format data for chart
  const chartData = data.map((item) => ({
    date: new Date(item.date),
    open: item.open,
    high: item.high,
    low: item.low,
    close: item.close,
    volume: item.volume,
  }))

  // Calculate SMA (Simple Moving Average)
  const calculateSMA = (period: number) => {
    const smaData = []
    for (let i = 0; i < chartData.length; i++) {
      if (i < period - 1) {
        smaData.push({ date: chartData[i].date, value: null })
        continue
      }

      let sum = 0
      for (let j = 0; j < period; j++) {
        sum += chartData[i - j].close
      }
      smaData.push({ date: chartData[i].date, value: sum / period })
    }
    return smaData
  }

  // Calculate EMA (Exponential Moving Average)
  const calculateEMA = (period: number) => {
    const emaData = []
    const multiplier = 2 / (period + 1)

    // First EMA is SMA
    let sum = 0
    for (let i = 0; i < period; i++) {
      sum += chartData[i].close
    }
    let prevEMA = sum / period

    for (let i = 0; i < chartData.length; i++) {
      if (i < period - 1) {
        emaData.push({ date: chartData[i].date, value: null })
        continue
      }

      if (i === period - 1) {
        emaData.push({ date: chartData[i].date, value: prevEMA })
        continue
      }

      const currentEMA = (chartData[i].close - prevEMA) * multiplier + prevEMA
      emaData.push({ date: chartData[i].date, value: currentEMA })
      prevEMA = currentEMA
    }

    return emaData
  }

  // Calculate Bollinger Bands
  const calculateBollingerBands = (period: number, stdDev: number) => {
    const smaData = calculateSMA(period)
    const bollingerData = []

    for (let i = 0; i < chartData.length; i++) {
      if (i < period - 1) {
        bollingerData.push({
          date: chartData[i].date,
          middle: null,
          upper: null,
          lower: null,
        })
        continue
      }

      let sum = 0
      let sumSquared = 0

      for (let j = 0; j < period; j++) {
        sum += chartData[i - j].close
        sumSquared += chartData[i - j].close ** 2
      }

      const sma = sum / period
      const variance = sumSquared / period - (sum / period) ** 2
      const standardDeviation = Math.sqrt(variance)

      bollingerData.push({
        date: chartData[i].date,
        middle: sma,
        upper: sma + stdDev * standardDeviation,
        lower: sma - stdDev * standardDeviation,
      })
    }

    return bollingerData
  }

  // Calculate RSI (Relative Strength Index)
  const calculateRSI = (period: number) => {
    const rsiData = []
    let gains = 0
    let losses = 0

    // First, calculate the initial average gain and loss
    for (let i = 1; i < period + 1; i++) {
      const change = chartData[i].close - chartData[i - 1].close
      if (change >= 0) {
        gains += change
      } else {
        losses += Math.abs(change)
      }
    }

    let avgGain = gains / period
    let avgLoss = losses / period

    // Calculate RSI for each data point
    for (let i = 0; i < chartData.length; i++) {
      if (i < period) {
        rsiData.push({ date: chartData[i].date, value: null })
        continue
      }

      const change = chartData[i].close - chartData[i - 1].close
      let currentGain = 0
      let currentLoss = 0

      if (change >= 0) {
        currentGain = change
      } else {
        currentLoss = Math.abs(change)
      }

      // Update average gain and loss using smoothing
      avgGain = (avgGain * (period - 1) + currentGain) / period
      avgLoss = (avgLoss * (period - 1) + currentLoss) / period

      const rs = avgGain / (avgLoss === 0 ? 0.001 : avgLoss) // Avoid division by zero
      const rsi = 100 - 100 / (1 + rs)

      rsiData.push({ date: chartData[i].date, value: rsi })
    }

    return rsiData
  }

  // Calculate indicators
  const sma20 = calculateSMA(20)
  const ema9 = calculateEMA(9)
  const bollingerBands = calculateBollingerBands(20, 2)
  const rsi14 = calculateRSI(14)

  // Custom candle renderer
  const renderCandles = () => {
    const candleWidth = 8

    return chartData.map((candle, index) => {
      const x = index * (candleWidth + 2) + 40 // Add some padding
      const isUp = candle.close >= candle.open
      const color = isUp ? "#16a34a" : "#dc2626"
      const bodyTop = isUp ? candle.open : candle.close
      const bodyBottom = isUp ? candle.close : candle.open
      const bodyHeight = Math.max(1, Math.abs(candle.close - candle.open))

      return (
        <g key={index}>
          {/* Wick */}
          <line
            x1={x + candleWidth / 2}
            y1={candle.high}
            x2={x + candleWidth / 2}
            y2={candle.low}
            stroke={color}
            strokeWidth={1}
          />
          {/* Body */}
          <rect x={x} y={bodyTop} width={candleWidth} height={bodyHeight} fill={color} stroke={color} />
        </g>
      )
    })
  }

  return (
    <div className="space-y-4">
      {showIndicators && (
        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            variant={indicators.sma ? "default" : "outline"}
            onClick={() => setIndicators({ ...indicators, sma: !indicators.sma })}
          >
            SMA (20)
          </Button>
          <Button
            size="sm"
            variant={indicators.ema ? "default" : "outline"}
            onClick={() => setIndicators({ ...indicators, ema: !indicators.ema })}
          >
            EMA (9)
          </Button>
          <Button
            size="sm"
            variant={indicators.bollinger ? "default" : "outline"}
            onClick={() => setIndicators({ ...indicators, bollinger: !indicators.bollinger })}
          >
            Bollinger Bands
          </Button>
          <Button
            size="sm"
            variant={indicators.rsi ? "default" : "outline"}
            onClick={() => setIndicators({ ...indicators, rsi: !indicators.rsi })}
          >
            RSI (14)
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        <ChartContainer className="h-[400px]">
          <Chart>
            <ChartTooltip>
              <ChartTooltipContent formatValues={(v) => `$${v.toFixed(2)}`} />
            </ChartTooltip>
            <ChartArea>
              {/* Render candles */}
              <svg width="100%" height="100%">
                {renderCandles()}
              </svg>

              {/* Technical Indicators */}
              {indicators.sma && <line type="monotone" dataKey="value" data={sma20} stroke="#3b82f6" strokeWidth={2} />}

              {indicators.ema && <line type="monotone" dataKey="value" data={ema9} stroke="#8b5cf6" strokeWidth={2} />}

              {indicators.bollinger && (
                <>
                  <line type="monotone" dataKey="middle" data={bollingerBands} stroke="#6b7280" strokeWidth={1} />
                  <line
                    type="monotone"
                    dataKey="upper"
                    data={bollingerBands}
                    stroke="#6b7280"
                    strokeWidth={1}
                    strokeDasharray="3 3"
                  />
                  <line
                    type="monotone"
                    dataKey="lower"
                    data={bollingerBands}
                    stroke="#6b7280"
                    strokeWidth={1}
                    strokeDasharray="3 3"
                  />
                </>
              )}
            </ChartArea>
            <ChartXAxis dataKey="date" tickFormatter={(value) => format(new Date(value), "MMM dd")} />
            <ChartYAxis tickFormatter={(value) => `$${value}`} />
          </Chart>
        </ChartContainer>

        {showVolume && (
          <ChartContainer className="h-[100px]">
            <Chart>
              <ChartArea>
                {chartData.map((item, index) => (
                  <rect
                    key={index}
                    x={index * 10 + 40}
                    y={100 - (item.volume / Math.max(...chartData.map((d) => d.volume))) * 80}
                    width={8}
                    height={(item.volume / Math.max(...chartData.map((d) => d.volume))) * 80}
                    fill={item.close >= item.open ? "#16a34a" : "#dc2626"}
                    opacity={0.7}
                  />
                ))}
              </ChartArea>
              <ChartXAxis dataKey="date" tickFormatter={(value) => format(new Date(value), "MMM dd")} />
              <ChartYAxis tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`} />
            </Chart>
          </ChartContainer>
        )}

        {indicators.rsi && (
          <ChartContainer className="h-[100px]">
            <Chart>
              <ChartArea>
                <line type="monotone" dataKey="value" data={rsi14} stroke="#f59e0b" strokeWidth={2} />
                {/* Overbought/Oversold lines */}
                <line x1={0} y1={30} x2="100%" y2={30} stroke="#d1d5db" strokeDasharray="3 3" />
                <line x1={0} y1={70} x2="100%" y2={70} stroke="#d1d5db" strokeDasharray="3 3" />
              </ChartArea>
              <ChartXAxis dataKey="date" tickFormatter={(value) => format(new Date(value), "MMM dd")} />
              <ChartYAxis domain={[0, 100]} ticks={[0, 30, 70, 100]} />
            </Chart>
          </ChartContainer>
        )}
      </div>
    </div>
  )
}

