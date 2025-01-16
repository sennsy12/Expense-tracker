import { useState } from "react"
import { ExpenseWithId, expenseCategories } from "../lib/types"
import { toast } from "sonner"
import { useExpenseStore } from "../lib/store"
import { CalendarIcon } from "lucide-react"
import { cn } from "../lib/utils/utils"

interface ExpenseEditModalProps {
  expense: ExpenseWithId
  isOpen: boolean
  onClose: () => void
}

export function ExpenseEditModal({ expense, isOpen, onClose }: ExpenseEditModalProps) {
  const updateExpense = useExpenseStore((state) => state.updateExpense)
  const [formData, setFormData] = useState({
    date: new Date(expense.date).toISOString().split('T')[0],
    category: expense.category,
    description: expense.description,
    amount: expense.amount,
  })

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updateExpense({
      ...formData,
      id: expense.id,
      category: formData.category as typeof expenseCategories[number],
    })
    toast.success("Expense updated successfully")
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-background rounded-lg p-6 w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4">Edit Expense</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">
              Date
            </label>
            <div className="relative">
              <CalendarIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className={cn(
                  "w-full h-9 rounded-md border-0 bg-muted pl-9 pr-3 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                )}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value as typeof expenseCategories[number] })}
              className="w-full h-9 rounded-md border-0 bg-muted px-3 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
              required
            >
              {expenseCategories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">
              Description
            </label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full h-9 rounded-md border-0 bg-muted px-3 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">
              Amount
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
              className="w-full h-9 rounded-md border-0 bg-muted px-3 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
              required
            />
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-md bg-muted text-muted-foreground hover:bg-muted/80 text-sm font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 text-sm font-medium"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 