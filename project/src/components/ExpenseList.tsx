import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type Row,
} from "@tanstack/react-table"
import { useExpenseStore } from "../lib/store"
import { formatCurrency, formatDate } from "../lib/utils/utils"
import { type ExpenseWithId } from "../lib/types"
import { Download, Trash2, Pencil } from "lucide-react"
import * as XLSX from 'xlsx'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu"
import { useExpenseFilters } from "../hooks/useExpenseFilters"
import { ExpenseFilters } from "./ExpenseFilters"
import { toast } from "sonner"
import { useState } from "react"
import { ExpenseEditModal } from "./ExpenseEditModal"

export function ExpenseList() {
  const expenses = useExpenseStore((state) => state.expenses)
  const {
    filters,
    sort,
    filteredExpenses,
    updateFilters,
    setSort,
    resetFilters,
  } = useExpenseFilters(expenses)

  const [editingExpense, setEditingExpense] = useState<ExpenseWithId | null>(null)

  const columns = [
    {
      accessorKey: "date",
      header: "Date",
      cell: ({ row }: { row: Row<ExpenseWithId> }) => formatDate(row.original.date),
    },
    {
      accessorKey: "category",
      header: "Category",
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }: { row: Row<ExpenseWithId> }) => (
        <div className="max-w-[180px] whitespace-pre-wrap break-words">
          {row.original.description}
        </div>
      ),
    },
    {
      accessorKey: "amount",
      header: "Amount",
      cell: ({ row }: { row: Row<ExpenseWithId> }) => formatCurrency(row.original.amount),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }: { row: Row<ExpenseWithId> }) => (
        <div className="flex gap-2">
          <button
            onClick={() => {
              useExpenseStore.getState().removeExpense(row.original.id)
              toast.success("Expense deleted")
            }}
            className="p-2 hover:bg-gray-100 rounded-full dark:hover:bg-gray-800"
          >
            <Trash2 className="h-4 w-4" />
          </button>
          <button
            onClick={() => setEditingExpense(row.original)}
            className="p-2 hover:bg-gray-100 rounded-full dark:hover:bg-gray-800"
          >
            <Pencil className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ]

  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      filteredExpenses.map(expense => ({
        Date: formatDate(expense.date),
        Category: expense.category,
        Description: expense.description,
        Amount: formatCurrency(expense.amount)
      }))
    )
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "Expenses")
    XLSX.writeFile(workbook, "expenses.xlsx")
  }

  const downloadWord = () => {
    const header = `Expense Report\n\n`
    const table = filteredExpenses.map(expense => 
      `Date: ${formatDate(expense.date)}\nCategory: ${expense.category}\nDescription: ${expense.description}\nAmount: ${formatCurrency(expense.amount)}\n\n`
    ).join('')
    
    const content = header + table
    const blob = new Blob([content], { type: 'application/msword' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = 'expenses.doc'
    link.click()
  }

  const table = useReactTable({
    data: filteredExpenses,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="space-y-4">
      <ExpenseFilters
        filters={filters}
        sort={sort}
        onUpdateFilters={updateFilters}
        onUpdateSort={setSort}
        onReset={resetFilters}
      />
      
      <div className="rounded-md border overflow-hidden">
        <div className="flex justify-between items-center p-3 sm:p-4 border-b">
          <h3 className="text-sm font-medium">
            Expense List ({filteredExpenses.length} items)
          </h3>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="p-2 hover:bg-gray-100 rounded-full dark:hover:bg-gray-800"
                title="Download List"
              >
                <Download className="h-4 w-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={downloadExcel}>
                Download as Excel
              </DropdownMenuItem>
              <DropdownMenuItem onClick={downloadWord}>
                Download as Word
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px]">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      style={{ width: header.getSize() }}
                      className="border-b px-2 py-2 text-left text-sm font-medium text-muted-foreground sm:px-3"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="border-b last:border-none hover:bg-muted/50">
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="px-2 py-2 text-sm sm:px-3"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {editingExpense && (
        <ExpenseEditModal
          expense={editingExpense}
          isOpen={true}
          onClose={() => setEditingExpense(null)}
        />
      )}
    </div>
  )
} 