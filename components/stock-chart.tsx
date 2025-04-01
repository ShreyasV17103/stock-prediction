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
} from "@/components/ui/chart"
import { format } from "date-fns"

interface StockChartProps {
  data: Array<{ date: string; price: number }>
  loading: boolean
}

export default function StockChart({ data, loading }: StockChartProps) {
  if (loading) {
    return <Skeleton className="w-full h-[400px]" />
  }

  // If no data, show placeholder
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[400px] border rounded-md bg-muted/20">
        <p className="text-muted-foreground">No data available</p>
      </div>
    )
  }

  // Format data for chart
  const chartData = data.map((item) => ({
    date: new Date(item.date),
    price: item.price,
  }))

  return (
    <ChartContainer className="h-[400px]">
      <Chart>
        <ChartTooltip>
          <ChartTooltipContent formatValues={(v) => `$${v.toFixed(2)}`} />
        </ChartTooltip>
        <ChartArea>
          <ChartLine data={chartData} dataKey="price" xKey="date" strokeWidth={2} stroke="#3b82f6" />
        </ChartArea>
        <ChartXAxis dataKey="date" tickFormatter={(value) => format(new Date(value), "MMM dd")} />
        <ChartYAxis tickFormatter={(value) => `$${value}`} />
      </Chart>
    </ChartContainer>
  )
}

