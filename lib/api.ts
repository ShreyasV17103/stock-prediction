// Mock API functions to simulate fetching stock data, crypto data, and predictions
// In a real application, these would connect to financial APIs

import { addDays, subDays, subHours, subMonths, subYears, format } from "date-fns"

// Function to generate random stock price data
export function generateMockStockData(ticker: string, days = 180) {
  const today = new Date()
  const startDate = subDays(today, days)

  // Generate company info based on ticker
  const companyInfo: Record<string, { name: string; startPrice: number; volatility: number }> = {
    AAPL: { name: "Apple Inc.", startPrice: 180, volatility: 0.015 },
    MSFT: { name: "Microsoft Corporation", startPrice: 350, volatility: 0.012 },
    GOOGL: { name: "Alphabet Inc.", startPrice: 140, volatility: 0.018 },
    AMZN: { name: "Amazon.com, Inc.", startPrice: 130, volatility: 0.02 },
    META: { name: "Meta Platforms, Inc.", startPrice: 300, volatility: 0.022 },
    TSLA: { name: "Tesla, Inc.", startPrice: 240, volatility: 0.03 },
    NVDA: { name: "NVIDIA Corporation", startPrice: 400, volatility: 0.025 },
  }

  // Default values if ticker not found
  const { name, startPrice, volatility } = companyInfo[ticker] || {
    name: `${ticker} Inc.`,
    startPrice: 100,
    volatility: 0.02,
  }

  // Generate historical data
  let currentPrice = startPrice
  const historicalData = []

  for (let i = 0; i < days; i++) {
    const date = addDays(startDate, i)
    // Random price movement with trend
    const change = (Math.random() - 0.48) * volatility * currentPrice
    currentPrice = Math.max(0.1, currentPrice + change)

    historicalData.push({
      date: format(date, "yyyy-MM-dd"),
      price: Number.parseFloat(currentPrice.toFixed(2)),
    })
  }

  // Calculate metrics
  const lastPrice = historicalData[historicalData.length - 2].price
  const currentPriceValue = historicalData[historicalData.length - 1].price
  const priceChange = currentPriceValue - lastPrice
  const priceChangePercent = (priceChange / lastPrice) * 100

  // Generate metrics
  const metrics = {
    pe_ratio: Number.parseFloat((Math.random() * 30 + 10).toFixed(2)),
    market_cap: currentPriceValue * (Math.random() * 5 + 1) * 1e9,
    dividend_yield: Math.random() * 0.03,
    volume: Math.floor(Math.random() * 10 + 1) * 1e6,
    avg_volume: Math.floor(Math.random() * 10 + 1) * 1e6,
    high_52w: Math.max(...historicalData.map((d) => d.price)),
    low_52w: Math.min(...historicalData.map((d) => d.price)),
  }

  return {
    ticker,
    companyName: name,
    currentPrice: currentPriceValue,
    priceChange,
    priceChangePercent,
    historicalData,
    metrics,
  }
}

// Function to generate random crypto data
export function generateMockCryptoData(symbol: string, days = 180) {
  const today = new Date()
  const startDate = subDays(today, days)

  // Generate crypto info based on symbol
  const cryptoInfo: Record<string, { name: string; startPrice: number; volatility: number }> = {
    BTC: { name: "Bitcoin", startPrice: 50000, volatility: 0.025 },
    ETH: { name: "Ethereum", startPrice: 3000, volatility: 0.03 },
    BNB: { name: "Binance Coin", startPrice: 400, volatility: 0.028 },
    SOL: { name: "Solana", startPrice: 100, volatility: 0.04 },
    XRP: { name: "Ripple", startPrice: 0.5, volatility: 0.035 },
    ADA: { name: "Cardano", startPrice: 0.4, volatility: 0.038 },
  }

  // Default values if symbol not found
  const { name, startPrice, volatility } = cryptoInfo[symbol] || {
    name: `${symbol}coin`,
    startPrice: 10,
    volatility: 0.03,
  }

  // Generate price history
  let currentPrice = startPrice
  const priceHistory = []

  for (let i = 0; i < days; i++) {
    const date = addDays(startDate, i)
    // Random price movement with trend
    const change = (Math.random() - 0.48) * volatility * currentPrice
    currentPrice = Math.max(0.0001, currentPrice + change)

    priceHistory.push({
      date: format(date, "yyyy-MM-dd"),
      price: Number.parseFloat(currentPrice.toFixed(4)),
    })
  }

  // Calculate metrics
  const lastPrice = priceHistory[priceHistory.length - 2].price
  const currentPriceValue = priceHistory[priceHistory.length - 1].price
  const priceChange = currentPriceValue - lastPrice
  const priceChangePercent = (priceChange / lastPrice) * 100

  // Generate crypto-specific metrics
  const metrics = {
    market_cap: currentPriceValue * (Math.random() * 5 + 1) * 1e9,
    volume_24h: currentPriceValue * (Math.random() * 5 + 1) * 1e8,
    circulating_supply: Math.floor(Math.random() * 100 + 10) * 1e6,
    max_supply: symbol === "BTC" ? 21e6 : Math.random() > 0.3 ? Math.floor(Math.random() * 1000 + 100) * 1e6 : null,
    all_time_high: currentPriceValue * (1 + Math.random()),
    all_time_high_date: format(subDays(today, Math.floor(Math.random() * 365)), "yyyy-MM-dd"),
    price_change_24h: Math.random() * 10 - 5,
    price_change_7d: Math.random() * 20 - 10,
    price_change_30d: Math.random() * 40 - 20,
  }

  return {
    symbol,
    name,
    currentPrice: currentPriceValue,
    priceChange,
    priceChangePercent,
    priceHistory,
    metrics,
  }
}

// Function to generate candle data
export function generateMockCandleData(timeframe: string, basePrice: number, volatility: number) {
  const today = new Date()
  let startDate: Date
  let intervals: number

  // Determine time range based on timeframe
  switch (timeframe) {
    case "1d": // Intraday (hourly candles)
      startDate = subHours(today, 24)
      intervals = 24
      break
    case "1w": // 1 Week (daily candles)
      startDate = subDays(today, 7)
      intervals = 7
      break
    case "15d": // 15 Days (daily candles)
      startDate = subDays(today, 15)
      intervals = 15
      break
    case "3m": // 3 Months (daily candles)
      startDate = subMonths(today, 3)
      intervals = 90
      break
    case "6m": // 6 Months (daily candles)
      startDate = subMonths(today, 6)
      intervals = 180
      break
    case "1y": // 1 Year (weekly candles)
      startDate = subYears(today, 1)
      intervals = 52
      break
    case "3y": // 3 Years (weekly candles)
      startDate = subYears(today, 3)
      intervals = 156
      break
    default:
      startDate = subDays(today, 30)
      intervals = 30
  }

  // Generate candle data
  const candles = []
  let price = basePrice

  for (let i = 0; i < intervals; i++) {
    let date: Date

    // Calculate date based on timeframe
    if (timeframe === "1d") {
      date = addDays(startDate, 0)
      date.setHours(date.getHours() + i)
    } else if (timeframe === "1y" || timeframe === "3y") {
      date = addDays(startDate, i * 7) // Weekly candles
    } else {
      date = addDays(startDate, i) // Daily candles
    }

    // Generate OHLC data
    const changePercent = (Math.random() - 0.5) * volatility
    const change = price * changePercent

    const open = price
    price = Math.max(0.0001, price + change)
    const close = price

    // High and low are variations of open/close
    const highLowRange = Math.abs(open - close) * (1 + Math.random())
    const high = Math.max(open, close) + highLowRange / 2
    const low = Math.min(open, close) - highLowRange / 2

    // Volume is proportional to price movement
    const volume = basePrice * 1000 * (1 + Math.random() * Math.abs(changePercent) * 10)

    candles.push({
      date: format(date, "yyyy-MM-dd HH:mm:ss"),
      open: Number.parseFloat(open.toFixed(4)),
      high: Number.parseFloat(high.toFixed(4)),
      low: Number.parseFloat(low.toFixed(4)),
      close: Number.parseFloat(close.toFixed(4)),
      volume: Math.floor(volume),
    })
  }

  return candles
}

// Function to generate prediction data based on timeframe
export function generateMockPredictionData(
  assetType: "stock" | "crypto",
  symbol: string,
  timeframe: string,
  historicalData: any[],
) {
  if (!historicalData || historicalData.length === 0) {
    return null
  }

  const lastPrice = historicalData[historicalData.length - 1].price
  const predictions = []

  // Determine prediction intervals based on timeframe
  let intervals: number
  let volatilityMultiplier: number

  switch (timeframe) {
    case "1d": // Intraday (hourly predictions)
      intervals = 24
      volatilityMultiplier = 0.5
      break
    case "1w": // 1 Week (daily predictions)
      intervals = 7
      volatilityMultiplier = 1
      break
    case "15d": // 15 Days (daily predictions)
      intervals = 15
      volatilityMultiplier = 1.2
      break
    case "3m": // 3 Months (weekly predictions)
      intervals = 12 // 12 weeks
      volatilityMultiplier = 1.5
      break
    case "6m": // 6 Months (weekly predictions)
      intervals = 24 // 24 weeks
      volatilityMultiplier = 1.8
      break
    case "1y": // 1 Year (monthly predictions)
      intervals = 12 // 12 months
      volatilityMultiplier = 2
      break
    case "3y": // 3 Years (monthly predictions)
      intervals = 36 // 36 months
      volatilityMultiplier = 3
      break
    default:
      intervals = 30
      volatilityMultiplier = 1
  }

  // Generate predictions
  let predictedPrice = lastPrice
  const trend = Math.random() > 0.5 ? 1 : -1 // Random trend direction
  const baseVolatility = assetType === "crypto" ? 0.03 : 0.02 // Crypto is more volatile
  const volatility = baseVolatility * volatilityMultiplier

  for (let day = 1; day <= intervals; day++) {
    // Add some randomness with a slight trend
    const randomFactor = (Math.random() - 0.5) * volatility
    const trendFactor = trend * day * 0.001 * volatilityMultiplier
    const change = predictedPrice * (randomFactor + trendFactor)

    predictedPrice = Math.max(0.0001, predictedPrice + change)

    // Add confidence intervals (wider as we predict further into the future)
    const confidenceRange = predictedPrice * (0.02 + day * 0.002 * volatilityMultiplier)

    predictions.push({
      day,
      prediction: Number.parseFloat(predictedPrice.toFixed(assetType === "crypto" ? 4 : 2)),
      lower_bound: Number.parseFloat((predictedPrice - confidenceRange).toFixed(assetType === "crypto" ? 4 : 2)),
      upper_bound: Number.parseFloat((predictedPrice + confidenceRange).toFixed(assetType === "crypto" ? 4 : 2)),
    })
  }

  // Generate prediction metrics
  const targetPrice = predictions[predictions.length - 1].prediction
  const priceChange = targetPrice - lastPrice
  const percentChange = (priceChange / lastPrice) * 100

  // Determine recommendation based on predicted change
  let recommendation
  if (percentChange > 15) recommendation = "Strong Buy"
  else if (percentChange > 5) recommendation = "Buy"
  else if (percentChange > -5) recommendation = "Hold"
  else if (percentChange > -15) recommendation = "Sell"
  else recommendation = "Strong Sell"

  // Determine risk level
  let riskLevel
  const volatilityMeasure = Math.abs(
    predictions.reduce((sum, p) => sum + Math.abs(p.upper_bound - p.lower_bound), 0) / predictions.length / lastPrice,
  )

  if (volatilityMeasure > 0.3) riskLevel = "High"
  else if (volatilityMeasure > 0.15) riskLevel = "Medium"
  else riskLevel = "Low"

  return {
    symbol,
    predictions,
    metrics: {
      target_price: targetPrice,
      confidence: 0.7 + Math.random() * 0.2, // 70-90% confidence
      risk_level: riskLevel,
      recommendation,
    },
  }
}

// Function to generate mock global market data
export function generateMockGlobalMarkets() {
  const markets = [
    // Americas
    { index: "SPX", name: "S&P 500", region: "americas", country: "USA", currency: "USD" },
    { index: "DJI", name: "Dow Jones", region: "americas", country: "USA", currency: "USD" },
    { index: "IXIC", name: "NASDAQ", region: "americas", country: "USA", currency: "USD" },
    { index: "TSX", name: "Toronto SE", region: "americas", country: "Canada", currency: "CAD" },
    { index: "BOVESPA", name: "Brazil Bovespa", region: "americas", country: "Brazil", currency: "BRL" },

    // Europe
    { index: "FTSE", name: "FTSE 100  country: 'Brazil", currency: "BRL" },

    // Europe
    { index: "FTSE", name: "FTSE 100", region: "europe", country: "UK", currency: "GBP" },
    { index: "DAX", name: "DAX", region: "europe", country: "Germany", currency: "EUR" },
    { index: "CAC", name: "CAC 40", region: "europe", country: "France", currency: "EUR" },
    { index: "IBEX", name: "IBEX 35", region: "europe", country: "Spain", currency: "EUR" },
    { index: "FTSEMIB", name: "FTSE MIB", region: "europe", country: "Italy", currency: "EUR" },

    // Asia
    { index: "NIKKEI", name: "Nikkei 225", region: "asia", country: "Japan", currency: "JPY" },
    { index: "HSI", name: "Hang Seng", region: "asia", country: "Hong Kong", currency: "HKD" },
    { index: "SSE", name: "Shanghai", region: "asia", country: "China", currency: "CNY" },
    { index: "KOSPI", name: "KOSPI", region: "asia", country: "South Korea", currency: "KRW" },
    { index: "SENSEX", name: "BSE SENSEX", region: "asia", country: "India", currency: "INR" },
    { index: "ASX", name: "ASX 200", region: "asia", country: "Australia", currency: "AUD" },
  ]

  // Generate random values and changes for each market
  return markets.map((market) => {
    const baseValue = Math.random() * 20000 + 5000 // Random base value between 5,000 and 25,000
    const changePercent = Math.random() * 6 - 3 // Random change between -3% and +3%
    const change = baseValue * (changePercent / 100)
    const value = baseValue + change

    return {
      ...market,
      value: Math.round(value * 100) / 100,
      change: Math.round(change * 100) / 100,
      changePercent: Math.round(changePercent * 100) / 100,
    }
  })
}

// Simulate API call to fetch stock data
export async function fetchStockData(ticker: string) {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Generate mock data
  return generateMockStockData(ticker)
}

// Simulate API call to fetch crypto data
export async function fetchCryptoData(symbol: string) {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Generate mock data
  return generateMockCryptoData(symbol)
}

// Simulate API call to fetch stock candle data
export async function fetchStockCandles(ticker: string, timeframe: string) {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1200))

  // Get base price and volatility for the ticker
  const stockInfo: Record<string, { basePrice: number; volatility: number }> = {
    AAPL: { basePrice: 180, volatility: 0.015 },
    MSFT: { basePrice: 350, volatility: 0.012 },
    GOOGL: { basePrice: 140, volatility: 0.018 },
    AMZN: { basePrice: 130, volatility: 0.02 },
    META: { basePrice: 300, volatility: 0.022 },
    TSLA: { basePrice: 240, volatility: 0.03 },
    NVDA: { basePrice: 400, volatility: 0.025 },
  }

  const { basePrice, volatility } = stockInfo[ticker] || { basePrice: 100, volatility: 0.02 }

  // Generate candle data
  const candles = generateMockCandleData(timeframe, basePrice, volatility)

  return {
    ticker,
    timeframe,
    candles,
  }
}

// Simulate API call to fetch crypto candle data
export async function fetchCryptoCandles(symbol: string, timeframe: string) {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1200))

  // Get base price and volatility for the crypto
  const cryptoInfo: Record<string, { basePrice: number; volatility: number }> = {
    BTC: { basePrice: 50000, volatility: 0.025 },
    ETH: { basePrice: 3000, volatility: 0.03 },
    BNB: { basePrice: 400, volatility: 0.028 },
    SOL: { basePrice: 100, volatility: 0.04 },
    XRP: { basePrice: 0.5, volatility: 0.035 },
    ADA: { basePrice: 0.4, volatility: 0.038 },
  }

  const { basePrice, volatility } = cryptoInfo[symbol] || { basePrice: 10, volatility: 0.03 }

  // Generate candle data
  const candles = generateMockCandleData(timeframe, basePrice, volatility)

  return {
    symbol,
    timeframe,
    candles,
  }
}

// Simulate API call to fetch prediction data
export async function fetchPrediction(assetType: "stock" | "crypto", symbol: string, timeframe: string) {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1500))

  // Get historical data first
  let historicalData
  if (assetType === "stock") {
    const stockData = await fetchStockData(symbol)
    historicalData = stockData.historicalData
  } else {
    const cryptoData = await fetchCryptoData(symbol)
    historicalData = cryptoData.priceHistory
  }

  // Generate predictions based on historical data
  return generateMockPredictionData(assetType, symbol, timeframe, historicalData)
}

// Simulate API call to fetch global market data
export async function fetchGlobalMarkets() {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 800))

  // Generate mock global market data
  return generateMockGlobalMarkets()
}

