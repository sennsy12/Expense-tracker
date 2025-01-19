import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Asset, NetWorthEntry } from '../lib/types/net-worth'

interface NetWorthStore {
  assets: Asset[]
  netWorthEntries: NetWorthEntry[]
  addAsset: (asset: Omit<Asset, 'id'>) => void
  removeAsset: (id: string) => void
  addNetWorthEntry: (entry: Omit<NetWorthEntry, 'id'>) => void
  removeNetWorthEntry: (id: string) => void
  updateNetWorthEntry: (id: string, updates: Partial<Omit<NetWorthEntry, 'id'>>) => void
}

export const useNetWorthStore = create<NetWorthStore>()(
  persist(
    (set, get) => ({
      assets: [],
      netWorthEntries: [],
      addAsset: (newAsset) => {
        set((state) => ({
          assets: [...state.assets, { ...newAsset, id: crypto.randomUUID() }]
        }))
      },
      removeAsset: (id) => {
        set((state) => ({
          assets: state.assets.filter((asset) => asset.id !== id)
        }))
      },
      addNetWorthEntry: (newEntry) => {
        const entries = get().netWorthEntries
        const sortedEntries = [...entries].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        const latestEntry = sortedEntries[0]
        
        // Calculate the new net worth based on the previous entry
        let netWorth = latestEntry ? latestEntry.netWorth : 0
        if (newEntry.action === "add") {
          netWorth += newEntry.value
        } else {
          netWorth -= newEntry.value
        }

        set((state) => ({
          netWorthEntries: [...state.netWorthEntries, {
            ...newEntry,
            id: crypto.randomUUID(),
            netWorth
          }]
        }))
      },
      removeNetWorthEntry: (id) => {
        const entries = get().netWorthEntries
        const entryToRemove = entries.find(e => e.id === id)
        if (!entryToRemove) return

        // Only update entries that come AFTER the deleted entry
        const updatedEntries = entries.map(entry => {
          const entryDate = new Date(entry.date).getTime()
          const removedDate = new Date(entryToRemove.date).getTime()
          
          // If this entry is before or same as the deleted entry, keep it unchanged
          if (entryDate <= removedDate) {
            return entry
          }

          // For entries after the deleted date, recalculate their net worth
          const previousEntries = entries
            .filter(e => 
              new Date(e.date).getTime() < entryDate && 
              e.id !== id
            )
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

          const previousEntry = previousEntries[0]
          let newNetWorth = previousEntry ? previousEntry.netWorth : 0

          if (entry.action === "add") {
            newNetWorth += entry.value
          } else {
            newNetWorth -= entry.value
          }

          return {
            ...entry,
            netWorth: newNetWorth
          }
        })

        set({
          netWorthEntries: updatedEntries.filter(e => e.id !== id)
        })
      },
      updateNetWorthEntry: (id, updates) => {
        const entries = get().netWorthEntries
        const entryIndex = entries.findIndex(e => e.id === id)
        if (entryIndex === -1) return

        const updatedEntries = [...entries]
        updatedEntries[entryIndex] = {
          ...updatedEntries[entryIndex],
          ...updates
        }

        // Recalculate net worth for this entry and all subsequent entries
        for (let i = entryIndex; i < updatedEntries.length; i++) {
          const entry = updatedEntries[i]
          const previousEntry = i > 0 ? updatedEntries[i - 1] : null
          
          let newNetWorth = previousEntry ? previousEntry.netWorth : 0
          if (entry.action === "add") {
            newNetWorth += entry.value
          } else {
            newNetWorth -= entry.value
          }
          
          updatedEntries[i] = {
            ...entry,
            netWorth: newNetWorth
          }
        }

        set({ netWorthEntries: updatedEntries })
      }
    }),
    {
      name: 'net-worth-storage',
    }
  )
)