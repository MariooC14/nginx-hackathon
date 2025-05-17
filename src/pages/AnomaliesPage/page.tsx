import { TypographyH1 } from "@/components/ui/TypographyH1";
import { AnomaliesDataTable } from "./data-table";
import { columns as anomaliesColumns } from "./columns";
import { useEffect, useState } from "react";
import { anomalyService, type Anomaly } from "@/services/AnomalyService";

export default function AnomaliesPage() {
  const [anomalyLogs, setAnomalyLogs] = useState<Anomaly[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const anomalies = anomalyService.scanForAnomalies();
    setAnomalyLogs(anomalies);
    setLoading(false);
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
