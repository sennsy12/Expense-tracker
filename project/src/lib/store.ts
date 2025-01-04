import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { ExpenseWithId } from './types'
import { v4 as uuidv4 } from 'uuid'

interface ExpenseStore {
  expenses: ExpenseWithId[]
  addExpense: (expense: Omit<ExpenseWithId, 'id'>) => void
  removeExpense: (id: string) => void
  clearExpenses: () => void
}

export const useExpenseStore = create<ExpenseStore>()(
  persist(
    (set) => ({
      expenses: [],
      addExpense: (expense) =>
        set((state) => ({
          expenses: [...state.expenses, { ...expense, id: uuidv4() }],
        })),
      removeExpense: (id) =>
        set((state) => ({
          expenses: state.expenses.filter((expense) => expense.id !== id),
        })),
      clearExpenses: () => set({ expenses: [] }),
    }),
    {
      name: 'expense-storage',
    }
  )
) 