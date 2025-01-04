import React from "react"
import { DollarSign, Target } from "lucide-react"
import { useBudget } from "../../hooks/useBudget"

interface OverviewCardProps {
  title: string
  amount: string
  description: string
  icon: React.ReactNode
}

function OverviewCard({ title, amount, description, icon }: OverviewCardProps) {
  return (
    <div className="rounded-lg border bg-card p-6">
      <div className="flex items-center gap-2">
        <div className="rounded-md bg-primary/10 p-2">
          {icon}
        </div>
        <h3 className="font-medium">{title}</h3>
      </div>
      <div className="mt-3">
        <p className="text-2xl font-bold">{amount}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  )
}

export function BudgetOverview() {
  const { stats } = useBudget()

  if (!stats) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <OverviewCard
          title="Monthly Budget"
          amount="$0.00"
          description="Set your monthly budget to get started"
          icon={<Target className="h-4 w-4 text-primary" />}
        />
      </div>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <OverviewCard
        title="Monthly Budget"
        amount={`$${stats.totalBudget.toFixed(2)}`}
        description="Total budget for this month"
        icon={<Target className="h-4 w-4 text-primary" />}
      />
      <OverviewCard
        title="Spent"
        amount={`$${stats.totalSpent.toFixed(2)}`}
        description={`${stats.spentPercentage.toFixed(2)}% of budget used`}
        icon={<DollarSign className="h-4 w-4 text-primary" />}
      />
      <OverviewCard
        title="Remaining"
        amount={`$${stats.remaining.toFixed(2)}`}
        description={`${(100 - stats.spentPercentage).toFixed(2)}% of budget remaining`}
        icon={<DollarSign className="h-4 w-4 text-primary" />}
      />
    </div>
  )
} 