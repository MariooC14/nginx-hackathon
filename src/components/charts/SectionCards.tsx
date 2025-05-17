import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { anomalyService, type Anomaly } from "@/services/AnomalyService";

import { getUniqueVisitors, getTotalRequests } from "@/services/netstats"
import { useState, useEffect } from "react"

export function SectionCards() {
    const [uniqueVisitors, setUniqueVisitors] = useState<number | null>(null);
    const [totalRequests, setTotalRequests] = useState<number | null>(null);
    const [anomalyCount, setAnomalyCount] = useState<number | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            const anomalies: Anomaly[] = anomalyService.getAnomalies();
            setAnomalyCount(anomalies.length);
            setUniqueVisitors(getUniqueVisitors());
            setTotalRequests(await getTotalRequests());
        };
        fetchData();
    }, [])

  return (
    <div className="grid grid-cols-3 col-span-3 row-span-2  gap-4 *:data-[slot=card]:shadow-xs *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card">
      <Card className="@container/card">
        <CardHeader className="flex flex-col items-center justify-center flex-1 relative text-center">
          <CardDescription>Unique Visitors</CardDescription>
          <CardTitle className="text-center @[250px]/card:text-3xl @[400px]/card:text-4xl text-2xl font-semibold tabular-nums">
            {uniqueVisitors !== null ? uniqueVisitors : "Loading..."}
          </CardTitle>
        </CardHeader>
      </Card>

      <Card className="@container/card h-full">
        <CardHeader className="flex flex-col items-center justify-center flex-1 relative text-center">
          <CardDescription>Total Requests</CardDescription>
          <CardTitle className="text-center @[250px]/card:text-3xl @[400px]/card:text-4xl text-2xl font-semibold tabular-nums">
            {totalRequests !== null ? totalRequests : "Loading..."}
          </CardTitle>
        </CardHeader>
      </Card>

      <Card className="@container/card">
        <CardHeader className="flex flex-col items-center justify-center flex-1 relative text-center">
          <CardDescription>Anomalies Found</CardDescription>
          <CardTitle className="text-center @[250px]/card:text-3xl @[400px]/card:text-4xl text-2xl font-semibold tabular-nums">
            {anomalyCount !== null ? anomalyCount : "Loading..."}
          </CardTitle>
        </CardHeader>
      </Card>
    </div>
  )
}
