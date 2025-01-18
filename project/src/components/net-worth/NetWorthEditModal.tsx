import { useState, useMemo, useEffect } from "react"
import { CalendarIcon, X, Trash2 } from "lucide-react"
import { cn, formatCurrency } from "../../lib/utils/utils"
import { useNetWorthStore } from "../../hooks/useNetWorthStore"
import { Asset, Liability, NetWorthEntry } from "../../lib/types/net-worth" 

interface NetWorthEditModalProps {
  isOpen: boolean
  onClose: () => void
  entry: NetWorthEntry | null
}

const initialAsset: Asset = { id: crypto.randomUUID(), name: "", value: 0 } 
const initialLiability: Liability = { id: crypto.randomUUID(), name: "", value: 0 }

export function NetWorthEditModal({ isOpen, onClose, entry }: NetWorthEditModalProps) {
  const updateNetWorthEntry = useNetWorthStore((state) => state.updateNetWorthEntry)
  const [date, setDate] = useState(entry?.date || new Date().toISOString().split('T')[0])
  const [assets, setAssets] = useState<Asset[]>(entry?.assets || [initialAsset]) 
  const [liabilities, setLiabilities] = useState<Liability[]>(entry?.liabilities || [initialLiability]) 

  useEffect(() => {
    if (entry) {
      setDate(entry.date)
      setAssets(entry.assets)
      setLiabilities(entry.liabilities)
    }
  }, [entry])

  const totalAssets = useMemo(() => {
    return assets.reduce((sum, asset) => sum + asset.value, 0)
  }, [assets])

  const totalLiabilities = useMemo(() => {
    return liabilities.reduce((sum, liability) => sum + liability.value, 0)
  }, [liabilities])

  const netWorth = useMemo(() => totalAssets - totalLiabilities, [totalAssets, totalLiabilities])

  if (!isOpen || !entry) return null

  const resetForm = () => {
    setDate(new Date().toISOString().split('T')[0])
    setAssets([initialAsset])
    setLiabilities([initialLiability])
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (assets.some(asset => !asset.name || !asset.value) || liabilities.some(liability => !liability.name || !liability.value)) {
      return;
    }
    updateNetWorthEntry({
      ...entry,
      date,
      assets: assets.map(a => ({ ...a, value: parseFloat(a.value?.toString() || "0") })),
      liabilities: liabilities.map(l => ({ ...l, value: parseFloat(l.value?.toString() || "0") })),
      totalAssets,
      totalLiabilities,
      netWorth,
    })
    resetForm()
    onClose()
  }

  const addAssetField = () => {
    setAssets([...assets, { ...initialAsset, id: crypto.randomUUID() }])
  }

  const removeAssetField = (id: string) => {
    setAssets(assets.filter(asset => asset.id !== id))
  }

  const updateAssetField = (index: number, field: "name" | "value", value: string) => {
    const newAssets = [...assets]
    if (field === "value") {
      newAssets[index] = { ...newAssets[index], value: parseFloat(value) }
    } else {
      newAssets[index] = { ...newAssets[index], name: value }
    }
    setAssets(newAssets)
  }

  const addLiabilityField = () => {
    setLiabilities([...liabilities, { ...initialLiability, id: crypto.randomUUID() }])
  }

  const removeLiabilityField = (id: string) => {
    setLiabilities(liabilities.filter(liability => liability.id !== id))
  }

  const updateLiabilityField = (index: number, field: "name" | "value", value: string) => {
    const newLiabilities = [...liabilities]
    if (field === "value") {
      newLiabilities[index] = { ...newLiabilities[index], value: parseFloat(value) }
    } else {
      newLiabilities[index] = { ...newLiabilities[index], name: value }
    }
    setLiabilities(newLiabilities)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-lg p-4 w-full max-w-xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Edit Net Worth</h2>
          <button onClick={onClose} className="rounded-md p-1 text-muted-foreground hover:bg-muted/20">
            <X className="h-4 w-4" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground">Date</label>
            <div className="relative mt-1.5">
              <CalendarIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className={cn(
                  "w-full h-10 rounded-md border-0 bg-muted pl-9 pr-3 text-base shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                )}
                required
              />
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-muted-foreground mb-2">Assets</h4>
            <div className="space-y-2">
              {assets.map((asset, index) => (
                <div key={asset.id} className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  <input
                    type="text"
                    placeholder="Asset name"
                    value={asset.name}
                    onChange={(e) => updateAssetField(index, "name", e.target.value)}
                    className="flex-1 h-10 rounded-md border-0 bg-muted px-3 text-base shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                    required
                  />
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Value"
                      value={asset.value}
                      onChange={(e) => updateAssetField(index, "value", e.target.value)}
                      className="w-full sm:w-32 h-10 rounded-md border-0 bg-muted px-3 text-base shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                      required
                    />
                    {assets.length > 1 && (
                      <button type="button" onClick={() => removeAssetField(asset.id)} className="text-destructive">
                        <Trash2 className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
              <button type="button" onClick={addAssetField} className="text-sm text-primary">+ Add Asset</button>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-muted-foreground mb-2">Liabilities</h4>
            <div className="space-y-2">
              {liabilities.map((liability, index) => (
                <div key={liability.id} className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  <input
                    type="text"
                    placeholder="Liability name"
                    value={liability.name}
                    onChange={(e) => updateLiabilityField(index, "name", e.target.value)}
                    className="flex-1 h-10 rounded-md border-0 bg-muted px-3 text-base shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                    required
                  />
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Value"
                      value={liability.value}
                      onChange={(e) => updateLiabilityField(index, "value", e.target.value)}
                      className="w-full sm:w-32 h-10 rounded-md border-0 bg-muted px-3 text-base shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                      required
                    />
                    {liabilities.length > 1 && (
                      <button type="button" onClick={() => removeLiabilityField(liability.id)} className="text-destructive">
                        <Trash2 className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
              <button type="button" onClick={addLiabilityField} className="text-sm text-primary">+ Add Liability</button>
            </div>
          </div>

          <div className="flex justify-between font-semibold">
            <div>Net Worth:</div>
            <div>{formatCurrency(netWorth)}</div>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 rounded-md bg-muted text-muted-foreground hover:bg-muted/80 text-sm font-medium"
            >
              Reset
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 text-sm font-medium"
            >
              Update Entry
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}