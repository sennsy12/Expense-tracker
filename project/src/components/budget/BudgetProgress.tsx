import { PieChart, Plus } from "lucide-react"
import { useBudget } from "../../hooks/useBudget"
import { useState, memo } from "react"
import { Budget } from "../../lib/types/budget"

interface CategoryProgressProps {
  category: string
  spent: number
  total: number
  color: string
}

const CategoryProgress = memo(function CategoryProgress({ category, spent, total, color }: CategoryProgressProps) {
  const percentage = (spent / total) * 100
  
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <div className={`h-3 w-3 rounded-full ${color}`} />
          <span className="font-medium">{category}</span>
        </div>
        <div className="text-muted-foreground">
          ${spent.toFixed(2)} / ${total.toFixed(2)}
        </div>
      </div>
      <div className="h-2 rounded-full bg-muted">
        <div
          className={`h-full rounded-full ${color} transition-all`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
    </div>
  )
})


const categoryColors = [
  "bg-blue-500",
  "bg-green-500",
  "bg-purple-500",
  "bg-yellow-500",
  "bg-pink-500",
  "bg-indigo-500",
  "bg-red-500",
  "bg-orange-500"
]

export function BudgetProgress() {
  const { categoryStats, budget, setBudget } = useBudget()
  const [isAddingCategory, setIsAddingCategory] = useState(false)
  const [newCategory, setNewCategory] = useState({ name: "", budgetAmount: "" })

  if (!budget || !categoryStats) {
    return (
      <div className="rounded-lg border bg-card p-6">
        <p className="text-sm text-muted-foreground">
          Please set a monthly budget to view category progress.
        </p>
      </div>
    )
  }

  const handleAddCategory = () => {
    if (!newCategory.name || !newCategory.budgetAmount) return

    const updatedBudget: Budget = {
      ...budget,
      categories: [
        ...budget.categories,
        {
          id: crypto.randomUUID(),
          name: newCategory.name,
          budgetAmount: parseFloat(newCategory.budgetAmount),
          spent: 0
        }
      ]
    }

    setBudget(updatedBudget)
    setNewCategory({ name: "", budgetAmount: "" })
    setIsAddingCategory(false)
  }

  return (
    <div className="rounded-lg border bg-card">
      <div className="flex items-center justify-between border-b p-4">
        <div className="flex items-center gap-2">
          <div className="rounded-md bg-primary/10 p-2">
            <PieChart className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold">Category Progress</h3>
            <p className="text-sm text-muted-foreground">
              Track spending by category
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsAddingCategory(true)}
          className="flex items-center gap-1 rounded-md bg-primary/10 px-2 py-1 text-sm font-medium text-primary hover:bg-primary/20"
        >
          <Plus className="h-4 w-4" />
          Add Category
        </button>
      </div>
      <div className="space-y-4 p-4">
        {isAddingCategory && (
          <div className="flex gap-3 mb-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Category name..."
                value={newCategory.name}
                onChange={(e) => setNewCategory(prev => ({ ...prev, name: e.target.value }))}
                className="w-full h-10 rounded-md border-0 bg-muted px-3 text-base shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                required
              />
            </div>
            <div className="flex-1">
              <input
                type="number"
                min="0"
                step="0.01"
                placeholder="Budget amount..."
                value={newCategory.budgetAmount}
                onChange={(e) => setNewCategory(prev => ({ ...prev, budgetAmount: e.target.value }))}
                className="w-full h-10 rounded-md border-0 bg-muted px-3 text-base shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                required
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleAddCategory}
                className="rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setIsAddingCategory(false)
                  setNewCategory({ name: "", budgetAmount: "" })
                }}
                className="rounded-md bg-destructive/10 px-3 text-sm font-medium text-destructive hover:bg-destructive/20"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
        {categoryStats.map((cat, index) => (
          <CategoryProgress
            key={cat.id}
            category={cat.name}
            spent={cat.spent}
            total={cat.budgetAmount}
            color={categoryColors[index % categoryColors.length]}
          />
        ))}
      </div>
    </div>
  )
} 