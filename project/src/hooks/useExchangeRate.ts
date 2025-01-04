import { useQuery } from "@tanstack/react-query"
import { ExchangeRateResponse } from "../lib/types/currency"

const API_KEY = "5fcd0d4feac7d764fab1d0b2"
const BASE_URL = "https://v6.exchangerate-api.com/v6"

export function useExchangeRate(fromCurrency: string) {
  return useQuery<ExchangeRateResponse>({
    queryKey: ["exchangeRates", fromCurrency],
    queryFn: async () => {
      const response = await fetch(
        `${BASE_URL}/${API_KEY}/latest/${fromCurrency}`
      )
      if (!response.ok) {
        throw new Error("Failed to fetch exchange rates")
      }
      return response.json()
    },
    staleTime: 1000 * 60 * 5, 
  })
} 