import { useState } from "react"
import { useBudget } from "../../hooks/useBudget"

export function BudgetForm() {
  const { addExpense, budget } = useBudget()
  const [formData, setFormData] = useState({
    amount: "",
    categoryId: "",
    description: "",
    date: new Date().toISOString().split('T')[0]
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.amount || !formData.categoryId) return

    addExpense({
      amount: parseFloat(formData.amount),
      categoryId: formData.categoryId,
      description: formData.description,
      date: formData.date
    })

    // Reset form
    setFormData({
      amount: "",
      categoryId: "",
      description: "",
      date: new Date().toISOString().split('T')[0]
    })
  }

  if (!budget) {
    return (
      <div className="rounded-lg border bg-card p-6">
        <p className="text-sm text-muted-foreground">
          Please set a monthly budget to start tracking expenses.
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-lg border bg-card">
      <div className="flex items-center justify-between border-b p-4">
        <div>
          <h3 className="font-semibold">Add Expense</h3>
          <p className="text-sm text-muted-foreground">
            Record your expenses to track your budget
          </p>
        </div>
      </div>
      <div className="p-4">
        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Amount Input */}
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Amount
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              placeholder="Enter amount..."
              value={formData.amount}
              onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
              className="mt-1.5 w-full h-10 rounded-md border-0 bg-muted px-3 text-base shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
              required
            />
          </div>

          {/* Category Select */}
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Category
            </label>
            <select
              value={formData.categoryId}
              onChange={(e) => setFormData(prev => ({ ...prev, categoryId: e.target.value }))}
              className="mt-1.5 w-full h-10 rounded-md border-0 bg-muted px-3 text-base shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
              required
            >
              <option value="">Select category...</option>
              {budget.categories.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Description Input */}
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Description
            </label>
            <input
              type="text"
              placeholder="Enter description..."
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="mt-1.5 w-full h-10 rounded-md border-0 bg-muted px-3 text-base shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
            />
          </div>

          {/* Date Input */}
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Date
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
              className="mt-1.5 w-full h-10 rounded-md border-0 bg-muted px-3 text-base shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full rounded-md bg-primary px-4 h-10 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Save Expense
          </button>
        </form>
      </div>
    </div>
  )
} 