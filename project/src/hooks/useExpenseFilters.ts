import { useMemo, useState } from 'react'
import { ExpenseWithId } from '../lib/types'
import { FilterValues, SortOption } from '../lib/types/filters'

const defaultFilters: FilterValues = {
  categories: [],
  dateRange: { from: undefined, to: undefined },
  amountRange: { min: undefined, max: undefined },
  searchTerm: '',
}

export function useExpenseFilters(expenses: ExpenseWithId[]) {
  const [filters, setFilters] = useState<FilterValues>(defaultFilters)
  const [sort, setSort] = useState<SortOption>({
    field: 'date',
    direction: 'desc',
  })

  const filteredExpenses = useMemo(() => {
    return expenses.filter(expense => {
      // Category filter
      if (filters.categories.length > 0 && !filters.categories.includes(expense.category)) {
        return false
      }

      // Date range filter
      if (filters.dateRange.from && new Date(expense.date) < filters.dateRange.from) {
        return false
      }
      if (filters.dateRange.to && new Date(expense.date) > filters.dateRange.to) {
        return false
      }

      // Amount range filter
      if (filters.amountRange.min && expense.amount < filters.amountRange.min) {
        return false
      }
      if (filters.amountRange.max && expense.amount > filters.amountRange.max) {
        return false
      }

      // Search term filter
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase()
        return (
          expense.description.toLowerCase().includes(searchLower) ||
          expense.category.toLowerCase().includes(searchLower)
        )
      }

      return true
    }).sort((a, b) => {
      const direction = sort.direction === 'asc' ? 1 : -1
      
      switch (sort.field) {
        case 'date':
          return (new Date(a.date).getTime() - new Date(b.date).getTime()) * direction
        case 'amount':
          return (a.amount - b.amount) * direction
        case 'category':
          return a.category.localeCompare(b.category) * direction
        default:
          return 0
      }
    })
  }, [expenses, filters, sort])

  const updateFilters = (newFilters: Partial<FilterValues>) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
  }

  const resetFilters = () => {
    setFilters(defaultFilters)
  }

  return {
    filters,
    sort,
    filteredExpenses,
    updateFilters,
    setSort,
    resetFilters,
  }
} 