import type { NetworkLog } from "@/types";
import { networkLogService } from "./NetworkLogService";
import { filterLogsByTime, type TimeFilter } from "./netstats";
import OpenAI from "openai";

export interface Anomaly {
  id: string;
  reason: string;
  note: string;
  relatedLogs: NetworkLog[];
}

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY || "",
  dangerouslyAllowBrowser: true,
});

export class AnomalyService {
  private anomaliesCache: Anomaly[] = [];

  scanForAnomalies(timeFilter: TimeFilter = "all") {
    // Check if anomalies have already been scanned
    if (this.anomaliesCache.length > 0) {
      return this.anomaliesCache;
    }

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
      // Bot activity detection
      this.detectBotActivity(ip, ipLogs, anomalies);
    });

    this.anomaliesCache = anomalies;
    this.markAsAnomaly(...anomalies.flatMap(anomaly => anomaly.relatedLogs));
    return anomalies;
  }
  /**
   * Detects suspicious bot activity based on several heuristics:
   * 1. Known bot user agents that shouldn't be crawling
   * 2. Sequential resource access patterns
   * 3. Excessive requests to sensitive resources
   */
  private detectBotActivity(
    ip: string,
    logs: NetworkLog[],
    anomalies: Anomaly[]
  ) {
    // Check for suspicious user agents
    const suspiciousUserAgents = [
      "scrapy",
      "wget",
      "curl",
      "python-requests",
      "go-http-client",
      "nikto",
      "nmap",
      "zgrab",
      "masscan",
      "slowhttptest",
      "bytespider",
      "petalbot",
      "gptbot",
      "bingbot",
    ];

    const suspiciousAgentLogs = logs.filter(log => {
      const userAgent = log.userAgent?.toLowerCase() || "";
      return suspiciousUserAgents.some(agent => userAgent.includes(agent));
    });

    if (suspiciousAgentLogs.length >= 3) {
      anomalies.push({
        id: `suspicious-bot-agent-${ip}`,
        reason: "Suspicious bot user agent detected",
        note: `IP ${ip} is using a known scraping/scanning tool user agent`,
        relatedLogs: suspiciousAgentLogs,
      });
    }

    // Check for sequential crawling patterns (accessing resources in sequence)
    if (logs.length >= 10) {
      const sortedByTime = [...logs].sort((a, b) => a.timestamp - b.timestamp);
      let sequentialPatterns = 0;

      for (let i = 0; i < sortedByTime.length - 1; i++) {
        const currentPath = sortedByTime[i].request.path || "";
        const nextPath = sortedByTime[i + 1].request.path || "";

        // Check if paths appear to be sequential
        if (
          (currentPath.match(/\d+/) &&
            nextPath.match(/\d+/) &&
            this.arePathsSequential(currentPath, nextPath)) ||
          // Common crawling pattern: parent dir then child resources
          nextPath.startsWith(currentPath + "/")
        ) {
          sequentialPatterns++;
        }
      }
      if (sequentialPatterns >= 5) {
        anomalies.push({
          id: `sequential-crawling-${ip}`,
          reason: "Sequential crawling pattern detected",
          note: `IP ${ip} is systematically accessing resources in sequence, likely a crawler`,
          relatedLogs: sortedByTime,
        });
      }
    }

    // Check for excessive 404s (trying to find resources that don't exist)
    const notFoundLogs = logs.filter(log => log.status === 404);
    if (notFoundLogs.length >= 10) {
      anomalies.push({
        id: `excessive-404s-${ip}`,
        reason: "Bot scanning for resources",
        note: `IP ${ip} generated ${notFoundLogs.length} 404 errors, likely scanning for vulnerabilities`,
        relatedLogs: notFoundLogs,
      });
    }

    // Check for access to sensitive paths
    const sensitivePatterns = [
      /admin/i,
      /login/i,
      /wp-admin/i,
      /config/i,
      /\.git/i,
      /\.env/i,
      /backup/i,
      /db/i,
      /api/i,
      /phpinfo/i,
      /phpMyAdmin/i,
    ];

    const sensitiveLogs = logs.filter(log => {
      const path = log.request.path || "";
      return sensitivePatterns.some(pattern => pattern.test(path));
    });

    if (sensitiveLogs.length >= 3) {
      anomalies.push({
        id: `sensitive-resource-scan-${ip}`,
        reason: "Sensitive resource scanning",
        note: `IP ${ip} is repeatedly accessing sensitive resources or admin paths`,
        relatedLogs: sensitiveLogs,
      });
    }
  }

  /**
   * Determines if two paths appear to be sequential (e.g., page-1, page-2)
   */
  private arePathsSequential(path1: string, path2: string): boolean {
    const num1 = parseInt((path1.match(/\d+/) || ["0"])[0]);
    const num2 = parseInt((path2.match(/\d+/) || ["0"])[0]);

    // Check if the base paths are the same (excluding numbers)
    const base1 = path1.replace(/\d+/g, "X");
    const base2 = path2.replace(/\d+/g, "X");

    return base1 === base2 && Math.abs(num2 - num1) <= 2;
  }

  async generateAnomalyAnalysis(anomaly: Anomaly) {
    try {
      const anomalyData = {
        reason: anomaly.reason,
        note: anomaly.note,
        ipAddresses: [
          ...new Set(anomaly.relatedLogs.map((log: NetworkLog) => log.ip)),
        ],
        statusCodes: [
          ...new Set(anomaly.relatedLogs.map((log: NetworkLog) => log.status)),
        ],
        paths: [
          ...new Set(
            anomaly.relatedLogs.map((log: NetworkLog) => log.request.path)
          ),
        ].slice(0, 5),
        userAgents: [
          ...new Set(
            anomaly.relatedLogs.map((log: NetworkLog) => log.userAgent)
          ),
        ].slice(0, 3),
        logsCount: anomaly.relatedLogs.length,
      };

      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "You are a cybersecurity expert analyzing NGINX logs for security anomalies. Provide concise analysis and actionable recommendations based on the detected anomaly. Keep your response under 150 words.",
          },
          {
            role: "user",
            content: `Analyze this NGINX log anomaly and provide expert recommendations:
            
            Anomaly type: ${anomalyData.reason}
            Details: ${anomalyData.note}
            IP addresses involved: ${anomalyData.ipAddresses.join(", ")}
            Status codes: ${anomalyData.statusCodes.join(", ")}
            Sample paths: ${anomalyData.paths.join(", ")}
            User agents: ${anomalyData.userAgents.join(", ")}
            Number of related logs: ${anomalyData.logsCount}`,
          },
        ],
        temperature: 0.7,
        max_tokens: 250,
      });

      return (
        response.choices[0].message.content || "Unable to generate analysis."
      );
    } catch (error) {
      console.error("Error generating OpenAI analysis:", error);
      return "Error generating AI analysis. Please try again later.";
    }
  }

  getAnomalies() {
    return this.anomaliesCache;
  }

  getAnomalyById(id: string) {
    return this.anomaliesCache.find(anomaly => anomaly.id === id);
  }

  // Mark logs as anomalies - to be used by the logs table
  private markAsAnomaly(...logs: NetworkLog[]) {
    for (const log of logs) {
      log.isAnomaly = true;
    }
  }
}

export const anomalyService = new AnomalyService();
