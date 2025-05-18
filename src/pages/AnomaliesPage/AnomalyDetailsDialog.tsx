import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDate } from "@/lib/utils";
import { anomalyService, type Anomaly } from "@/services/AnomalyService";
import Markdown from 'react-markdown'
import {
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import TruncateWithTooltip from "@/components/TruncateWithTooltip";
import { useEffect, useState } from "react";
import { IPtoLocation, type LocationData } from "@/services/gpsService";
import GeoMap from "@/components/geoMap";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, LoaderPinwheel } from "lucide-react";

export default function AnomalyDetailsView({ anomaly }: { anomaly: Anomaly | null }) {
  const [locations, setLocations] = useState<LocationData[]>([]);

  useEffect(() => {
    if (!anomaly) return;
    const uniqueIPs = [...new Set(anomaly?.relatedLogs.map(log => log.ip))];

    IPtoLocation(...uniqueIPs).then((locations) => {
      setLocations(locations);
    });
  }, [anomaly]);

  if (!anomaly) {
    return null;
  }

  return (
    <DrawerContent>
      <DrawerHeader>
        <div className="flex w-full justify-between">
          <div>
            <DrawerTitle>Anomaly Details</DrawerTitle>
            <DrawerDescription>
              <strong>Reason:</strong> {anomaly.reason}<br />
              <strong>Note:</strong> {anomaly.note}<br /><br />
              <strong>Related Logs:</strong><br />
            </DrawerDescription>
          </div>
          <DrawerClose asChild><Button>Close</Button></DrawerClose>
        </div>
      </DrawerHeader>
      <ScrollArea className="h-[750px] rounded mb-6">
        <AnomalyRelatedLogsTable logs={anomaly.relatedLogs} />
        <div className="flex justify-between m-4 gap-2">
          <AIAnomalySuggestion anomaly={anomaly} />
          <GeoMap locations={locations} className="rounded flex-1" />
        </div>
      </ScrollArea>
    </DrawerContent>
  )
};

function AIAnomalySuggestion({ anomaly }: { anomaly: Anomaly }) {
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    setSuggestion(null);

    async function getAIAnalysis() {
      try {
        const analysis = await anomalyService.generateAnomalyAnalysis(anomaly);
        setSuggestion(analysis);
      } catch (error) {
        console.error("Error getting AI analysis:", error);
        setSuggestion("Failed to generate AI analysis. Please try again later.");
      } finally {
        setLoading(false);
      }
    }
    getAIAnalysis();
  }, [anomaly]);

  return (
    <Card className="flex-1 select-text">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Brain />AI Anomaly Suggestion</CardTitle>
      </CardHeader>
      <CardContent className="font-mono text-primary">
        {loading ? <div className="flex items-center gap-2">
          <LoaderPinwheel className="animate-spin" />
          Loading suggestion...
        </div>
          : <Markdown>{suggestion || "No suggestion available."}</Markdown>
        }
      </CardContent>
    </Card>
  )
}

function AnomalyRelatedLogsTable({ logs }: { logs: Anomaly['relatedLogs'] }) {
  return (
    <ScrollArea className="h-[350px] rounded-md border mb-6 mx-4 max-w-full">
      <table className="w-full overflow-x-scroll">
        <thead className="sticky top-0 bg-background">
          <tr className="border-b">
            <th className="p-2 text-left font-medium">IP</th>
            <th className="p-2 text-left font-medium">Time</th>
            <th className="p-2 text-left font-medium">Request</th>
            <th className="p-2 text-left font-medium">Status</th>
            <th className="p-2 text-left font-medium">User Agent</th>
          </tr>
        </thead>
        <tbody>
          {logs?.map((log) => (
            <tr key={log.id} className="border-b hover:bg-muted/50">
              <td className="p-2">{log.ip}</td>
              <td className="p-2">{formatDate(log.timestamp)}</td>
              <td className="p-2 max-w-[200px] truncate" title={`${log.request.method} ${log.request.path}`}>
                {log.request.method} {log.request.path}
              </td>
              <td className={`p-2 ${log.status >= 400 ? 'text-red-500' : 'text-green-500'}`}>
                {log.status}
              </td>
              <td className="p-2">
                <TruncateWithTooltip text={log.userAgent} width={750} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </ScrollArea>
  )
}