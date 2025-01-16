import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Goal } from '../lib/types/goal'
import { v4 as uuidv4 } from 'uuid'

interface GoalStore {
  goals: Goal[]
  addGoal: (goal: Omit<Goal, 'id'>) => void
  removeGoal: (id: string) => void
  updateGoal: (goal: Goal) => void
}

export const useGoalStore = create<GoalStore>()(
  persist(
    (set) => ({
      goals: [],
      addGoal: (goal) =>
        set((state) => ({
          goals: [...state.goals, { ...goal, id: uuidv4(), currentAmount: 0, completed: false }],
        })),
      removeGoal: (id) =>
        set((state) => ({
          goals: state.goals.filter((goal) => goal.id !== id),
        })),
      updateGoal: (updatedGoal) =>
        set((state) => ({
          goals: state.goals.map((goal) =>
            goal.id === updatedGoal.id ? updatedGoal : goal
          ),
        })),
    }),
    {
      name: 'goal-storage',
    }
  )
)