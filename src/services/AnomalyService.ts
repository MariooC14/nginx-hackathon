import type { NetworkLog } from "@/types";
import { networkLogService } from "./NetworkLogService";

export interface Anomaly {
  id: string;
  reason: string;
  note: string;
  relatedLogs: NetworkLog[];
}

export class AnomalyService {
  constructor() {}

  async scanForAnomalies(): Promise<Anomaly[]> {
    const logs: NetworkLog[] = networkLogService.getLogs();
    const anomalies: Anomaly[] = [];

    // Example criteria: Frequent 5xx errors
    const errorLogs = logs.filter(log => log.status >= 500 && log.status < 600);
    if (errorLogs.length > 5) {
      anomalies.push({
        id: "frequent-5xx-errors",
        reason: "Frequent server errors detected",
        note: "More than 5 server errors (5xx) found in logs.",
        relatedLogs: errorLogs,
      });
    }

    // Example criteria: Multiple requests from same IP in short time
    const ipCount: Record<string, NetworkLog[]> = {};
    logs.forEach(log => {
      if (!ipCount[log.ip]) ipCount[log.ip] = [];
      ipCount[log.ip].push(log);
    });
    Object.entries(ipCount).forEach(([ip, ipLogs]) => {
      if (ipLogs.length > 10) {
        anomalies.push({
          id: `suspicious-activity-${ip}`,
          reason: "Suspicious activity from single IP",
          note: `More than 10 requests from IP ${ip} in the scanned period.`,
          relatedLogs: ipLogs,
        });
      }
    });

    return anomalies;
  }
}

export const anomalyService = new AnomalyService();
