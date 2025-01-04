import { ExpenseForm } from "../../components/ExpenseForm"
import { ExpenseList } from "../../components/ExpenseList"
import { ExpenseSummary } from "../../components/ExpenseSummary"

export default function DashboardPage() {
  return (
    <main className="container mx-auto py-6 px-4 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
          Expense Tracker
        </h1>
        <p className="text-muted-foreground mt-1">
          Track and visualize your expenses
        </p>
      </div>

      {/* Mobile: Form on top */}
      <div className="md:hidden">
        <div className="rounded-lg border p-4">
          <h2 className="text-lg font-semibold mb-4">Add New Expense</h2>
          <ExpenseForm />
        </div>
      </div>

      {/* Desktop: Side-by-side layout */}
      <div className="grid gap-6 md:grid-cols-[1fr_400px]">
        <div className="space-y-6">
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
    </main>
  )
} 