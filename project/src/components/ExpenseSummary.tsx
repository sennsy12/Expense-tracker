import { useExpenseStore } from "../lib/store"
import { formatCurrency } from "../lib/utils/utils"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, Legend, CartesianGrid } from "recharts"
import { useMemo, useRef, useState } from "react"
import type { CategoryTotal } from "../lib/types"
import { Download, BarChart3, PieChart as PieChartIcon } from "lucide-react"
import html2canvas from 'html2canvas'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu"

type ChartType = "pie" | "bar"

const COLORS = [
  "#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEEAD",
  "#D4A5A5", "#9FA8DA", "#FFE082", "#A5D6A7", "#EF9A9A",
]

interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string | undefined;
    value: number;
    payload: {
      category: string;
      total: number;
      [key: string]: string | number;
    };
  }>;
  label?: string;
}

export function ExpenseSummary() {
  const expenses = useExpenseStore((state) => state.expenses)
  const chartRef = useRef<HTMLDivElement>(null)
  const [chartType, setChartType] = useState<ChartType>("pie")

  const summary = useMemo(() => {
    const categoryTotals = expenses.reduce((acc, expense) => {
      const existing = acc.find((item) => item.category === expense.category)
      if (existing) {
        existing.total += expense.amount
      } else {
        acc.push({ category: expense.category, total: expense.amount })
      }
      return acc
    }, [] as CategoryTotal[])

    const total = categoryTotals.reduce((sum, item) => sum + item.total, 0)
    const highestCategory = categoryTotals.reduce(
      (max, item) => (item.total > max.total ? item : max),
      { category: "None", total: 0 }
    )

    // Calculate daily average
    if (expenses.length === 0) return { total: 0, highestCategory, dailyAverage: 0, categoryTotals }

    const dates = expenses.map((e) => new Date(e.date))
    const minDate = new Date(Math.min(...dates.map(d => d.getTime())))
    const maxDate = new Date(Math.max(...dates.map(d => d.getTime())))
    const daysDiff = Math.max(1, Math.ceil((maxDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24)))
    const dailyAverage = total / daysDiff

    return { total, highestCategory, dailyAverage, categoryTotals }
  }, [expenses])

  const downloadChart = async (format: 'png' | 'jpeg') => {
    if (!chartRef.current) return
    
    // Temporarily modify styles for better image quality
    const originalBg = chartRef.current.style.background
    chartRef.current.style.background = 'white'
    
    const canvas = await html2canvas(chartRef.current, {
      backgroundColor: 'white',
      scale: 2, // Increase resolution
      logging: false,
      useCORS: true,
      allowTaint: true
    })
    
    // Restore original styles
    chartRef.current.style.background = originalBg
    
    const link = document.createElement('a')
    link.download = `expense-chart.${format}`
    link.href = canvas.toDataURL(`image/${format}`, 1.0)
    link.click()
  }

  // Prepare data for stacked bar chart
  const monthlyData = useMemo(() => {
    type MonthData = {
      month: string;
      [category: string]: string | number;
    }
    
    const data: { [key: string]: MonthData } = {}
    
    expenses.forEach(expense => {
      const month = new Date(expense.date).toLocaleString('default', { month: 'short', year: '2-digit' })
      if (!data[month]) {
        data[month] = { month }
      }
      if (!data[month][expense.category]) {
        data[month][expense.category] = 0
      }
      data[month][expense.category] = (data[month][expense.category] as number) + expense.amount
    })

    return Object.values(data).sort((a, b) => 
      new Date(a.month) > new Date(b.month) ? 1 : -1
    )
  }, [expenses])

  const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border bg-background p-2 shadow-sm">
          <p className="text-sm font-medium">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm text-muted-foreground">
              {entry.name}: {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-lg border p-4">
          <h3 className="text-sm font-medium text-muted-foreground">Total</h3>
          <p className="mt-2 text-2xl font-bold">
            {formatCurrency(summary.total)}
          </p>
        </div>
        <div className="rounded-lg border p-4">
          <h3 className="text-sm font-medium text-muted-foreground">
            Highest Category
          </h3>
          <p className="mt-2 text-2xl font-bold truncate">
            {summary.highestCategory.category}
          </p>
          <p className="text-sm text-muted-foreground">
            {formatCurrency(summary.highestCategory.total)}
          </p>
        </div>
        <div className="rounded-lg border p-4">
          <h3 className="text-sm font-medium text-muted-foreground">
            Daily Average
          </h3>
          <p className="mt-2 text-2xl font-bold">
            {formatCurrency(summary.dailyAverage)}
          </p>
        </div>
      </div>

      <div className="h-[400px] sm:h-[450px] rounded-lg border bg-card p-4" ref={chartRef}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0 mb-4">
          <h3 className="text-sm font-medium">Spending by Category</h3>
          <div className="flex items-center gap-2">
            <div className="flex gap-1 bg-muted rounded-md p-1">
              <button
                onClick={() => setChartType("pie")}
                className={`p-1 rounded-sm ${
                  chartType === "pie"
                    ? "bg-background shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                title="Pie Chart"
              >
                <PieChartIcon className="h-4 w-4" />
              </button>
              <button
                onClick={() => setChartType("bar")}
                className={`p-1 rounded-sm ${
                  chartType === "bar"
                    ? "bg-background shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                title="Bar Chart"
              >
                <BarChart3 className="h-4 w-4" />
              </button>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="p-2 hover:bg-accent rounded-full"
                  title="Download Chart"
                >
                  <Download className="h-4 w-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => downloadChart('png')}>
                  Download as PNG
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => downloadChart('jpeg')}>
                  Download as JPEG
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="h-[calc(100%-4rem)] w-full">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === "pie" ? (
              <PieChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <Pie
                  data={summary.categoryTotals}
                  dataKey="total"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ category, percent }) => {
                    const name = window.innerWidth < 640
                      ? category.slice(0, 8) + (category.length > 8 ? '...' : '')
                      : category.slice(0, 15) + (category.length > 15 ? '...' : '')
                    return `${name} (${(percent * 100).toFixed(0)}%)`
                  }}
                  labelLine={true}
                >
                  {summary.categoryTotals.map((entry, index) => (
                    <Cell
                      key={entry.category}
                      fill={COLORS[index % COLORS.length]}
                      stroke="none"
                    />
                  ))}
                </Pie>
                <Tooltip content={(props) => CustomTooltip(props as TooltipProps)} />
              </PieChart>
            ) : (
              <BarChart 
                data={monthlyData} 
                margin={{ top: 40, right: 20, left: 20, bottom: 40 }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis 
                  dataKey="month" 
                  height={60}
                  angle={-45}
                  textAnchor="end"
                  interval={0}
                  tick={{ fontSize: 12, fill: 'currentColor' }}
                  tickMargin={25}
                  stroke="currentColor"
                />
                <YAxis 
                  tickFormatter={(value) => `$${value}`}
                  width={60}
                  tick={{ fontSize: 12, fill: 'currentColor' }}
                  stroke="currentColor"
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#f0f0f0', border: '1px solid #ccc', boxShadow: '0 0 10px #ccc' }}
                  itemStyle={{ color: '#333' }}
                  labelStyle={{ fontWeight: 'bold' }}
                  cursor={{ fill: 'currentColor', opacity: 0.1 }}
                />
                <Legend 
                  wrapperStyle={{ fontSize: '12px', marginTop: '20px' }}
                  verticalAlign="top"
                  height={36}
                />
                {summary.categoryTotals.map((category, index) => (
                  <Bar
                    key={category.category}
                    dataKey={category.category}
                    stackId="a"
                    fill={COLORS[index % COLORS.length]}
                    name={category.category.length > 15 ? `${category.category.slice(0, 15)}...` : category.category}
                  />
                ))}
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
} 