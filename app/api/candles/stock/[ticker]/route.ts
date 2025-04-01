import { type NextRequest, NextResponse } from "next/server"
import { fetchStockCandles } from "@/lib/api"

export async function GET(request: NextRequest, { params }: { params: { ticker: string } }) {
  try {
    const ticker = params.ticker.toUpperCase()
    const searchParams = request.nextUrl.searchParams
    const timeframe = searchParams.get("timeframe") || "1d"

    // In a real application, this would call a financial API
    // For now, we'll use our mock data
    const data = await fetchStockCandles(ticker, timeframe)

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching stock candle data:", error)
    return NextResponse.json({ error: "Failed to fetch stock candle data" }, { status: 500 })
  }
}

