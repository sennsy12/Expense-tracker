export interface Asset {
  id: string
  name: string
  type: "asset" | "liability"
  value: number
}

export interface NetWorthEntry {
  id: string
  date: string
  assetName: string
  type: "asset" | "liability"
  action: "add" | "subtract"
  value: number
  netWorth: number
}