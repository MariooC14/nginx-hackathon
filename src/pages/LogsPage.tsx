import DataTable from "@/components/data-table";
import { TypographyH1 } from "@/components/ui/TypographyH1";
import { useNetworkLogs } from "@/NetworkLogsProvider";

export default function LogsPage() {
  const logs = useNetworkLogs();

  return (
    <>
      <TypographyH1 className="inline">Logs</TypographyH1>
      <div>
        <DataTable data={logs} />
      </div>
    </>
  );
};
