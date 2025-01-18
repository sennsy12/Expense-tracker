import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { NetWorthEntry } from '../lib/types/net-worth'
import { v4 as uuidv4 } from 'uuid'

interface NetWorthStore {
  netWorthEntries: NetWorthEntry[]
  addNetWorthEntry: (entry: Omit<NetWorthEntry, 'id'>) => void
  removeNetWorthEntry: (id: string) => void
  updateNetWorthEntry: (entry: NetWorthEntry) => void
}

export const useNetWorthStore = create<NetWorthStore>()(
  persist(
    (set) => ({
      netWorthEntries: [],
      addNetWorthEntry: (entry) =>
        set((state) => ({
          netWorthEntries: [...state.netWorthEntries, { ...entry, id: uuidv4() }],
        })),
      removeNetWorthEntry: (id) =>
        set((state) => ({
          netWorthEntries: state.netWorthEntries.filter((entry) => entry.id !== id),
        })),
      updateNetWorthEntry: (updatedEntry) =>
        set((state) => ({
          netWorthEntries: state.netWorthEntries.map((entry) =>
            entry.id === updatedEntry.id ? updatedEntry : entry
          ),
        })),
    }),
    {
      name: 'net-worth-storage',
    }
  )
)