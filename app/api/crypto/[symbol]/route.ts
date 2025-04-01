import { type NextRequest, NextResponse } from "next/server"
import { fetchCryptoData } from "@/lib/api"

export async function GET(request: NextRequest, { params }: { params: { symbol: string } }) {
  try {
    const symbol = params.symbol.toUpperCase()

    // In a real application, this would call a cryptocurrency API
    // For now, we'll use our mock data
    const data = await fetchCryptoData(symbol)

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching crypto data:", error)
    return NextResponse.json({ error: "Failed to fetch cryptocurrency data" }, { status: 500 })
  }
}

