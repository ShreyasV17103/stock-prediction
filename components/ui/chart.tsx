"use client"

import type * as React from "react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./tooltip"
import {
  XAxis,
  YAxis,
  LineChart,
  Line,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"

interface ChartProps {
  children: React.ReactNode
  className?: string
}

interface ChartContainerProps {
  children: React.ReactNode
  className?: string
}

interface ChartTooltipContentProps {
  formatValues?: (value: number) => string
}

interface ChartLineProps {
  data: any[]
  dataKey: string
  xKey: string
  strokeWidth?: number
  stroke?: string
  strokeDasharray?: string
  name?: string
}

interface ChartXAxisProps {
  dataKey: string
  tickFormatter?: (value: any) => string
}

interface ChartYAxisProps {
  tickFormatter?: (value: any) => string
}

interface ChartAreaProps {
  children: React.ReactNode
}

type ChartLegendProps = {}

const Chart = ({ children, className }: ChartProps) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>{children}</LineChart>
    </ResponsiveContainer>
  )
}

const ChartContainer = ({ children, className }: ChartContainerProps) => {
  return <div className={className}>{children}</div>
}

const ChartTooltip = ({ children }: { children: React.ReactNode }) => {
  return <RechartsTooltip content={children} />
}

const ChartTooltipContent = ({ formatValues }: ChartTooltipContentProps) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <TooltipContent>{/* Custom tooltip content can be rendered here */}</TooltipContent>
        </TooltipTrigger>
      </Tooltip>
    </TooltipProvider>
  )
}

const ChartLine = ({
  data,
  dataKey,
  xKey,
  strokeWidth = 2,
  stroke = "#8884d8",
  strokeDasharray,
  name,
}: ChartLineProps) => {
  return (
    <Line
      type="monotone"
      dataKey={dataKey}
      data={data}
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeDasharray={strokeDasharray}
      name={name}
    />
  )
}

const ChartXAxis = ({ dataKey, tickFormatter }: ChartXAxisProps) => {
  return <XAxis dataKey={dataKey} tickFormatter={tickFormatter} />
}

const ChartYAxis = ({ tickFormatter }: ChartYAxisProps) => {
  return <YAxis tickFormatter={tickFormatter} />
}

const ChartArea = ({ children }: ChartAreaProps) => {
  return <CartesianGrid strokeDasharray="3 3" />
}

const ChartLegend = ({}: ChartLegendProps) => {
  return <Legend />
}

export {
  Chart,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartArea,
  ChartLine,
  ChartXAxis,
  ChartYAxis,
  ChartLegend,
}

