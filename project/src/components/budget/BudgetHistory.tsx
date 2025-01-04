import { History } from "lucide-react"
import { useBudget } from "../../hooks/useBudget"
import { format } from "date-fns"

export function BudgetHistory() {
  const { expenses, budget } = useBudget()

  if (!budget || !expenses) {
    return (
      <div className="rounded-lg border bg-card p-6">
        <p className="text-sm text-muted-foreground">
          Please set a monthly budget to view expense history.
        </p>
      </div>
    )
  }

  // Sort expenses by date (most recent first)
  const sortedExpenses = [...expenses].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  // Get category name by id
  const getCategoryName = (categoryId: string) => {
    const category = budget.categories.find(cat => cat.id === categoryId)
    return category?.name || "Unknown"
  }

  return (
    <div className="rounded-lg border bg-card">
      <div className="flex items-center gap-2 border-b p-4">
        <div className="rounded-md bg-primary/10 p-2">
          <History className="h-4 w-4 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold">Recent Transactions</h3>
          <p className="text-sm text-muted-foreground">
            Your latest expenses
          </p>
        </div>
      </div>
      <div className="p-4">
        <div className="rounded-md border">
          <div className="grid grid-cols-[1fr,1fr,auto] md:grid-cols-[1fr,2fr,1fr,auto] gap-4 p-4 border-b font-medium">
            <div>Date</div>
            <div className="hidden md:block">Description</div>
            <div>Category</div>
            <div>Amount</div>
          </div>
          {sortedExpenses.length === 0 ? (
            <div className="p-4 text-sm text-muted-foreground text-center">
              No expenses recorded yet.
            </div>
          ) : (
            sortedExpenses.map((expense) => (
              <div
                key={expense.id}
                className="grid grid-cols-[1fr,1fr,auto] md:grid-cols-[1fr,2fr,1fr,auto] gap-4 p-4 border-b last:border-0 items-center hover:bg-muted/50"
              >
                <div className="text-sm">
                  {format(new Date(expense.date), "MMM d, yyyy")}
                </div>
                <div className="hidden md:block text-sm text-muted-foreground">
                  {expense.description || "No description"}
                </div>
                <div className="text-sm">{getCategoryName(expense.categoryId)}</div>
                <div className="text-sm font-medium">
                  ${expense.amount.toFixed(2)}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
} 