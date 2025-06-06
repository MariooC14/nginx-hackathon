"use client"

import * as React from "react"
import {
  type ColumnDef,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  getFilteredRowModel,
  type ColumnFiltersState,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown } from "lucide-react"

import { Button } from "@/components/ui/button.tsx"
import { Checkbox } from "@/components/ui/checkbox.tsx"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.tsx"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table.tsx"
import { Switch } from "@/components/ui/switch.tsx"
import { Input } from "@/components/ui/input.tsx"
import { useVirtualizer } from "@tanstack/react-virtual"
import { networkLogService } from "@/services/NetworkLogService.ts"
import { formatDate } from "@/lib/utils.ts"
// import { anomalyService } from "@/services/AnomalyService"
import TruncateWithTooltip from "@/lib/TruncateWithTooltip.tsx";
import { anomalyService } from "@/services/AnomalyService.ts"

export type Request = {
  method: string;
  path: string;
  version: string;
};

export type Data = {
  ip: string;
  timestamp: number;
  request: Request;
  status: number;
  size: number;
  userAgent: string;
  isAnomaly?: boolean;
};

const columns: ColumnDef<Data>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllRowsSelected() ||
          (table.getIsSomeRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllRowsSelected(value === true)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(value === true)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "ip",
    header: ({ column }) => (
      <Button
        variant={column.getIsSorted() ? "default" : "ghost"}
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        IP
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "timestamp",
    header: ({ column }) => (
      <Button
        variant={column.getIsSorted() ? "default" : "ghost"}
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Timestamp
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => formatDate(row.getValue("timestamp")),
  },
  {
    accessorKey: "request.method",
    header: ({ column }) => (
      <Button
        variant={column.getIsSorted() ? "default" : "ghost"}
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Method
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    id: "request.path",
    accessorKey: "request.path",
    header: "Path",
    cell: ({ row }) => (<TruncateWithTooltip text={row.getValue("request.path")} width={200} />
    ),
  },
  {
    accessorKey: "request.version",
    header: "Version",
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <Button
        variant={column.getIsSorted() ? "default" : "ghost"}
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Status
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const status = row.getValue("status") as number;

      return (
        <span className={getColorForStatus(status)}>
          {status}
        </span>
      )
    }
  },
  {
    accessorKey: "size",
    header: ({ column }) => (
      <Button
        variant={column.getIsSorted() ? "default" : "ghost"}
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Size
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "userAgent",
    header: "User Agent",
    cell: ({ row }) => (<TruncateWithTooltip text={row.getValue("userAgent")} width={200} />
    ),
  },
]

export function DataTable() {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [data, setData] = React.useState<Data[]>(networkLogService.getLogs())
  const [highlightAnomalies, setHighlightAnomalies] = React.useState(true)
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [loading, setLoading] = React.useState(true)

  const tableContainerRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        anomalyService.scanForAnomalies();
        setData(networkLogService.getLogs());
      } finally {
        setLoading(false);
      }
    };
    fetchData().catch(console.error);
  }, []);

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onColumnFiltersChange: setColumnFilters,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
  })

  const { rows } = table.getRowModel()

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => tableContainerRef.current,
    estimateSize: () => 45,
    overscan: 10,
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
    <div className="w-full p-4">
      <div className="flex items-center justify-between py-4">
        <Input
          placeholder="Search..."
          value={table.getState().globalFilter ?? ""}
          onChange={event => table.setGlobalFilter(event.target.value)}
          className="max-w-sm"
        />
        <div className="flex gap-2">
          <div className="flex items-center space-x-2">
            <label htmlFor="highlight-anomalies" className="text-sm">Mark Anomalies</label>
            <Switch onCheckedChange={() => setHighlightAnomalies(!highlightAnomalies)} id="highlight-anomalies"
              checked={highlightAnomalies} />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                Columns <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(value)
                      }
                    >
                      {column.id.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                    </DropdownMenuCheckboxItem>
                  )
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="rounded-md border">
        <div
          ref={tableContainerRef}
          className="w-full h-[calc(100vh-200px)] overflow-auto"
        >
          <Table className="w-full min-w-[500px] h-full min-h-[800px]">
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            {loading ? (
              <LoadingView />
            ) : (
              <TableBody>
                {rowVirtualizer.getVirtualItems().length > 0 ? (
                  <>
                    <tr style={{ height: `${rowVirtualizer.getVirtualItems()[0]?.start || 0}px` }} />

                    {rowVirtualizer.getVirtualItems().map(virtualRow => {
                      const row = rows[virtualRow.index]
                      return (
                        <TableRow
                          key={row.id}
                          data-state={row.getIsSelected() && "selected"}
                          data-index={virtualRow.index}
                          className={highlightAnomalies && row.original.isAnomaly ? "bg-red-900 hover:bg-red-500" : ""}
                        >
                          {row.getVisibleCells().map((cell) => (
                            <TableCell key={cell.id}>
                              {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </TableCell>
                          ))}
                        </TableRow>
                      )
                    })}
                  </>
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            )}
          </Table>
        </div>
      </div>
      <div className="text-sm text-muted-foreground text-right">
        {table.getFilteredSelectedRowModel().rows.length} of{" "}
        {table.getFilteredRowModel().rows.length} row(s) selected.
      </div>
    </div>
  )
}

function getColorForStatus(status: number) {
  if (status >= 400) {
    return "text-red-500";
  } else if (status >= 300) {
    return "text-yellow-500";
  } else {
    return "text-green-500";
  }
}

export default DataTable;