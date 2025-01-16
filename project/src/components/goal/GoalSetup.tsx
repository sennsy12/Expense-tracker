import { useState } from "react"
import { CalendarIcon, Target } from "lucide-react"
import { cn } from "../../lib/utils/utils"
import { useGoalStore } from "../../hooks/useGoalStore"

export function GoalSetup() {
  const addGoal = useGoalStore((state) => state.addGoal)
  const [formData, setFormData] = useState({
    name: "",
    targetAmount: "",
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.targetAmount) return

    addGoal({
      name: formData.name,
      targetAmount: parseFloat(formData.targetAmount),
      currentAmount: 0,
      startDate: formData.startDate,
      endDate: formData.endDate,
      completed: false
    })

    // Reset form
    setFormData({
      name: "",
      targetAmount: "",
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0],
    })
  }

  return (
    <div className="rounded-lg border bg-card">
      <div className="flex items-center justify-between border-b p-4">
        <div className="flex items-center gap-2">
          <div className="rounded-md bg-primary/10 p-2">
            <Target className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold">Set a New Goal</h3>
            <p className="text-sm text-muted-foreground">
              Define your financial goals
            </p>
          </div>
        </div>
      </div>
      <div className="p-4">
        <form className="space-y-4" onSubmit={handleSubmit}>
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
            Add Goal
          </button>
        </form>
      </div>
    </div>
  )
}