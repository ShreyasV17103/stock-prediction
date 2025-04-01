"use client"

import { useEffect, useRef } from "react"
import { Skeleton } from "@/components/ui/skeleton"

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

interface WorldMarketMapProps {
  markets: MarketData[]
  loading: boolean
}

// Market positions on the map (approximate)
const marketPositions: Record<string, { x: number; y: number }> = {
  SPX: { x: 200, y: 180 }, // S&P 500 (USA)
  DJI: { x: 220, y: 170 }, // Dow Jones (USA)
  IXIC: { x: 180, y: 170 }, // NASDAQ (USA)
  TSX: { x: 220, y: 150 }, // Toronto Stock Exchange (Canada)
  BOVESPA: { x: 280, y: 300 }, // Brazil
  FTSE: { x: 400, y: 150 }, // UK
  DAX: { x: 430, y: 160 }, // Germany
  CAC: { x: 420, y: 170 }, // France
  IBEX: { x: 400, y: 180 }, // Spain
  FTSEMIB: { x: 430, y: 180 }, // Italy
  NIKKEI: { x: 700, y: 180 }, // Japan
  HSI: { x: 650, y: 210 }, // Hong Kong
  SSE: { x: 670, y: 190 }, // Shanghai
  KOSPI: { x: 680, y: 180 }, // South Korea
  ASX: { x: 700, y: 320 }, // Australia
  SENSEX: { x: 580, y: 220 }, // India
}

export default function WorldMarketMap({ markets, loading }: WorldMarketMapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (loading || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw world map outline (simplified)
    ctx.fillStyle = "#e5e7eb"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw continents (very simplified)
    ctx.fillStyle = "#f3f4f6"

    // North America
    ctx.beginPath()
    ctx.moveTo(150, 120)
    ctx.lineTo(250, 120)
    ctx.lineTo(280, 200)
    ctx.lineTo(220, 250)
    ctx.lineTo(150, 200)
    ctx.closePath()
    ctx.fill()

    // South America
    ctx.beginPath()
    ctx.moveTo(250, 250)
    ctx.lineTo(300, 250)
    ctx.lineTo(320, 350)
    ctx.lineTo(250, 380)
    ctx.lineTo(220, 320)
    ctx.closePath()
    ctx.fill()

    // Europe
    ctx.beginPath()
    ctx.moveTo(380, 120)
    ctx.lineTo(450, 120)
    ctx.lineTo(480, 180)
    ctx.lineTo(420, 200)
    ctx.lineTo(380, 180)
    ctx.closePath()
    ctx.fill()

    // Africa
    ctx.beginPath()
    ctx.moveTo(420, 200)
    ctx.lineTo(480, 200)
    ctx.lineTo(500, 300)
    ctx.lineTo(450, 350)
    ctx.lineTo(400, 300)
    ctx.closePath()
    ctx.fill()

    // Asia
    ctx.beginPath()
    ctx.moveTo(480, 120)
    ctx.lineTo(700, 120)
    ctx.lineTo(700, 250)
    ctx.lineTo(550, 300)
    ctx.lineTo(480, 200)
    ctx.closePath()
    ctx.fill()

    // Australia
    ctx.beginPath()
    ctx.ellipse(680, 320, 50, 30, 0, 0, 2 * Math.PI)
    ctx.fill()

    // Draw market indicators
    markets.forEach((market) => {
      const position = marketPositions[market.index]
      if (!position) return

      const { x, y } = position
      const radius = 10

      // Draw circle
      ctx.beginPath()
      ctx.arc(x, y, radius, 0, 2 * Math.PI)
      ctx.fillStyle = market.change >= 0 ? "rgba(34, 197, 94, 0.8)" : "rgba(239, 68, 68, 0.8)"
      ctx.fill()

      // Draw market name
      ctx.fillStyle = "#000"
      ctx.font = "10px Arial"
      ctx.textAlign = "center"
      ctx.fillText(market.index, x, y - radius - 5)

      // Draw change percentage
      ctx.fillStyle = market.change >= 0 ? "#16a34a" : "#dc2626"
      ctx.fillText(`${market.changePercent >= 0 ? "+" : ""}${market.changePercent.toFixed(1)}%`, x, y + radius + 15)
    })
  }, [markets, loading])

  if (loading) {
    return <Skeleton className="w-full h-[400px]" />
  }

  return (
    <div className="relative w-full h-[400px] border rounded-md overflow-hidden">
      <canvas ref={canvasRef} width={800} height={400} className="w-full h-full" />
    </div>
  )
}

