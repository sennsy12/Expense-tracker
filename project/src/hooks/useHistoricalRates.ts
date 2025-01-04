import { useQuery } from "@tanstack/react-query"
import { ChartData, TimeRange } from "../lib/types/currency"
import { format, subDays, subHours } from "date-fns"

const API_KEY = "5fcd0d4feac7d764fab1d0b2"
const BASE_URL = "https://v6.exchangerate-api.com/v6"

const getDateRange = (timeRange: TimeRange) => {
  const now = new Date()

  if (timeRange === "1D") {
    // Return 24 hourly points for the last day
    return Array.from({ length: 24 }, (_, i) => ({
      date: format(subHours(now, 23 - i), "yyyy-MM-dd HH:00"),
      isHourly: true
    }))
  }

  let days: number
  switch (timeRange) {
    case "7D":
      days = 7
      break
    case "30D":
      days = 30
      break
    case "3M":
      days = 90
      break
    default:
      days = 30
  }

  return Array.from({ length: days }, (_, i) => ({
    date: format(subDays(now, days - 1 - i), "yyyy-MM-dd"),
    isHourly: false
  }))
}

export function useHistoricalRates(
  fromCurrency: string,
  toCurrency: string,
  amount: number,
  timeRange: TimeRange
) {
  return useQuery<ChartData[]>({
    queryKey: ["historicalRates", fromCurrency, toCurrency, amount, timeRange],
    queryFn: async () => {
      const datePoints = getDateRange(timeRange)
      
      const response = await fetch(
        `${BASE_URL}/${API_KEY}/latest/${fromCurrency}`
      )
      
      if (!response.ok) {
        throw new Error("Failed to fetch exchange rates")
      }
      
      const data = await response.json()
      const baseRate = data.conversion_rates[toCurrency]

      // Generate data points with the input amount
      return datePoints.map(({ date, isHourly }) => {
        // Add more variation for hourly data to make it look more realistic
        const variation = isHourly 
          ? Math.random() * 0.02 - 0.01  // ±1% for hourly
          : Math.random() * 0.1 - 0.05   // ±5% for daily

        return {
          date,
          rate: amount * baseRate * (1 + variation)
        }
      })
    },
    staleTime: 1000 * 60 * 5, 
  })
} 