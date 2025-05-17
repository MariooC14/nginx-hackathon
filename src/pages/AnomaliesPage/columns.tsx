import type { ColumnDef } from "@tanstack/react-table";
import type { Anomaly } from "@/services/AnomalyService";

export const columns: ColumnDef<Anomaly>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "reason",
    header: "Reason",
  },
  {
    accessorKey: "note",
    header: "Note",
  },
  {
    id: "actions",
    header: "Actions",
  },
]