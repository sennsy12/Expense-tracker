import { z } from "zod"

export const expenseCategories = [
  "Food & Dining",
  "Transportation",
  "Shopping",
  "Entertainment",
  "Healthcare",
  "Housing",
  "Utilities",
  "Education",
  "Travel",
  "Other"
] as const

export const ExpenseSchema = z.object({
  id: z.string().optional(),
  category: z.enum(expenseCategories),
  amount: z.number().positive(),
  date: z.string().transform((str) => new Date(str)),
  description: z.string().min(1).max(100),
})

export type Expense = {
  id?: string
  category: typeof expenseCategories[number]
  amount: number
  date: string
  description: string
}

export type ExpenseWithId = Required<Expense>

export type ExpenseSummary = {
  total: number
  highestCategory: {
    category: string
    amount: number
  }
  dailyAverage: number
}

export type CategoryTotal = {
  category: string
  total: number
} 