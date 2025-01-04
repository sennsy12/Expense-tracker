import { useMemo, useState } from "react"
import { format, parseISO } from "date-fns"
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  TooltipProps,
} from "recharts"
import { useHistoricalRates } from "../../hooks/useHistoricalRates"
import { TimeRange } from "../../lib/types/currency"
import { cn } from "../../lib/utils/utils"

interface ExchangeRateChartProps {
  fromCurrency: string
  toCurrency: string
  amount: number
}

const timeRanges: { label: string; value: TimeRange }[] = [
  { label: "1D", value: "1D" },
  { label: "7D", value: "7D" },
  { label: "30D", value: "30D" },
  { label: "3M", value: "3M" },
]

export function ExchangeRateChart({
  fromCurrency,
  toCurrency,
  amount,
}: ExchangeRateChartProps) {
  const [timeRange, setTimeRange] = useState<TimeRange>("30D")
  const { data, isLoading, isError } = useHistoricalRates(fromCurrency, toCurrency, amount, timeRange)

  const CustomTooltip = useMemo(() => {
    return ({ active, payload, label }: TooltipProps<number, string>) => {
      if (active && payload?.[0]?.value && label) {
        return (
          <div className="rounded-lg border bg-background p-2 sm:p-3 shadow-sm">
            <p className="text-xs sm:text-sm font-medium">
              {format(parseISO(label), "MMM d, yyyy")}
            </p>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              {amount} {fromCurrency} = {payload[0].value.toFixed(2)} {toCurrency}
            </p>
          </div>
        )
      }
      return null
    }
  }, [amount, fromCurrency, toCurrency])

  const chartConfig = useMemo(() => {
    // Calculate Y-axis domain with padding
    const maxRate = data ? Math.max(...data.map(d => d.rate)) : 0
    const minRate = data ? Math.min(...data.map(d => d.rate)) : 0
    const range = maxRate - minRate

    // Add more padding for 1D view
    const padding = timeRange === "1D" ? range * 0.5 : range * 0.1
    const yMax = maxRate + padding
    const yMin = Math.max(0, minRate - padding) // Don't go below 0

    return {
      margin: { top: 0, right: 0, left: 0, bottom: 0 },
      xAxisConfig: {
        dataKey: "date",
        tickFormatter: (date: string) => {
          const parsedDate = parseISO(date)
          // If date includes hours (for 1D view), show time, otherwise show date
          return date.includes(":00")
            ? format(parsedDate, "HH:00")
            : format(parsedDate, "MMM d")
        },
        fontSize: 10,
        tickLine: false,
        axisLine: false,
        dy: 10,
        tick: { fontSize: '10px' }
      },
      yAxisConfig: {
        fontSize: 10,
        tickLine: false,
        axisLine: false,
        tickFormatter: (value: number) => value.toFixed(2),
        dx: -10,
        tick: { fontSize: '10px' },
        domain: [yMin, yMax] as [number, number]
      },
      areaConfig: {
        type: "monotone" as const,
        dataKey: "rate",
        stroke: "hsl(var(--primary))",
        fillOpacity: 1,
        fill: "url(#rate)"
      }
    }
  }, [data, timeRange])

  if (isLoading) {
    return (
      <div className="h-[250px] sm:h-[300px] rounded-lg border bg-card flex items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading chart data...</p>
      </div>
    )
  }

  if (isError || !data) {
    return (
      <div className="h-[250px] sm:h-[300px] rounded-lg border bg-card flex items-center justify-center">
        <p className="text-sm text-red-500">
          Failed to load historical exchange rates
        </p>
      </div>
    )
  }

  return (
    <div className="h-[250px] sm:h-[300px] rounded-lg border bg-card p-4 sm:p-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium">Exchange Rate History</h3>
          <p className="text-xs sm:text-sm text-muted-foreground">
            {timeRange === "1D" ? "24 hours" : `Last ${timeRange}`} of {amount} {fromCurrency} to {toCurrency}
          </p>
        </div>
        <div className="flex gap-1 bg-muted rounded-md p-1">
          {timeRanges.map((range) => (
            <button
              key={range.value}
              onClick={() => setTimeRange(range.value)}
              className={cn(
                "px-2 py-1 text-xs font-medium rounded-sm transition-colors",
                timeRange === range.value
                  ? "bg-background shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>
      <ResponsiveContainer width="100%" height={170} className="sm:h-[200px]">
        <AreaChart data={data} margin={chartConfig.margin}>
          <defs>
            <linearGradient id="rate" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
              <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis {...chartConfig.xAxisConfig} />
          <YAxis {...chartConfig.yAxisConfig} />
          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
          <Tooltip content={CustomTooltip} />
          <Area {...chartConfig.areaConfig} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
} 