import { useState } from "react"
import { CalendarIcon, X } from "lucide-react"
import { cn } from "../../lib/utils/utils"
import { useGoalStore } from "../../hooks/useGoalStore"
import { Goal } from "../../lib/types/goal"

interface GoalEditModalProps {
  isOpen: boolean
  onClose: () => void
  goal: Goal | null
}

export function GoalEditModal({ isOpen, onClose, goal }: GoalEditModalProps) {
  const updateGoal = useGoalStore((state) => state.updateGoal)
  const [formData, setFormData] = useState({
    name: goal?.name || "",
    targetAmount: goal?.targetAmount?.toString() || "",
    currentAmount: goal?.currentAmount?.toString() || "",
    startDate: goal ? new Date(goal.startDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    endDate: goal ? new Date(goal.endDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
  })

  if (!isOpen || !goal) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updateGoal({
      ...goal,
      name: formData.name,
      targetAmount: parseFloat(formData.targetAmount),
      currentAmount: parseFloat(formData.currentAmount),
      startDate: formData.startDate,
      endDate: formData.endDate,
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-background rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Edit Goal</h2>
          <button onClick={onClose} className="rounded-md p-1 text-muted-foreground hover:bg-muted/20">
            <X className="h-4 w-4" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Goal Name Input */}
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Goal Name
            </label>
            <input
              type="text"
              placeholder="Enter goal name..."
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="mt-1.5 w-full h-10 rounded-md border-0 bg-muted px-3 text-base shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
              required
            />
          </div>

          {/* Target Amount Input */}
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Target Amount
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              placeholder="Enter target amount..."
              value={formData.targetAmount}
              onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
              className="mt-1.5 w-full h-10 rounded-md border-0 bg-muted px-3 text-base shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
              required
            />
          </div>

          {/* Current Amount Input */}
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Current Amount
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              placeholder="Enter current amount..."
              value={formData.currentAmount}
              onChange={(e) => setFormData({ ...formData, currentAmount: e.target.value })}
              className="mt-1.5 w-full h-10 rounded-md border-0 bg-muted px-3 text-base shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
              required
            />
          </div>

          {/* Start Date Input */}
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Start Date
            </label>
            <div className="relative">
              <CalendarIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className={cn(
                  "w-full h-9 rounded-md border-0 bg-muted pl-9 pr-3 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                )}
                required
              />
            </div>
          </div>

          {/* End Date Input */}
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              End Date
            </label>
            <div className="relative">
              <CalendarIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className={cn(
                  "w-full h-9 rounded-md border-0 bg-muted pl-9 pr-3 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                )}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full h-10 rounded-md bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
          >
            Update Goal
          </button>
        </form>
      </div>
    </div>
  )
}