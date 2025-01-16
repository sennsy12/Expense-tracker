import { useState } from "react"
import { formatCurrency } from "../../lib/utils/utils"
import { useGoalStore } from "../../hooks/useGoalStore"
import { CheckCircle, Circle, Edit, Trash2, Target } from "lucide-react"
import { Goal } from "../../lib/types/goal"
import { GoalEditModal } from "./GoalEditModal"

export function GoalList() {
  const goals = useGoalStore((state) => state.goals)
  const removeGoal = useGoalStore((state) => state.removeGoal)
  const updateGoal = useGoalStore((state) => state.updateGoal)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null)

  const toggleComplete = (goal: Goal) => {
    updateGoal({
      ...goal,
      completed: !goal.completed
    })
  }

  const handleEdit = (goal: Goal) => {
    setSelectedGoal(goal)
    setEditModalOpen(true)
  }

  return (
    <div className="rounded-lg border bg-card">
      <div className="flex items-center justify-between border-b p-4">
        <div className="flex items-center gap-2">
          <div className="rounded-md bg-primary/10 p-2">
            <Target className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold">Your Goals</h3>
            <p className="text-sm text-muted-foreground">
              Track your progress
            </p>
          </div>
        </div>
      </div>
      <div className="p-4 space-y-4">
        {goals.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No goals set yet. Add a new goal to get started.
          </p>
        ) : (
          goals.map((goal) => (
            <div key={goal.id} className="flex items-center justify-between rounded-md border bg-muted p-3">
              <div className="flex items-center gap-3">
                <button onClick={() => toggleComplete(goal)}>
                  {goal.completed ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <Circle className="h-5 w-5 text-muted-foreground" />
                  )}
                </button>
                <div>
                  <p className="font-medium">{goal.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatCurrency(goal.currentAmount)} / {formatCurrency(goal.targetAmount)}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(goal)}
                  className="rounded-md bg-muted/50 p-2 text-muted-foreground hover:bg-muted/80"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => removeGoal(goal.id)}
                  className="rounded-md bg-destructive/10 p-2 text-destructive hover:bg-destructive/20"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
      <GoalEditModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        goal={selectedGoal}
      />
    </div>
  )
}