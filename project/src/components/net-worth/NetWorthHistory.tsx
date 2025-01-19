import { useMemo, useState } from "react"
import { Trash2, Edit } from "lucide-react"
import { useNetWorthStore } from "../../hooks/useNetWorthStore"
import { formatCurrency } from "../../lib/utils/utils"
import { cn } from "../../lib/utils/utils"
import { NetWorthEntry } from "../../lib/types/net-worth"
import { NetWorthEditModal } from "./NetWorthEditModal"

export function NetWorthHistory() {
  const { netWorthEntries, removeNetWorthEntry } = useNetWorthStore()
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [selectedEntry, setSelectedEntry] = useState<NetWorthEntry | null>(null)

  const sortedEntries = useMemo(() => {
    return [...netWorthEntries].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    )
  }, [netWorthEntries])

  const handleEdit = (entry: NetWorthEntry) => {
    setSelectedEntry(entry)
    setEditModalOpen(true)
  }

  return (
    <div className="rounded-xl sm:rounded-2xl border bg-card shadow-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="text-left p-2 sm:p-3 text-xs font-medium text-muted-foreground">Date</th>
              <th className="text-left p-2 sm:p-3 text-xs font-medium text-muted-foreground">Asset</th>
              <th className="text-left p-2 sm:p-3 text-xs font-medium text-muted-foreground">Type</th>
              <th className="text-right p-2 sm:p-3 text-xs font-medium text-muted-foreground">Change</th>
              <th className="text-right p-2 sm:p-3 text-xs font-medium text-muted-foreground">Net Worth</th>
              <th className="w-[1%] p-2 sm:p-3"></th>
            </tr>
          </thead>
          <tbody>
            {sortedEntries.map((entry) => (
              <tr key={entry.id} className="border-b border-border/50 last:border-0">
                <td className="p-2 sm:p-3 text-xs sm:text-sm whitespace-nowrap">
                  {new Date(entry.date).toLocaleDateString()}
                </td>
                <td className="p-2 sm:p-3 text-xs sm:text-sm">
                  {entry.assetName}
                </td>
                <td className="p-2 sm:p-3">
                  <span className={cn(
                    "text-[10px] sm:text-xs px-1.5 py-0.5 rounded-md font-medium",
                    entry.type === "asset" ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"
                  )}>
                    {entry.type}
                  </span>
                </td>
                <td className="p-2 sm:p-3 text-right">
                  <span className={cn(
                    "text-xs sm:text-sm font-medium",
                    entry.action === "add" ? "text-emerald-500" : "text-red-500"
                  )}>
                    {entry.action === "add" ? "+" : "-"}{formatCurrency(entry.value)}
                  </span>
                </td>
                <td className="p-2 sm:p-3 text-right">
                  <span className="text-xs sm:text-sm font-medium">
                    {formatCurrency(entry.netWorth)}
                  </span>
                </td>
                <td className="p-2 sm:p-3 text-right whitespace-nowrap">
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleEdit(entry)}
                      className="p-1 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-md transition-colors"
                    >
                      <Edit className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => removeNetWorthEntry(entry.id)}
                      className="p-1 text-destructive hover:bg-destructive/10 rounded-md transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
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