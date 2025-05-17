import type { NetworkLog } from "@/types";
import { networkLogService } from "./NetworkLogService";
import { filterLogsByTime, type TimeFilter } from "./netstats";

export interface Anomaly {
  id: string;
  reason: string;
  note: string;
  relatedLogs: NetworkLog[];
}

export class AnomalyService {
  private anomaliesCache: Anomaly[] = [];

  scanForAnomalies(timeFilter: TimeFilter = "all") {
    const logs: NetworkLog[] = networkLogService.getLogs();
    const anomalies: Anomaly[] = [];
    const filteredLogs = filterLogsByTime(logs, timeFilter);

    // Group logs by IP
    const logsByIp = filteredLogs.reduce<Record<string, NetworkLog[]>>(
      (acc, log) => {
        if (!log.ip) return acc;
        acc[log.ip] = acc[log.ip] || [];
        acc[log.ip].push(log);
        return acc;
      },
      {}
    );

    // Frequent 5xx errors
    const errorLogs = logs.filter(log => log.status >= 500 && log.status < 600);
    if (errorLogs.length > 5) {
      anomalies.push({
        id: "frequent-5xx-errors",
        reason: "Frequent server errors detected",
        note: "More than 5 server errors (5xx) found in logs.",
        relatedLogs: errorLogs,
      });
    }

    // Check for anomalies in each IP group
    Object.entries(logsByIp).forEach(([ip, ipLogs]) => {
      // Check for high frequency requests (more than 100 per minute)
      const timeWindowMs = 60000;
      const requestsPerMinute = new Map<number, number>();

      ipLogs.forEach(log => {
        const minute = Math.floor(log.timestamp / timeWindowMs);
        requestsPerMinute.set(minute, (requestsPerMinute.get(minute) || 0) + 1);
        const requestCount = requestsPerMinute.get(minute) || 0;
        if (requestCount > 50) {
          anomalies.push({
            id: `high-frequency-requests-${ip}`,
            reason: "High frequency of requests detected",
            note: `More than 50 requests from IP ${ip} in a minute.`,
            relatedLogs: ipLogs,
          });
        }
      });
    });

    this.anomaliesCache = anomalies;
    return anomalies;
  }

  getAnomalies() {
    return this.anomaliesCache;
  }

  getAnomalyById(id: string) {
    return this.anomaliesCache.find(anomaly => anomaly.id === id);
  }
}

export const anomalyService = new AnomalyService();
