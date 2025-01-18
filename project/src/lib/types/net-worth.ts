export interface NetWorthEntry {
    id: string
    date: string
    assets: Asset[]
    liabilities: Liability[]
    totalAssets: number
    totalLiabilities: number
    netWorth: number
  }
  
  export interface Asset {
    id: string
    name: string
    value: number
  }
  
  export interface Liability {
    id: string
    name: string
    value: number
  }