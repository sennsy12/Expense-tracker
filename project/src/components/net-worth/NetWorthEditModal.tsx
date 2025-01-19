import React, { useState, useEffect, useCallback } from 'react';
import { CalendarIcon, X } from 'lucide-react';
import { cn } from '../../lib/utils/utils';
import { useNetWorthStore } from '../../hooks/useNetWorthStore';
import { NetWorthEntry } from '../../lib/types/net-worth';
import { toast } from 'sonner';

interface NetWorthEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  entry: NetWorthEntry | null;
}

export function NetWorthEditModal({ isOpen, onClose, entry }: NetWorthEditModalProps) {
  const { assets, removeNetWorthEntry, addNetWorthEntry } = useNetWorthStore();
  const [date, setDate] = useState('');
  const [selectedAsset, setSelectedAsset] = useState('');
  const [action, setAction] = useState<'add' | 'subtract'>('add');
  const [value, setValue] = useState('');


  // Populate the form on opening
  useEffect(() => {
    if (entry) {
      setDate(entry.date);
      setSelectedAsset(entry.assetName);
      setAction(entry.action);
      setValue(String(entry.value)); // ensure it is a string
    } else {
        // when closed and the state is reset to the default
      setDate('')
      setSelectedAsset('')
      setAction('add')
      setValue('')
    }
  }, [entry]);


   const handleDateChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setDate(e.target.value);
  }, []);

  const handleAssetChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedAsset(e.target.value);
  }, []);

    const handleActionChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
      setAction(e.target.value as 'add' | 'subtract');
    }, []);


  const handleValueChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  }, []);


  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();

    if (!entry || !selectedAsset || !value) {
      toast.error('Please fill out all fields.');
      return;
    }

    const numericValue = parseFloat(value);

    if (isNaN(numericValue) || numericValue <= 0) {
      toast.error('Please enter a valid positive number.');
      return;
    }


      removeNetWorthEntry(entry.id);
    addNetWorthEntry({
        date,
        assetName: selectedAsset,
        type: assets.find((a) => a.name === selectedAsset)?.type || 'asset',
        action,
        value: numericValue,
        netWorth: 0,
      });

    onClose();
  }, [entry, selectedAsset, value, date, action, assets, addNetWorthEntry, removeNetWorthEntry, onClose]);

  if (!isOpen || !entry) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="relative w-full max-w-md bg-background rounded-lg shadow-lg">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-1 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4">Edit Entry</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs sm:text-sm font-semibold text-foreground/70">
                Date
              </label>
              <div
                className="relative mt-1.5"
                onClick={() =>
                  (
                    document.getElementById('edit-date-input') as HTMLInputElement
                  )?.showPicker()
                }
              >
                <CalendarIcon className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                <input
                  id="edit-date-input"
                  type="date"
                  value={date}
                 onChange={handleDateChange}
                  className={cn(
                    'w-full h-8 sm:h-9 rounded-md border-0 bg-muted/50 pl-8 pr-2.5 text-sm shadow-sm ring-1 ring-border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer',
                  )}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex gap-2">
                <select
                  value={action}
                 onChange={handleActionChange}
                  className="w-32 h-8 sm:h-9 rounded-md border-0 bg-muted/50 px-2 text-sm"
                  required
                >
                  <option value="add">Add</option>
                  <option value="subtract">Subtract</option>
                </select>
                <select
                  value={selectedAsset}
                  onChange={handleAssetChange}
                  className="flex-1 h-8 sm:h-9 rounded-md border-0 bg-muted/50 px-2 text-sm"
                  required
                >
                  <option value="">Select Asset</option>
                  <optgroup label="Assets">
                    {assets
                      .filter((a) => a.type === 'asset')
                      .map((asset) => (
                        <option key={asset.id} value={asset.name}>
                          {asset.name}
                        </option>
                      ))}
                  </optgroup>
                  <optgroup label="Liabilities">
                    {assets
                      .filter((a) => a.type === 'liability')
                      .map((asset) => (
                        <option key={asset.id} value={asset.name}>
                          {asset.name}
                        </option>
                      ))}
                  </optgroup>
                </select>
                <input
                  type="number"
                  placeholder="Value"
                  value={value}
                   onChange={handleValueChange}
                  className="w-28 h-8 sm:h-9 rounded-md border-0 bg-muted/50 px-2 text-sm"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-md border bg-card hover:bg-muted/50 text-xs font-medium transition-colors"
              >
                Cancel
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
      </div>
    </div>
  );
}