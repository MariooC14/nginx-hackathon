import { TypographyH1 } from "@/components/ui/TypographyH1";
import { AnomaliesDataTable } from "./data-table";
import { columns as anomaliesColumns } from "./columns";
import { detectAnomalies } from "@/services/netstats";
import { useEffect, useState } from "react";
import type { NetworkLog } from "@/types";

export default function AnomaliesPage() {
  const [anomalyLogs, setAnomalyLogs] = useState<NetworkLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    detectAnomalies()
      .then(logs => {
        setAnomalyLogs(logs.filter(log => log.isAnomaly));
      })
      .catch(error => {
        console.error("Error fetching network logs:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <>
      <TypographyH1 className="inline">Anomalies</TypographyH1>
      <div>
        <AnomaliesDataTable columns={anomaliesColumns} data={anomalyLogs} loading={loading} />
      </div>
    </>
  );
}
