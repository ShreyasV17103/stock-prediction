import { type NextRequest, NextResponse } from "next/server"
import { generateMockGlobalMarkets } from "@/lib/api"

export async function GET(request: NextRequest) {
  try {
    // In a real application, this would fetch data from financial APIs
    // For now, we'll use our mock data
    const data = generateMockGlobalMarkets()

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching global market data:", error)
    return NextResponse.json({ error: "Failed to fetch global market data" }, { status: 500 })
  }
}

