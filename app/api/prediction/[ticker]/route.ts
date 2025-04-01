import { type NextRequest, NextResponse } from "next/server"

// This would be a real API endpoint that calls the Python prediction model
// For this demo, we'll use the mock data from our lib/api.ts

import { fetchPrediction } from "@/lib/api"

export async function GET(request: NextRequest, { params }: { params: { ticker: string } }) {
  try {
    const ticker = params.ticker.toUpperCase()

    // In a real application, this would call the Python prediction model
    // For now, we'll use our mock data
    const data = await fetchPrediction(ticker)

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching prediction data:", error)
    return NextResponse.json({ error: "Failed to fetch prediction data" }, { status: 500 })
  }
}

