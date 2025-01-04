export type DateRange = {
  from: Date | undefined
  to: Date | undefined
}

export type FilterValues = {
  categories: string[]
  dateRange: DateRange
  amountRange: {
    min: number | undefined
    max: number | undefined
  }
  searchTerm: string
}

export type SortOption = {
  field: 'date' | 'amount' | 'category'
  direction: 'asc' | 'desc'
} 