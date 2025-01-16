import { expenseCategories } from "../lib/types"
import { FilterValues, SortOption } from "../lib/types/filters"
import { cn } from "../lib/utils/utils"
import { ChevronDown, Filter, Search, SortAsc, SortDesc, X } from "lucide-react"
import { useState } from "react"

interface ExpenseFiltersProps {
  filters: FilterValues
  sort: SortOption
  onUpdateFilters: (filters: Partial<FilterValues>) => void
  onUpdateSort: (sort: SortOption) => void
  onReset: () => void
}

export function ExpenseFilters({
  filters,
  sort,
  onUpdateFilters,
  onUpdateSort,
  onReset,
}: ExpenseFiltersProps) {
  const [showFilters, setShowFilters] = useState(false)
  const hasActiveFilters = filters.categories.length > 0 || 
    filters.amountRange.min !== undefined || 
    filters.amountRange.max !== undefined ||
    filters.dateRange.from !== undefined ||
    filters.dateRange.to !== undefined ||
    filters.searchTerm !== ""

  return (
    <div className="space-y-2">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row gap-2">
        {/* Search */}
        <div className="relative flex-1 min-w-0">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            placeholder="Search expenses..."
            value={filters.searchTerm}
            onChange={(e) => onUpdateFilters({ searchTerm: e.target.value })}
            className="h-9 w-full rounded-md border bg-background pl-9 pr-8 text-sm"
          />
          {filters.searchTerm && (
            <button
              onClick={() => onUpdateFilters({ searchTerm: "" })}
              className="absolute right-2 top-1/2 -translate-y-1/2"
            >
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          )}
        </div>

        {/* Sort and Filter Controls */}
        <div className="flex gap-2 w-full sm:w-auto">
          {/* Sort */}
          <div className="flex items-center gap-1.5 text-sm flex-1 sm:flex-initial">
            <select
              value={sort.field}
              onChange={(e) =>
                onUpdateSort({
                  ...sort,
                  field: e.target.value as SortOption["field"],
                })
              }
              className="h-9 w-full sm:w-auto rounded-md border bg-background px-2 text-sm"
            >
              <option value="date">Date</option>
              <option value="amount">Amount</option>
              <option value="category">Category</option>
            </select>
            <button
              onClick={() =>
                onUpdateSort({
                  ...sort,
                  direction: sort.direction === "asc" ? "desc" : "asc",
                })
              }
              className="h-9 w-9 rounded-md border bg-background flex items-center justify-center hover:bg-accent"
            >
              {sort.direction === "asc" ? (
                <SortAsc className="h-4 w-4" />
              ) : (
                <SortDesc className="h-4 w-4" />
              )}
            </button>
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              "h-9 rounded-md border px-3 flex items-center gap-1.5 hover:bg-accent flex-1 sm:flex-initial justify-center sm:justify-start",
              hasActiveFilters && "border-primary text-primary"
            )}
          >
            <Filter className="h-4 w-4" />
            <span className="text-sm">Filter</span>
            <ChevronDown className={cn(
              "h-4 w-4 transition-transform",
              showFilters && "rotate-180"
            )} />
          </button>
        </div>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="rounded-md border bg-background p-3 sm:p-4">
          {/* Categories */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Categories</label>
            <div className="flex flex-wrap gap-1.5">
              {expenseCategories.map((category) => (
                <button
                  key={category}
                  onClick={() =>
                    onUpdateFilters({
                      categories: filters.categories.includes(category)
                        ? filters.categories.filter((c) => c !== category)
                        : [...filters.categories, category],
                    })
                  }
                  className={cn(
                    "rounded-full px-2.5 py-1 text-xs transition-colors",
                    filters.categories.includes(category)
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  )}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 mt-4">
            {/* Amount Range */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Amount Range</label>
              <div className="flex gap-2">
                <div className="flex-1">
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="Min"
                    value={filters.amountRange.min || ""}
                    onChange={(e) =>
                      onUpdateFilters({
                        amountRange: {
                          ...filters.amountRange,
                          min: e.target.value ? Number(e.target.value) : undefined,
                        },
                      })
                    }
                    className="h-9 w-full rounded-md border bg-background px-3 text-sm"
                  />
                </div>
                <div className="flex-1">
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="Max"
                    value={filters.amountRange.max || ""}
                    onChange={(e) =>
                      onUpdateFilters({
                        amountRange: {
                          ...filters.amountRange,
                          max: e.target.value ? Number(e.target.value) : undefined,
                        },
                      })
                    }
                    className="h-9 w-full rounded-md border bg-background px-3 text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Date Range */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Date Range</label>
              <div className="flex gap-2">
                <div className="flex-1">
                  <input
                    type="date"
                    value={filters.dateRange.from?.toISOString().split("T")[0] || ""}
                    onChange={(e) =>
                      onUpdateFilters({
                        dateRange: {
                          ...filters.dateRange,
                          from: e.target.value ? new Date(e.target.value) : undefined,
                        },
                      })
                    }
                    className="h-9 w-full rounded-md border bg-background px-3 text-sm"
                  />
                </div>
                <div className="flex-1">
                  <input
                    type="date"
                    value={filters.dateRange.to?.toISOString().split("T")[0] || ""}
                    onChange={(e) =>
                      onUpdateFilters({
                        dateRange: {
                          ...filters.dateRange,
                          to: e.target.value ? new Date(e.target.value) : undefined,
                        },
                      })
                    }
                    className="h-9 w-full rounded-md border bg-background px-3 text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Reset Button */}
          {hasActiveFilters && (
            <button
              onClick={onReset}
              className="mt-4 w-full sm:w-auto h-9 rounded-md border border-destructive bg-destructive/10 px-3 text-sm font-medium text-destructive hover:bg-destructive/20"
            >
              Reset Filters
            </button>
          )}
        </div>
      )}
    </div>
  )
} 