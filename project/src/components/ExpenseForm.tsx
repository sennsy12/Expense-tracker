import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ExpenseSchema, expenseCategories, type Expense } from "../lib/types"
import { useExpenseStore } from "../lib/store"
import { cn } from "../lib/utils/utils"
import { CalendarIcon, DollarSign } from "lucide-react"

export function ExpenseForm() {
  const addExpense = useExpenseStore((state) => state.addExpense)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Expense>({
    resolver: zodResolver(ExpenseSchema),
    defaultValues: {
      category: "Other",
      amount: undefined,
      date: new Date().toISOString().split('T')[0],
      description: "",
    },
  })

  const onSubmit = handleSubmit((data) => {
    const date = new Date(data.date)
    if (isNaN(date.getTime())) {
      return
    }
    
    addExpense({
      ...data,
      amount: Number(data.amount),
      date: data.date,
    })
    reset()
  })

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Category</label>
          <select
            {...register("category")}
            className={cn(
              "w-full h-9 rounded-md border-0 bg-muted px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary",
              errors.category && "border-red-500"
            )}
          >
            {expenseCategories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="text-xs text-red-500">{errors.category.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Amount</label>
          <div className="relative">
            <DollarSign className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="number"
              step="0.01"
              min="0"
              onKeyDown={(e) => {
                const invalidChars = ['-', '+', 'e', 'E']
                if (invalidChars.includes(e.key)) {
                  e.preventDefault()
                }
              }}
              {...register("amount", { valueAsNumber: true })}
              className={cn(
                "w-full h-9 rounded-md border-0 bg-muted pl-8 pr-3 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary",
                errors.amount && "border-red-500"
              )}
              placeholder="0.00"
            />
          </div>
          {errors.amount && (
            <p className="text-xs text-red-500">{errors.amount.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Date</label>
          <div className="relative">
            <CalendarIcon className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="date"
              {...register("date")}
              className={cn(
                "w-full h-9 rounded-md border-0 bg-muted pl-8 pr-3 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary",
                errors.date && "border-red-500"
              )}
            />
          </div>
          {errors.date && (
            <p className="text-xs text-red-500">{errors.date.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Description</label>
          <input
            type="text"
            {...register("description")}
            className={cn(
              "w-full h-9 rounded-md border-0 bg-muted px-3 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary",
              errors.description && "border-red-500"
            )}
            placeholder="Enter description..."
          />
          {errors.description && (
            <p className="text-xs text-red-500">{errors.description.message}</p>
          )}
        </div>
      </div>

      <button
        type="submit"
        className="w-full h-9 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
      >
        Add Expense
      </button>
    </form>
  )
} 