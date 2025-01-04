import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Budget, BudgetExpense, BudgetOverviewStats } from "../lib/types/budget"
import { startOfMonth, subMonths } from "date-fns"
import { create } from "zustand"
import { useMemo, useCallback } from "react"

interface BudgetStore {
  activeBudgetId: string | null
  setActiveBudgetId: (id: string | null) => void
}

const useBudgetStore = create<BudgetStore>((set) => ({
  activeBudgetId: localStorage.getItem('active-budget-id'),
  setActiveBudgetId: (id: string | null) => {
    if (id) {
      localStorage.setItem('active-budget-id', id)
    } else {
      localStorage.removeItem('active-budget-id')
    }
    set({ activeBudgetId: id })
  }
}))

// In a real app, these would be API calls
const mockBudgetApi = {
  getAllBudgets: async (): Promise<Budget[]> => {
    const stored = localStorage.getItem('budgets')
    return stored ? JSON.parse(stored) : []
  },
  
  getBudget: async (id: string): Promise<Budget | null> => {
    const stored = localStorage.getItem('budgets')
    const budgets: Budget[] = stored ? JSON.parse(stored) : []
    return budgets.find(b => b.id === id) || null
  },
  
  setBudget: async (budget: Budget): Promise<Budget> => {
    const stored = localStorage.getItem('budgets')
    const budgets: Budget[] = stored ? JSON.parse(stored) : []
    const updatedBudgets = budgets.some(b => b.id === budget.id)
      ? budgets.map(b => b.id === budget.id ? budget : b)
      : [...budgets, budget]
    localStorage.setItem('budgets', JSON.stringify(updatedBudgets))
    return budget
  },
  
  addExpense: async (expense: BudgetExpense): Promise<BudgetExpense> => {
    const stored = localStorage.getItem('budget-expenses') || '[]'
    const expenses = JSON.parse(stored)
    const newExpense = { ...expense, id: crypto.randomUUID() }
    localStorage.setItem('budget-expenses', JSON.stringify([...expenses, newExpense]))
    return newExpense
  },
  
  getExpenses: async (budgetId: string): Promise<BudgetExpense[]> => {
    const stored = localStorage.getItem('budget-expenses')
    const expenses: BudgetExpense[] = stored ? JSON.parse(stored) : []
    return expenses.filter(e => e.budgetId === budgetId)
  },
  
  deleteBudget: async (id: string): Promise<void> => {
    const stored = localStorage.getItem('budgets')
    const budgets: Budget[] = stored ? JSON.parse(stored) : []
    const updatedBudgets = budgets.filter(b => b.id !== id)
    localStorage.setItem('budgets', JSON.stringify(updatedBudgets))
  }
}

export function useBudget() {
  const queryClient = useQueryClient()
  const { activeBudgetId, setActiveBudgetId } = useBudgetStore()

  const { data: budgets = [] } = useQuery<Budget[]>({
    queryKey: ['budgets'],
    queryFn: mockBudgetApi.getAllBudgets
  })

  const { data: budget } = useQuery<Budget | null>({
    queryKey: ['budget', activeBudgetId],
    queryFn: () => activeBudgetId ? mockBudgetApi.getBudget(activeBudgetId) : Promise.resolve(null),
    enabled: !!activeBudgetId
  })

  const { data: expenses = [] } = useQuery<BudgetExpense[]>({
    queryKey: ['budget-expenses', activeBudgetId],
    queryFn: () => activeBudgetId ? mockBudgetApi.getExpenses(activeBudgetId) : Promise.resolve([]),
    enabled: !!activeBudgetId
  })

  const setBudgetMutation = useMutation({
    mutationFn: mockBudgetApi.setBudget,
    onSuccess: (budget) => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] })
      queryClient.invalidateQueries({ queryKey: ['budget', budget.id] })
      if (!activeBudgetId) {
        setActiveBudgetId(budget.id)
      }
    }
  })

  const addExpenseMutation = useMutation({
    mutationFn: mockBudgetApi.addExpense,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budget-expenses', activeBudgetId] })
    }
  })

  const deleteBudgetMutation = useMutation({
    mutationFn: mockBudgetApi.deleteBudget,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] })
      if (activeBudgetId) {
        setActiveBudgetId(budgets[0]?.id || null)
      }
    }
  })

  // Memoize expense calculations
  const { currentMonthExpenses, currentMonthTotal, monthlyChange } = useMemo(() => {
    const currentMonthStart = startOfMonth(new Date())
    const currentMonthExpenses = expenses.filter(exp => 
      new Date(exp.date) >= currentMonthStart
    )
    const currentMonthTotal = currentMonthExpenses.reduce((sum, exp) => sum + exp.amount, 0)

    const previousMonthStart = startOfMonth(subMonths(new Date(), 1))
    const previousMonthExpenses = expenses.filter(exp => 
      new Date(exp.date) >= previousMonthStart && new Date(exp.date) < currentMonthStart
    )
    const monthlyChange = (() => {
      const previousTotal = previousMonthExpenses.reduce((sum, exp) => sum + exp.amount, 0)
      return previousTotal === 0 ? 0 : ((currentMonthTotal - previousTotal) / previousTotal) * 100
    })()

    return {
      currentMonthExpenses,
      currentMonthTotal,
      monthlyChange
    }
  }, [expenses])

  // Memoize stats calculation
  const stats: BudgetOverviewStats | null = useMemo(() => {
    if (!budget) return null
    return {
      totalBudget: budget.amount,
      totalSpent: currentMonthTotal,
      remaining: budget.amount - currentMonthTotal,
      spentPercentage: (currentMonthTotal / budget.amount) * 100,
      monthlyChange
    }
  }, [budget, currentMonthTotal, monthlyChange])

  // Memoize category stats calculation
  const categoryStats = useMemo(() => {
    if (!budget) return undefined
    return budget.categories.map(cat => {
      const categoryExpenses = currentMonthExpenses.filter(exp => exp.categoryId === cat.id)
      const spent = categoryExpenses.reduce((sum, exp) => sum + exp.amount, 0)
      return {
        ...cat,
        spent
      }
    })
  }, [budget, currentMonthExpenses])

  // Memoize callback functions
  const setBudget = useCallback((budget: Budget) => {
    setBudgetMutation.mutate(budget)
  }, [setBudgetMutation])
  
  const addExpense = useCallback((expense: Omit<BudgetExpense, "id" | "budgetId">) => {
    if (!activeBudgetId) return
    addExpenseMutation.mutate({
      ...expense,
      id: "",
      budgetId: activeBudgetId
    })
  }, [activeBudgetId, addExpenseMutation])

  const deleteBudget = useCallback((id: string) => {
    deleteBudgetMutation.mutate(id)
  }, [deleteBudgetMutation])

  return {
    budget,
    budgets,
    expenses,
    stats,
    categoryStats,
    activeBudgetId,
    setActiveBudgetId,
    setBudget,
    addExpense,
    deleteBudget,
    isLoading: setBudgetMutation.isPending || addExpenseMutation.isPending || deleteBudgetMutation.isPending
  }
} 