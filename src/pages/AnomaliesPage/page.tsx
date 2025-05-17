import { TypographyH1 } from "@/components/ui/TypographyH1";
import { AnomaliesDataTable } from "./data-table";
import { columns as anomaliesColumns } from "./columns";
import { useEffect, useState } from "react";
import { anomalyService, type Anomaly } from "@/services/AnomalyService";
import GeoMap from "@/components/geoMap.tsx";
import { IPtoLocation, type LocationData } from "@/services/gpsService.ts";

export default function AnomaliesPage() {
  const [anomalyLogs, setAnomalyLogs] = useState<Anomaly[]>([]);
  const [locations, setLocations] = useState<LocationData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const anomalies = anomalyService.scanForAnomalies();
    setAnomalyLogs(anomalies);
    setLoading(false);
  }, []);

  useEffect(() => {
    IPtoLocation("43.130.40.120", "185.198.228.124")
      .then(newLocations => setLocations(newLocations));
  }, []);

  return (
    <>
      <TypographyH1 className="inline">Anomalies</TypographyH1>
      <div>
        <AnomaliesDataTable columns={anomaliesColumns} data={anomalyLogs} loading={loading} />
      </div>
      <GeoMap locations={locations}></GeoMap>
    </>
  );
}
