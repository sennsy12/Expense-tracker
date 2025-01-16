import { GoalSetup } from "../../components/goal/GoalSetup"
import { GoalList } from "../../components/goal/GoalList"

export default function GoalsPage() {
  return (
    <main className="container mx-auto py-6 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
            Financial Goals
          </h1>
          <p className="text-muted-foreground mt-1">
            Set and track your financial goals
          </p>
        </div>
        <GoalSetup />
        <GoalList />
      </div>
    </main>
  )
}