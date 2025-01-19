import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Asset, NetWorthEntry } from '../lib/types/net-worth';

interface NetWorthStore {
  assets: Asset[];
  netWorthEntries: NetWorthEntry[];
  addAsset: (asset: Omit<Asset, 'id'>) => void;
  removeAsset: (id: string) => void;
  addNetWorthEntry: (entry: Omit<NetWorthEntry, 'id'>) => void;
  removeNetWorthEntry: (id: string) => void;
    updateNetWorthEntry: (id: string, updates: Partial<Omit<NetWorthEntry, 'id'>>) => void;

}

export const useNetWorthStore = create<NetWorthStore>()(
  persist(
    (set) => ({
      assets: [],
      netWorthEntries: [],
      addAsset: (newAsset) => {
        set((state) => ({
          assets: [...state.assets, { ...newAsset, id: crypto.randomUUID() }],
        }));
      },
      removeAsset: (id) => {
        set((state) => ({
          assets: state.assets.filter((asset) => asset.id !== id),
        }));
      },
      addNetWorthEntry: (newEntry) => {
        set((state) => {
           const updatedEntries = [...state.netWorthEntries, {
                ...newEntry,
                id: crypto.randomUUID(),
              },
           ]
           // Sort by date
        const sortedEntries = [...updatedEntries].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

              let runningNetWorth = 0;
          const recalculatedEntries = sortedEntries.map((entry) => {
           if (entry.action === "add") {
                  runningNetWorth += entry.value
             } else {
                   runningNetWorth -= entry.value
               }
                return {
              ...entry,
              netWorth: runningNetWorth,
            }
          })
          return { netWorthEntries: recalculatedEntries}
        });
      },
     removeNetWorthEntry: (id) => {
           set((state) => {
            const updatedEntries = state.netWorthEntries.filter(e => e.id !== id)

            // Sort by date
          const sortedEntries = [...updatedEntries].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
           let runningNetWorth = 0;

              const recalculatedEntries = sortedEntries.map((entry) => {
             if (entry.action === "add") {
                      runningNetWorth += entry.value
                 } else {
                     runningNetWorth -= entry.value
                   }
                return {
                  ...entry,
                  netWorth: runningNetWorth,
                }
             })
             return { netWorthEntries: recalculatedEntries }

           })
    },
    updateNetWorthEntry: (id, updates) => {
        set((state) => {
           const updatedEntries = state.netWorthEntries.map((entry) =>
                  entry.id === id ? { ...entry, ...updates } : entry
              );

           // Sort by date
          const sortedEntries = [...updatedEntries].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
          let runningNetWorth = 0;

             const recalculatedEntries = sortedEntries.map((entry) => {
                if (entry.action === 'add') {
                    runningNetWorth += entry.value;
               } else {
                    runningNetWorth -= entry.value;
               }
                  return {
                        ...entry,
                        netWorth: runningNetWorth,
                 };
              });

         return { netWorthEntries: recalculatedEntries }
      });
    },

    }),
    {
      name: 'net-worth-storage',
    },
  ),
);