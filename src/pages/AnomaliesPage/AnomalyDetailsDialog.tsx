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
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import TruncateWithTooltip from "@/components/TruncateWithTooltip";

export default function AnomalyDetailsDialog({ anomaly }: { anomaly: Anomaly }) {

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreHorizontal />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Anomaly Details</DrawerTitle>
          <DrawerDescription>
            <p><strong>Reason:</strong> {anomaly.reason}</p>
            <p><strong>Note:</strong> {anomaly.note}</p>
            <br />
            <p><strong>Related Logs:</strong></p>
          </DrawerDescription>
          <AnomalyRelatedLogsTable logs={anomaly.relatedLogs} />
        </DrawerHeader>
        <DrawerFooter>
          <DrawerClose>
            <Button variant="secondary">
              Close
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer >
  )
};

function AnomalyRelatedLogsTable({ logs }: { logs: Anomaly['relatedLogs'] }) {
  return (
    <ScrollArea className="h-[350px] rounded-md border mt-2">
      <table className="w-full">
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