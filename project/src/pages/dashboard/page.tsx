import { ExpenseForm } from "../../components/ExpenseForm"
import { ExpenseList } from "../../components/ExpenseList"
import { ExpenseSummary } from "../../components/ExpenseSummary"
import { useExpenseStore } from "../../lib/store"
import { toast } from "sonner"
import { useState } from "react"
import { ResetConfirmModal } from "../../components/ResetConfirmModal"

export default function DashboardPage() {
  const clearExpenses = useExpenseStore((state) => state.clearExpenses)
  const [showResetModal, setShowResetModal] = useState(false)

  const handleReset = () => {
    clearExpenses()
    toast.success("All expenses cleared")
    setShowResetModal(false)
  }

  return (
    <main className="container max-w-screen-xl mx-auto py-4 px-3 sm:py-6 sm:px-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground md:text-3xl">
            Expense Tracker
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Track and visualize your expenses
          </p>
        </div>
        <button
          onClick={() => setShowResetModal(true)}
          className="w-full sm:w-auto px-4 py-2 rounded-md bg-destructive text-destructive-foreground hover:bg-destructive/90 text-sm font-medium"
        >
          Reset All
        </button>
      </div>

      {/* Mobile: Form on top */}
      <div className="mt-4 md:hidden">
        <div className="rounded-lg border p-3">
          <h2 className="text-lg font-semibold mb-4">Add New Expense</h2>
          <ExpenseForm />
        </div>
      </div>

      {/* Desktop: Side-by-side layout */}
      <div className="mt-4 sm:mt-6 grid gap-4 sm:gap-6 md:grid-cols-[1fr_350px]">
        <div className="space-y-4 sm:space-y-6 min-w-0">
          <ExpenseSummary />
          <ExpenseList />
        </div>
        
        {/* Desktop: Form on side */}
        <div className="hidden md:block">
          <div className="rounded-lg border p-4 sticky top-6">
            <h2 className="text-lg font-semibold mb-4">Add New Expense</h2>
            <ExpenseForm />
          </div>
        </div>
      </div>

      <ResetConfirmModal 
        isOpen={showResetModal}
        onClose={() => setShowResetModal(false)}
        onConfirm={handleReset}
      />
    </main>
  )
} 