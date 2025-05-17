import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDate } from "@/lib/utils";
import type { Anomaly } from "@/services/AnomalyService";
import { MoreHorizontal } from "lucide-react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import TruncateWithTooltip from "@/components/TruncateWithTooltip";
import { useEffect, useState } from "react";
import { IPtoLocation, type LocationData } from "@/services/gpsService";
import GeoMap from "@/components/geoMap";

export default function AnomalyDetailsDrawer({ anomaly }: { anomaly: Anomaly }) {
  const [locations, setLocations] = useState<LocationData[]>([]);

  useEffect(() => {
    console.log("AnomalyDetailsDialog", anomaly);
    const uniqueIPs = [...new Set(anomaly.relatedLogs.map(log => log.ip))];

    console.log("Unique IPs", uniqueIPs);
    IPtoLocation(...uniqueIPs).then((locations) => {
      setLocations(locations);
    });
  }, []);

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreHorizontal />
        </Button>
      </DrawerTrigger>
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
          <GeoMap locations={locations} className="rounded w-3/5 m-auto" />
        </ScrollArea>
      </DrawerContent>
    </Drawer >
  )
};

function AnomalyRelatedLogsTable({ logs }: { logs: Anomaly['relatedLogs'] }) {
  return (
    <ScrollArea className="h-[400px] rounded-md border mb-6 max-w-full">
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