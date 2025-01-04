export interface Budget {
  id: string
  name: string
  type: BudgetType
  monthYear: string
  amount: number
  categories: BudgetCategory[]
  completed: boolean
}

export type BudgetType = "monthly" | "vacation" | "home" | "project" | "savings" | "custom"

export interface BudgetCategory {
  id: string
  name: string
  budgetAmount: number
  spent: number
}

export interface BudgetExpense {
  id: string
  budgetId: string
  date: string
  amount: number
  categoryId: string
  description: string
}

export type BudgetOverviewStats = {
  totalBudget: number
  totalSpent: number
  remaining: number
  spentPercentage: number
  monthlyChange: number
} 