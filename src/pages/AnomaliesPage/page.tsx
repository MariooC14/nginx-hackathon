import { TypographyH1 } from "@/components/ui/TypographyH1";
import { AnomaliesDataTable } from "./data-table";
import { columns as anomaliesColumns } from "./columns";
import { useEffect, useState } from "react";
import { anomalyService, type Anomaly } from "@/services/AnomalyService";
import { Drawer } from "@/components/ui/drawer";
import AnomalyDetailsView from "./AnomalyDetailsDialog";

export default function AnomaliesPage() {
  const [anomalyLogs, setAnomalyLogs] = useState<Anomaly[]>([]);
  const [selectedAnomaly, setSelectedAnomaly] = useState<Anomaly | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const anomalies = anomalyService.scanForAnomalies();
    setAnomalyLogs(anomalies);
    setLoading(false);
  }, []);

  return (
    <>
      <TypographyH1 className="inline">Anomalies</TypographyH1>
      <Drawer>
        <AnomalyDetailsView anomaly={selectedAnomaly} />
        <AnomaliesDataTable columns={anomaliesColumns} data={anomalyLogs} loading={loading} onSelect={setSelectedAnomaly} />
      </Drawer>
    </>
  );
}
