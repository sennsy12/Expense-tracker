import { BudgetForm } from "../../components/budget/BudgetForm"
import { BudgetHistory } from "../../components/budget/BudgetHistory"
import { BudgetOverview } from "../../components/budget/BudgetOverview"
import { BudgetProgress } from "../../components/budget/BudgetProgress"
import { BudgetSetup } from "../../components/budget/BudgetSetup"
import { BudgetSwitcher } from "../../components/budget/BudgetSwitcher"
import { useBudget } from "../../hooks/useBudget"

export default function BudgetPage() {
  const { budget, budgets } = useBudget()

  // If no budgets exist, show setup
  if (budgets.length === 0) {
    return (
      <div className="container py-6">
        <BudgetSetup />
      </div>
    )
  }

  // If no budget is selected or budget not found
  if (!budget) {
    return (
      <div className="container py-6">
        <div className="max-w-md mx-auto">
          <BudgetSwitcher />
        </div>
      </div>
    )
  }

  return (
    <div className="container py-6 space-y-6">
      {/* Mobile Layout */}
      <div className="block md:hidden">
        <BudgetSwitcher />
      </div>
      <div className="block md:hidden">
        <BudgetOverview />
      </div>
      <div className="block md:hidden">
        <BudgetForm />
      </div>
      
      {/* Desktop Layout */}
      <div className="hidden md:grid md:grid-cols-[200px,2fr,1fr] gap-6">
        <div>
          <BudgetSwitcher />
        </div>
        <div className="space-y-6">
          <BudgetOverview />
          <BudgetProgress />
          <BudgetHistory />
        </div>
        <div>
          <BudgetForm />
        </div>
      </div>
      
      {/* Mobile Layout (continued) */}
      <div className="block md:hidden space-y-6">
        <BudgetProgress />
        <BudgetHistory />
      </div>
    </div>
  )
} 