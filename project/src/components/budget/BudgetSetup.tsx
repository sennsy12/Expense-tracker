import { Plus, Trash2 } from "lucide-react"
import { useState } from "react"
import { useBudget } from "../../hooks/useBudget"
import { Budget } from "../../lib/types/budget"

export function BudgetSetup() {
  const { setBudget } = useBudget()
  const [totalBudget, setTotalBudget] = useState("")
  const [categories, setCategories] = useState([
    { id: crypto.randomUUID(), name: "", budgetAmount: "" }
  ])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!totalBudget) return

    const budget: Budget = {
      id: crypto.randomUUID(),
      name: "Monthly Budget",
      type: "monthly",
      monthYear: new Date().toISOString().slice(0, 7),
      amount: parseFloat(totalBudget),
      categories: categories.map(cat => ({
        id: cat.id,
        name: cat.name,
        budgetAmount: parseFloat(cat.budgetAmount),
        spent: 0
      })),
      completed: false
    }

    setBudget(budget)
  }

  const addCategory = () => {
    setCategories(prev => [
      ...prev,
      { id: crypto.randomUUID(), name: "", budgetAmount: "" }
    ])
  }

  const removeCategory = (id: string) => {
    setCategories(prev => prev.filter(cat => cat.id !== id))
  }

  const updateCategory = (id: string, field: "name" | "budgetAmount", value: string) => {
    setCategories(prev => prev.map(cat => 
      cat.id === id ? { ...cat, [field]: value } : cat
    ))
  }

  return (
    <div className="rounded-lg border bg-card">
      <div className="flex items-center justify-between border-b p-4">
        <div>
          <h3 className="font-semibold">Set Monthly Budget</h3>
          <p className="text-sm text-muted-foreground">
            Define your total budget and spending categories
          </p>
        </div>
      </div>
      <div className="p-4">
        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Total Budget Input */}
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Total Monthly Budget
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              placeholder="Enter total budget..."
              value={totalBudget}
              onChange={(e) => setTotalBudget(e.target.value)}
              className="mt-1.5 w-full h-10 rounded-md border-0 bg-muted px-3 text-base shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
              required
            />
          </div>

          {/* Categories Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-muted-foreground">
                Budget Categories
              </label>
              <button
                type="button"
                onClick={addCategory}
                className="flex items-center gap-1 rounded-md bg-primary/10 px-2 py-1 text-sm font-medium text-primary hover:bg-primary/20"
              >
                <Plus className="h-4 w-4" />
                Add Category
              </button>
            </div>
            
            {categories.map((category, index) => (
              <div key={category.id} className="flex gap-3">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Category name..."
                    value={category.name}
                    onChange={(e) => updateCategory(category.id, "name", e.target.value)}
                    className="w-full h-10 rounded-md border-0 bg-muted px-3 text-base shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                    required
                  />
                </div>
                <div className="flex-1">
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="Amount..."
                    value={category.budgetAmount}
                    onChange={(e) => updateCategory(category.id, "budgetAmount", e.target.value)}
                    className="w-full h-10 rounded-md border-0 bg-muted px-3 text-base shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                    required
                  />
                </div>
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => removeCategory(category.id)}
                    className="rounded-md bg-destructive/10 p-2 text-destructive hover:bg-destructive/20"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full rounded-md bg-primary px-4 h-10 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Save Budget
          </button>
        </form>
      </div>
    </div>
  )
} 