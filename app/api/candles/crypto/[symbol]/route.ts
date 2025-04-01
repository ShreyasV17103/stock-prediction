import { type NextRequest, NextResponse } from "next/server"
import { fetchCryptoCandles } from "@/lib/api"

export async function GET(request: NextRequest, { params }: { params: { symbol: string } }) {
  try {
    const symbol = params.symbol.toUpperCase()
    const searchParams = request.nextUrl.searchParams
    const timeframe = searchParams.get("timeframe") || "1d"

    // In a real application, this would call a cryptocurrency API
    // For now, we'll use our mock data
    const data = await fetchCryptoCandles(symbol, timeframe)

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching crypto candle data:", error)
    return NextResponse.json({ error: "Failed to fetch cryptocurrency candle data" }, { status: 500 })
  }
}

