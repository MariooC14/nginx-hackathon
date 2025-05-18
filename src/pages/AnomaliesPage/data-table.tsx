import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { DataTableViewOptions } from "./table-view-options"
import { DrawerTrigger } from "@/components/ui/drawer"
import type { Anomaly } from "@/services/AnomalyService"
import { Eye } from "lucide-react"
import type { Dispatch, SetStateAction } from "react"
import { TooltipProvider, TooltipTrigger } from "@radix-ui/react-tooltip"
import { Tooltip, TooltipContent } from "@/components/ui/tooltip"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[],
  loading?: boolean,
  onSelect: Dispatch<SetStateAction<Anomaly | null>>
}

export function AnomaliesDataTable<TData, TValue>({
  columns,
  data,
  loading = false,
  onSelect,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 12,
      }
    },
    enableColumnResizing: true,
    columnResizeMode: "onChange",
  })

  const LoadingView = () => (
    <TableBody>
      <TableRow>
        <TableCell colSpan={columns.length} className="h-24">
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-2">Loading...</span>
          </div>
        </TableCell>
      </TableRow>
    </TableBody>
  );

  return (
    <>
      <DataTableViewOptions table={table} />
      <div className="rounded-md border m-2">
        {loading ?
          <LoadingView />
          :
          <>
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) =>
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                      </TableHead>
                    )}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {cell.column.id === "actions" ? (
                            <TooltipProvider>
                              <Tooltip delayDuration={250}>
                                <TooltipTrigger asChild>
                                  <DrawerTrigger asChild>
                                    <Button variant="ghost" size="icon" onClick={() => onSelect(row.original as Anomaly)}>
                                      <Eye />
                                    </Button>
                                  </DrawerTrigger>
                                </TooltipTrigger>
                                <TooltipContent>View details</TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          ) : (
                            flexRender(cell.column.columnDef.cell, cell.getContext())
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="h-24 text-center">
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table><div className="flex items-center space-x-2 p-4 select-none">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                Next
              </Button>
            </div>
          </>
        }
      </div>
    </>
  )
}