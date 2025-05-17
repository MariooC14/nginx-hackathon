import type { NetworkLog } from "@/types";
import type { ColumnDef } from "@tanstack/react-table";
import AnomalyDetailsDialog from "./AnomalyDetailsDialog";
import TruncateWithTooltip from "@/components/TruncateWithTooltip";

export const columns: ColumnDef<NetworkLog>[] = [
  {
    accessorKey: "ip",
    header: "IP Address",
  },
  {
    accessorKey: "timestamp",
    header: "Timestamp",
    cell: ({ row }) => {
      const timestamp: number = row.getValue("timestamp");
      const formatted = new Date(timestamp).toLocaleString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });

      return <div className="font-medium">{formatted}</div>
    },
  },
  {
    accessorKey: "request.method",
    header: "Method",
  },
  {
    id: "request.path",
    accessorKey: "request.path",
    header: "Path",
    size: 50,
    maxSize: 100,
    minSize: 50,
    cell: ({ row }) => {
      const path: string = row.getValue("request.path");
      return (
        <TruncateWithTooltip text={path} width={200} />
      );
    },
  },
  {
    accessorKey: "request.version",
    header: "Version",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "size",
    header: "Size",
  },
  {
    accessorKey: "userAgent",
    header: "User Agent",
    cell: ({ row }) => {
      const userAgent: string = row.getValue("userAgent");
      return (
        <TruncateWithTooltip text={userAgent} width={200} />
      );
    },
  },
  {
    accessorKey: "note",
    header: "Note",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return (
        <AnomalyDetailsDialog anomaly={row.original} />
      )
    },
  },
]