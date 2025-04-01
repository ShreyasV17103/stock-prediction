import { type NextRequest, NextResponse } from "next/server"
import { fetchPrediction } from "@/lib/api"

export async function GET(request: NextRequest, { params }: { params: { type: string; symbol: string } }) {
  try {
    const type = params.type as "stock" | "crypto"
    const symbol = params.symbol.toUpperCase()
    const searchParams = request.nextUrl.searchParams
    const timeframe = searchParams.get("timeframe") || "1d"

    if (type !== "stock" && type !== "crypto") {
      return NextResponse.json({ error: 'Invalid asset type. Must be "stock" or "crypto".' }, { status: 400 })
    }

    // In a real application, this would call the Python prediction model
    // For now, we'll use our mock data
    const data = await fetchPrediction(type, symbol, timeframe)

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching prediction data:", error)
    return NextResponse.json({ error: "Failed to fetch prediction data" }, { status: 500 })
  }
}

