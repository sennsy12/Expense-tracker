export type TimeRange = "1D" | "7D" | "30D" | "3M"

export interface ChartData {
  date: string
  rate: number
}

export interface Currency {
  code: string
  name: string
  region?: string
}

export interface ExchangeRateResponse {
  result: string
  documentation: string
  terms_of_use: string
  time_last_update_unix: number
  time_last_update_utc: string
  time_next_update_unix: number
  time_next_update_utc: string
  base_code: string
  conversion_rates: Record<string, number>
}

export interface HistoricalRateResponse {
  result: string
  base_code: string
  target_code: string
  conversion_rate: number
  time_last_update_utc: string
}

export const orderedRegions = [
  "Major",
  "Europe",
  "Asia",
  "Americas",
  "Middle East",
  "Africa",
  "Oceania",
  "Other",
] as const 