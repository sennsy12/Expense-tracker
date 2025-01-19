import React, { useMemo, useCallback } from 'react';
import { useNetWorthStore } from '../../hooks/useNetWorthStore';
import { formatCurrency } from '../../lib/utils/utils';
import { X } from 'lucide-react';

interface AssetBreakdownModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function AssetBreakdownModal({ isOpen, onClose }: AssetBreakdownModalProps) {
  const { netWorthEntries } = useNetWorthStore();
  // Calculate asset totals with useMemo for optimal calculation on state change
   const assetTotals = useMemo(() => {
    const totals: { [assetName: string]: number } = {};

    netWorthEntries.forEach(entry => {
       if (totals[entry.assetName]) {
          if (entry.action === 'add'){
              totals[entry.assetName] += entry.value;
           }
          else
             {
              totals[entry.assetName] -= entry.value
         }

         }
           else {
            totals[entry.assetName] = entry.action === 'add' ? entry.value : -entry.value
           }
     });

        return totals;
 }, [netWorthEntries]);

  // Use useCallback for proper event handling and prevent excessive renders.
    const closeModal = useCallback(() => {
          onClose();
    }, [onClose]);

    if (!isOpen) return null;


  return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
         <div className="relative w-full max-w-md bg-background rounded-lg shadow-lg">
            <button
             onClick={closeModal}
             className="absolute right-4 top-4 p-1 text-muted-foreground hover:text-foreground transition-colors"
            >
            <X className="h-4 w-4" />
         </button>
      <div className="p-6">
              <h2 className="text-lg font-semibold mb-4">Asset Breakdown</h2>
                  <ul className="space-y-2">
                      {Object.entries(assetTotals).map(([assetName, total]) => (
                      <li key={assetName} className="flex justify-between items-center py-1.5 border-b border-border/50 last:border-0">
                              <span className="font-medium">{assetName}</span>
                                 <span className="font-semibold">{formatCurrency(total)}</span>
                        </li>
                   ))}
               </ul>
           </div>
        </div>
     </div>
    );
}