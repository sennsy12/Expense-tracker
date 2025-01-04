import { useExpenseStore } from "../lib/store"
import { formatCurrency } from "../lib/utils/utils"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"
import { useMemo, useRef } from "react"
import type { CategoryTotal } from "../lib/types"
import { Download } from "lucide-react"
import html2canvas from 'html2canvas'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu"

const COLORS = [
  "#FF6B6B",
  "#4ECDC4",
  "#45B7D1",
  "#96CEB4",
  "#FFEEAD",
  "#D4A5A5",
  "#9FA8DA",
  "#FFE082",
  "#A5D6A7",
  "#EF9A9A",
]

export function ExpenseSummary() {
  const chartRef = useRef<HTMLDivElement>(null)
  const expenses = useExpenseStore((state) => state.expenses)

  const downloadChart = async (format: 'png' | 'jpeg') => {
    if (chartRef.current) {
      const canvas = await html2canvas(chartRef.current)
      const url = canvas.toDataURL(`image/${format}`)
      const link = document.createElement('a')
      link.download = `expense-chart.${format}`
      link.href = url
      link.click()
    }
  }

  const summary = useMemo(() => {
    const total = expenses.reduce((sum, expense) => sum + expense.amount, 0)
    const categoryTotals = expenses.reduce((acc, expense) => {
      const existing = acc.find((item) => item.category === expense.category)
      if (existing) {
        existing.total += expense.amount
      } else {
        acc.push({ category: expense.category, total: expense.amount })
      }
      return acc
    }, [] as CategoryTotal[])

    const highestCategory =
      categoryTotals.length > 0
        ? categoryTotals.reduce((prev, current) =>
            prev.total > current.total ? prev : current
          )
        : { category: "N/A", total: 0 }

    const dailyAverage =
      expenses.length > 0 ? total / expenses.length : 0

    return {
      total,
      highestCategory,
      dailyAverage,
      categoryTotals,
    }
  }, [expenses])

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

      <div className="h-[300px] rounded-lg border p-4" ref={chartRef}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-medium">Spending by Category</h3>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="p-2 hover:bg-gray-100 rounded-full dark:hover:bg-gray-800"
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
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={summary.categoryTotals}
              dataKey="total"
              nameKey="category"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label={(entry) => entry.category}
            >
              {summary.categoryTotals.map((entry, index) => (
                <Cell
                  key={entry.category}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number) => formatCurrency(value)}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
} 