import { AlertTriangle } from "lucide-react"

interface ResetConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
}

export function ResetConfirmModal({ isOpen, onClose, onConfirm }: ResetConfirmModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-background rounded-lg p-6 w-full max-w-md">
        <div className="flex items-center gap-3 text-destructive mb-4">
          <AlertTriangle className="h-5 w-5" />
          <h2 className="text-lg font-semibold">Reset All Expenses</h2>
        </div>
        
        <p className="text-sm text-muted-foreground mb-6">
          Are you sure you want to clear all expenses? This action cannot be undone.
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md bg-muted text-muted-foreground hover:bg-muted/80 text-sm font-medium"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-md bg-destructive text-destructive-foreground hover:bg-destructive/90 text-sm font-medium"
          >
            Reset All
          </button>
        </div>
      </div>
    </div>
  )
} 