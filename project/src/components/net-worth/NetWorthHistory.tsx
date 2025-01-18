import { formatCurrency } from "../../lib/utils/utils"
import { useNetWorthStore } from "../../hooks/useNetWorthStore"
import { Edit, Trash2, TrendingUp, TrendingDown, Coins } from "lucide-react"
import { useState } from "react"
import { NetWorthEntry } from "../../lib/types/net-worth"
import { NetWorthEditModal } from "./NetWorthEditModal"

export function NetWorthHistory() {
  const netWorthEntries = useNetWorthStore((state) => state.netWorthEntries)
  const removeNetWorthEntry = useNetWorthStore((state) => state.removeNetWorthEntry)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [selectedEntry, setSelectedEntry] = useState<NetWorthEntry | null>(null)

  const handleEdit = (entry: NetWorthEntry) => {
    setSelectedEntry(entry)
    setEditModalOpen(true)
  }

  
  const sortedEntries = [...netWorthEntries].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  
  const getChange = (index: number) => {
    if (index === sortedEntries.length - 1) return null
    return sortedEntries[index].netWorth - sortedEntries[index + 1].netWorth
  }

  return (
    <div className="rounded-lg border bg-card">
      <div className="border-b p-3 sm:p-4">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-primary/10 p-2">
            <Coins className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h3 className="text-base font-semibold">Net Worth History</h3>
            <p className="text-xs text-muted-foreground">Track your wealth growth over time</p>
          </div>
        </div>
      </div>
      <div className="max-w-[calc(100vw-2rem)] overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-muted/50">
              <th className="whitespace-nowrap px-2 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-medium text-muted-foreground">Date</th>
              <th className="whitespace-nowrap px-2 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-medium text-muted-foreground">Assets</th>
              <th className="whitespace-nowrap px-2 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-medium text-muted-foreground">Liabilities</th>
              <th className="whitespace-nowrap px-2 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-medium text-muted-foreground">Net Worth</th>
              <th className="whitespace-nowrap px-2 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-medium text-muted-foreground">Change</th>
              <th className="whitespace-nowrap px-2 sm:px-4 py-2 sm:py-3 text-right"><span className="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {sortedEntries.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-8 sm:py-12 px-4">
                  <div className="rounded-full bg-muted p-2 sm:p-3 mb-3 sm:mb-4">
                    <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-muted-foreground" />
                  </div>
                  <p className="text-base sm:text-lg font-medium text-muted-foreground mb-1">No entries yet</p>
                  <p className="text-xs sm:text-sm text-muted-foreground text-center">Start tracking your net worth by adding your first entry</p>
                </td>
              </tr>
            ) : (
              sortedEntries.map((entry, index) => {
                const change = getChange(index)
                return (
                  <tr key={entry.id} className="hover:bg-muted/50 transition-colors">
                    <td className="whitespace-nowrap px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm">
                      {new Date(entry.date).toLocaleDateString()}
                    </td>
                    <td className="whitespace-nowrap px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-emerald-600 font-medium">
                      {formatCurrency(entry.totalAssets)}
                    </td>
                    <td className="whitespace-nowrap px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-red-600 font-medium">
                      {formatCurrency(entry.totalLiabilities)}
                    </td>
                    <td className="whitespace-nowrap px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-semibold">
                      {formatCurrency(entry.netWorth)}
                    </td>
                    <td className="whitespace-nowrap px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm">
                      {change !== null && (
                        <div className="flex items-center gap-1">
                          {change >= 0 ? (
                            <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-emerald-600" />
                          ) : (
                            <TrendingDown className="h-3 w-3 sm:h-4 sm:w-4 text-red-600" />
                          )}
                          <span className={change >= 0 ? "text-emerald-600" : "text-red-600"}>
                            {formatCurrency(Math.abs(change))}
                          </span>
                        </div>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-2 sm:px-4 py-2 sm:py-3 text-right space-x-1 sm:space-x-2">
                      <button
                        onClick={() => handleEdit(entry)}
                        className="rounded-lg p-1.5 sm:p-2 text-muted-foreground hover:bg-muted transition-colors"
                      >
                        <Edit className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      </button>
                      <button
                        onClick={() => removeNetWorthEntry(entry.id)}
                        className="rounded-lg p-1.5 sm:p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50 transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      </button>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
      <NetWorthEditModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        entry={selectedEntry}
      />
    </div>
  )
}