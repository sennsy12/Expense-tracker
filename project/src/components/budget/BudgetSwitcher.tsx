import { Plus, Home, Plane, Briefcase, PiggyBank, MoreHorizontal, Trash2, CheckCircle2 } from "lucide-react"
import { useBudget } from "../../hooks/useBudget"
import { useState } from "react"
import { Budget, BudgetType } from "../../lib/types/budget"

const budgetTypeIcons: Record<BudgetType, React.ReactNode> = {
  monthly: <Briefcase className="h-4 w-4" />,
  vacation: <Plane className="h-4 w-4" />,
  home: <Home className="h-4 w-4" />,
  project: <Briefcase className="h-4 w-4" />,
  savings: <PiggyBank className="h-4 w-4" />,
  custom: <MoreHorizontal className="h-4 w-4" />
}

export function BudgetSwitcher() {
  const { budgets, activeBudgetId, setActiveBudgetId, setBudget, deleteBudget } = useBudget()
  const [isCreating, setIsCreating] = useState(false)
  const [newBudget, setNewBudget] = useState({
    name: "",
    type: "monthly" as BudgetType,
    amount: ""
  })

  const handleCreateBudget = () => {
    if (!newBudget.name || !newBudget.amount) return

    const budget: Budget = {
      id: crypto.randomUUID(),
      name: newBudget.name,
      type: newBudget.type,
      monthYear: new Date().toISOString().slice(0, 7),
      amount: parseFloat(newBudget.amount),
      categories: [
        {
          id: crypto.randomUUID(),
          name: "General",
          budgetAmount: parseFloat(newBudget.amount),
          spent: 0
        }
      ],
      completed: false
    }

    setBudget(budget)
    setIsCreating(false)
    setNewBudget({
      name: "",
      type: "monthly",
      amount: ""
    })
  }

  const toggleComplete = (budget: Budget) => {
    setBudget({
      ...budget,
      completed: !budget.completed
    })
  }

  return (
    <div className="rounded-lg border bg-card">
      <div className="p-2">
        <div className="space-y-2">
          {budgets.map((budget) => (
            <div
              key={budget.id}
              className={`w-full flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-muted/50 group ${
                budget.id === activeBudgetId ? "bg-muted" : ""
              }`}
            >
              <button
                onClick={() => setActiveBudgetId(budget.id)}
                className="flex-1 flex items-center gap-2"
              >
                {budgetTypeIcons[budget.type]}
                <span className={`font-medium ${budget.completed ? "line-through text-muted-foreground" : ""}`}>
                  {budget.name}
                </span>
              </button>
              <div className="flex items-center gap-1 md:opacity-0 md:group-hover:opacity-100">
                <button
                  onClick={() => toggleComplete(budget)}
                  className="p-1 hover:bg-muted rounded-sm"
                >
                  <CheckCircle2 className={`h-4 w-4 ${budget.completed ? "text-primary" : "text-muted-foreground"}`} />
                </button>
                <button
                  onClick={() => {
                    if (confirm('Are you sure you want to delete this budget?')) {
                      deleteBudget(budget.id)
                    }
                  }}
                  className="p-1 hover:bg-destructive/10 rounded-sm"
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {isCreating ? (
          <div className="mt-2 space-y-2 border-t pt-2">
            <input
              type="text"
              placeholder="Budget name..."
              value={newBudget.name}
              onChange={(e) => setNewBudget(prev => ({ ...prev, name: e.target.value }))}
              className="w-full h-9 rounded-md border-0 bg-muted px-3 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
            />
            <select
              value={newBudget.type}
              onChange={(e) => setNewBudget(prev => ({ ...prev, type: e.target.value as BudgetType }))}
              className="w-full h-9 rounded-md border-0 bg-muted px-3 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
            >
              <option value="monthly">Monthly Budget</option>
              <option value="vacation">Vacation Budget</option>
              <option value="home">Home Budget</option>
              <option value="project">Project Budget</option>
              <option value="savings">Savings Budget</option>
              <option value="custom">Custom Budget</option>
            </select>
            <input
              type="number"
              min="0"
              step="0.01"
              placeholder="Initial amount..."
              value={newBudget.amount}
              onChange={(e) => setNewBudget(prev => ({ ...prev, amount: e.target.value }))}
              className="w-full h-9 rounded-md border-0 bg-muted px-3 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
            />
            <div className="flex gap-2">
              <button
                onClick={handleCreateBudget}
                className="flex-1 rounded-md bg-primary px-3 h-9 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                Create
              </button>
              <button
                onClick={() => {
                  setIsCreating(false)
                  setNewBudget({ name: "", type: "monthly", amount: "" })
                }}
                className="flex-1 rounded-md bg-muted px-3 h-9 text-sm font-medium hover:bg-muted/80"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setIsCreating(true)}
            className="mt-2 w-full flex items-center gap-2 rounded-md border border-dashed border-muted-foreground/50 px-3 py-2 text-sm hover:bg-muted/50"
          >
            <Plus className="h-4 w-4" />
            <span>New Budget</span>
          </button>
        )}
      </div>
    </div>
  )
} 