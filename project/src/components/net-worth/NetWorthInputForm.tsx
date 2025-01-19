import { useState, useMemo } from "react"
import { CalendarIcon, Coins, Plus, ArrowUp, ArrowDown } from "lucide-react"
import { cn, formatCurrency } from "../../lib/utils/utils"
import { useNetWorthStore } from "../../hooks/useNetWorthStore"
import { toast } from "sonner"

export function NetWorthInputForm() {
  const { assets, addAsset, addNetWorthEntry, netWorthEntries } = useNetWorthStore()
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [selectedAsset, setSelectedAsset] = useState("")
  const [action, setAction] = useState<"add" | "subtract">("add")
  const [value, setValue] = useState("")
  const [newAssetName, setNewAssetName] = useState("")
  const [newAssetType, setNewAssetType] = useState<"asset" | "liability">("asset")
  const [showNewAssetForm, setShowNewAssetForm] = useState(false)

  const currentTotals = useMemo(() => {
    const sortedEntries = [...netWorthEntries].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    )

    let totalAssets = 0
    let totalLiabilities = 0

    // Calculate totals from entries
    sortedEntries.forEach(entry => {
      if (entry.type === "asset") {
        if (entry.action === "add") {
          totalAssets += entry.value
        } else {
          totalAssets -= entry.value
        }
      } else {
        if (entry.action === "add") {
          totalLiabilities += entry.value
        } else {
          totalLiabilities -= entry.value
        }
      }
    })

    return {
      totalAssets: Math.max(0, totalAssets),
      totalLiabilities: Math.max(0, totalLiabilities),
      netWorth: totalAssets - totalLiabilities
    }
  }, [netWorthEntries])

  const handleAddAsset = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newAssetName.trim()) return

    addAsset({
      name: newAssetName.trim(),
      type: newAssetType,
      value: 0
    })

    setNewAssetName("")
    setShowNewAssetForm(false)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedAsset || !value) return

    const numericValue = parseFloat(value)
    if (isNaN(numericValue) || numericValue <= 0) {
      toast.error("Please enter a valid positive number")
      return
    }

    addNetWorthEntry({
      date,
      assetName: selectedAsset,
      type: assets.find(a => a.name === selectedAsset)?.type || "asset",
      action,
      value: numericValue,
      netWorth: 0 
    })

    setSelectedAsset("")
    setValue("")
    setAction("add")
  }

  return (
    <div className="rounded-xl sm:rounded-2xl border bg-gradient-to-b from-card to-card/50 shadow-xl">
      {/* Header with Current Net Worth */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b p-4 sm:p-6 bg-gradient-to-r from-primary/5 to-transparent">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-primary/10 p-2.5 ring-1 ring-primary/20">
            <Coins className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold tracking-tight">Net Worth Tracker</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Record changes to your assets and liabilities</p>
          </div>
        </div>
        <div className="w-full sm:w-auto flex gap-2">
          <div className="flex-1 sm:flex-initial p-2.5 rounded-lg bg-card/50 backdrop-blur border shadow-sm">
            <p className="text-xs font-medium text-muted-foreground">Current Net Worth</p>
            <p className="text-lg sm:text-xl font-bold tracking-tight text-primary mt-0.5">
              {formatCurrency(currentTotals.netWorth)}
            </p>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-6 space-y-6">
        {/* Asset Management Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-foreground/80">Asset Management</h4>
            <button
              type="button"
              onClick={() => setShowNewAssetForm(!showNewAssetForm)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-primary/10 hover:bg-primary/15 text-xs font-medium text-primary transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
              New Asset
            </button>
          </div>

          {showNewAssetForm && (
            <form onSubmit={handleAddAsset} className="p-3 rounded-lg bg-muted/30 border space-y-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Asset Name"
                  value={newAssetName}
                  onChange={(e) => setNewAssetName(e.target.value)}
                  className="flex-1 h-8 rounded-md border bg-background px-2.5 text-sm"
                  required
                />
                <select
                  value={newAssetType}
                  onChange={(e) => setNewAssetType(e.target.value as "asset" | "liability")}
                  className="w-32 h-8 rounded-md border bg-background px-2.5 text-sm"
                >
                  <option value="asset">Asset</option>
                  <option value="liability">Liability</option>
                </select>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNewAssetForm(false)}
                  className="px-3 py-1.5 rounded-md border bg-card hover:bg-muted/50 text-xs font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-medium transition-colors"
                >
                  Add Asset
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Record Change Form */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-foreground/80">Record Change</h4>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-foreground/70">Date</label>
                <div className="relative mt-1" onClick={() => (document.getElementById('date-input') as HTMLInputElement)?.showPicker()}>
                  <CalendarIcon className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                  <input
                    id="date-input"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className={cn(
                      "w-full h-8 rounded-md border bg-background pl-8 pr-2.5 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary cursor-pointer"
                    )}
                    required
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-foreground/70">Asset/Liability</label>
                <select
                  value={selectedAsset}
                  onChange={(e) => setSelectedAsset(e.target.value)}
                  className="w-full h-8 mt-1 rounded-md border bg-background px-2.5 text-sm"
                  required
                >
                  <option value="">Select Asset</option>
                  <optgroup label="Assets">
                    {assets.filter(a => a.type === "asset").map(asset => (
                      <option key={asset.id} value={asset.name}>{asset.name}</option>
                    ))}
                  </optgroup>
                  <optgroup label="Liabilities">
                    {assets.filter(a => a.type === "liability").map(asset => (
                      <option key={asset.id} value={asset.name}>{asset.name}</option>
                    ))}
                  </optgroup>
                </select>
              </div>
            </div>

            <div className="flex gap-2">
              <div className="w-32">
                <label className="text-xs font-medium text-foreground/70">Action</label>
                <select
                  value={action}
                  onChange={(e) => setAction(e.target.value as "add" | "subtract")}
                  className="w-full h-8 mt-1 rounded-md border bg-background px-2.5 text-sm"
                  required
                >
                  <option value="add">Add</option>
                  <option value="subtract">Subtract</option>
                </select>
              </div>
              <div className="flex-1">
                <label className="text-xs font-medium text-foreground/70">Value</label>
                <input
                  type="number"
                  placeholder="Enter amount"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  className="w-full h-8 mt-1 rounded-md border bg-background px-2.5 text-sm"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-4 py-1.5 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-medium transition-colors"
              >
                Save Change
              </button>
            </div>
          </form>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          <div className="p-2.5 rounded-lg bg-card/50 backdrop-blur border shadow-sm">
            <div className="flex items-center gap-1.5">
              <ArrowUp className="h-3 w-3 text-emerald-500" />
              <p className="text-xs font-medium text-muted-foreground">Total Assets</p>
            </div>
            <p className="text-sm font-semibold text-emerald-500 mt-1">
              {formatCurrency(currentTotals.totalAssets)}
            </p>
          </div>
          <div className="p-2.5 rounded-lg bg-card/50 backdrop-blur border shadow-sm">
            <div className="flex items-center gap-1.5">
              <ArrowDown className="h-3 w-3 text-red-500" />
              <p className="text-xs font-medium text-muted-foreground">Total Liabilities</p>
            </div>
            <p className="text-sm font-semibold text-red-500 mt-1">
              {formatCurrency(currentTotals.totalLiabilities)}
            </p>
          </div>
          <div className="col-span-2 sm:col-span-1 p-2.5 rounded-lg bg-card/50 backdrop-blur border shadow-sm">
            <div className="flex items-center gap-1.5">
              <Coins className="h-3 w-3 text-primary" />
              <p className="text-xs font-medium text-muted-foreground">Net Worth</p>
            </div>
            <p className="text-sm font-semibold text-primary mt-1">
              {formatCurrency(currentTotals.netWorth)}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}