import { useState, useMemo } from "react"
import { CalendarIcon, Coins, Trash2 } from "lucide-react"
import { cn, formatCurrency } from "../../lib/utils/utils"
import { useNetWorthStore } from "../../hooks/useNetWorthStore"
import { toast } from "sonner"

export function NetWorthInputForm() {
  const addNetWorthEntry = useNetWorthStore((state) => state.addNetWorthEntry)
  const netWorthEntries = useNetWorthStore((state) => state.netWorthEntries)
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [changes, setChanges] = useState<{ type: "asset" | "liability", name: string, value: number, action: "add" | "subtract" }[]>([])

  const currentNetWorth = useMemo(() => {
    // Sort all entries by date, most recent first
    const sortedEntries = [...netWorthEntries].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    )
    
    // Get the latest entry
    const latestEntry = sortedEntries[0]
    return latestEntry ? latestEntry.netWorth : 0
  }, [netWorthEntries])

  const projectedNetWorth = useMemo(() => {
    let totalChange = 0
    changes.forEach(change => {
      const changeAmount = change.action === "add" ? change.value : -change.value
      totalChange += change.type === "asset" ? changeAmount : -changeAmount
    })
    return currentNetWorth + totalChange
  }, [changes, currentNetWorth])

  const resetForm = () => {
    setDate(new Date().toISOString().split('T')[0])
    setChanges([])
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Check if an entry already exists for this date
    const existingEntry = netWorthEntries.find(entry => entry.date === date)
    if (existingEntry) {
      toast.error(
        "Entry already exists for this date",
        {
          description: "Please edit the existing entry in the history section below if you want to make changes.",
          duration: 5000
        }
      )
      return
    }

    // Get the latest entry regardless of date
    const previousEntry = netWorthEntries
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0] || {
      assets: [],
      liabilities: [],
      totalAssets: 0,
      totalLiabilities: 0,
      netWorth: 0
    }

    const newAssets = [...previousEntry.assets]
    const newLiabilities = [...previousEntry.liabilities]

    changes.forEach(change => {
      if (change.type === "asset") {
        const existingAsset = newAssets.find(a => a.name === change.name)
        if (existingAsset) {
          existingAsset.value += change.action === "add" ? change.value : -change.value
        } else if (change.action === "add") {
          newAssets.push({ id: crypto.randomUUID(), name: change.name, value: change.value })
        }
      } else {
        const existingLiability = newLiabilities.find(l => l.name === change.name)
        if (existingLiability) {
          existingLiability.value += change.action === "add" ? change.value : -change.value
        } else if (change.action === "add") {
          newLiabilities.push({ id: crypto.randomUUID(), name: change.name, value: change.value })
        }
      }
    })

    const filteredAssets = newAssets.filter(asset => asset.value > 0)
    const filteredLiabilities = newLiabilities.filter(liability => liability.value > 0)

    const totalAssets = filteredAssets.reduce((sum, asset) => sum + asset.value, 0)
    const totalLiabilities = filteredLiabilities.reduce((sum, liability) => sum + liability.value, 0)

    addNetWorthEntry({
      date,
      assets: filteredAssets,
      liabilities: filteredLiabilities,
      totalAssets,
      totalLiabilities,
      netWorth: totalAssets - totalLiabilities,
    })

    resetForm()
  }

  const addChange = (type: "asset" | "liability") => {
    setChanges([...changes, { type, name: "", value: 0, action: "add" }])
  }

  const removeChange = (index: number) => {
    setChanges(changes.filter((_, i) => i !== index))
  }

  const updateChange = (index: number, field: "name" | "value" | "action" | "type", value: string) => {
    const newChanges = [...changes]
    if (field === "value") {
      newChanges[index][field] = parseFloat(value) || 0
    } else {
      newChanges[index][field] = value as never
    }
    setChanges(newChanges)
  }

  return (
    <div className="rounded-xl sm:rounded-2xl border bg-gradient-to-b from-card to-card/50 shadow-xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b p-3 sm:p-6 bg-gradient-to-r from-primary/5 to-transparent">
        <div className="flex items-center gap-3">
          <div className="rounded-xl sm:rounded-2xl bg-primary/10 p-2 sm:p-3 ring-1 ring-primary/20">
            <Coins className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
          </div>
          <div>
            <h3 className="text-base sm:text-xl font-bold tracking-tight">Record Net Worth</h3>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">Track your financial growth over time</p>
          </div>
        </div>
        <div className="mt-3 sm:mt-0 p-2.5 sm:p-3 rounded-lg bg-card/50 backdrop-blur border shadow-sm">
          <p className="text-xs font-medium text-muted-foreground">Current Net Worth</p>
          <p className="text-xl sm:text-2xl font-bold tracking-tight text-primary mt-0.5">{formatCurrency(currentNetWorth)}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-3 sm:p-6 space-y-3 sm:space-y-6">
        <div>
          <label className="text-xs sm:text-sm font-semibold text-foreground/70">Date</label>
          <div className="relative mt-1.5" onClick={() => (document.getElementById('date-input') as HTMLInputElement)?.showPicker()}>
            <CalendarIcon className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <input
              id="date-input"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className={cn(
                "w-full h-8 sm:h-9 rounded-md border-0 bg-muted/50 pl-8 pr-2.5 text-sm shadow-sm ring-1 ring-border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer"
              )}
              required
            />
          </div>
        </div>

        <div className="space-y-2 sm:space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold">Changes</h4>
            {changes.length > 0 && (
              <div className="text-xs px-2.5 py-1 sm:py-1.5 rounded-md bg-card/50 backdrop-blur border shadow-sm">
                <span className="text-muted-foreground">Projected: </span>
                <span className={cn(
                  "font-semibold",
                  projectedNetWorth > currentNetWorth ? "text-emerald-500" : 
                  projectedNetWorth < currentNetWorth ? "text-red-500" : ""
                )}>
                  {formatCurrency(projectedNetWorth)}
                </span>
              </div>
            )}
          </div>
          <div className="space-y-2">
            {changes.map((change, index) => (
              <div key={index} className="group flex flex-col gap-2 p-2.5 sm:p-3 rounded-md bg-card/50 backdrop-blur border shadow-sm transition-all hover:shadow-md hover:border-primary/20">
                <div className="flex gap-2">
                  <select
                    value={change.action}
                    onChange={(e) => updateChange(index, "action", e.target.value)}
                    className="w-1/2 h-8 sm:h-9 rounded-md border-0 bg-muted/50 px-2 text-sm"
                  >
                    <option value="add">Add</option>
                    <option value="subtract">Subtract</option>
                  </select>
                  <select
                    value={change.type}
                    onChange={(e) => updateChange(index, "type", e.target.value)}
                    className="w-1/2 h-8 sm:h-9 rounded-md border-0 bg-muted/50 px-2 text-sm"
                  >
                    <option value="asset">Asset</option>
                    <option value="liability">Liability</option>
                  </select>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Name"
                    value={change.name}
                    onChange={(e) => updateChange(index, "name", e.target.value)}
                    className="flex-1 h-8 sm:h-9 rounded-md border-0 bg-muted/50 px-2 text-sm"
                    required
                  />
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Value"
                      value={change.value || ""}
                      onChange={(e) => updateChange(index, "value", e.target.value)}
                      className="w-20 sm:w-28 h-8 sm:h-9 rounded-md border-0 bg-muted/50 px-2 text-sm"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => removeChange(index)}
                      className="h-8 sm:h-9 aspect-square rounded-md text-destructive hover:bg-destructive/10 flex items-center justify-center"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addChange("asset")}
              className="w-full py-1.5 sm:py-2 rounded-md border border-dashed border-primary/20 text-xs text-primary hover:bg-primary/5 hover:border-primary/30 transition-colors"
            >
              + Add Change
            </button>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={resetForm}
            className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-md border bg-card hover:bg-muted/50 text-xs font-medium transition-colors"
          >
            Reset
          </button>
          <button
            type="submit"
            className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-medium transition-colors"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  )
}