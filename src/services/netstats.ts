import type { NetworkLog } from "@/types";
import { networkLogService } from "../services/NetworkLogService";

export type LogEntry = {
  ip: string;
  timestamp: number;
  request: {
    method: string;
    path: string;
    version: string;
  };
  status: number;
  size: number;
  userAgent: string;
  isAnomaly: boolean;
  note?: string;
};

export type TimeFilter = "day" | "week" | "month" | "all";

export const filterLogsByTime = (
  logs: NetworkLog[],
  timeFilter: TimeFilter
) => {
  if (timeFilter === "all") return logs;

  const now = Date.now();
  const filters = {
    day: now - 86400000, // 24 hours
    week: now - 604800000, // 7 days
    month: now - 2592000000, // 30 days
  };

  return logs.filter(log => log.timestamp >= filters[timeFilter]);
};

/**
 * Number of unique visitors based on IP addresses
 * @param timeFilter Optional time period to analyze
 * @returns Number of unique IP addresses found
 */
export const getUniqueVisitors = (timeFilter: TimeFilter = "all") => {
  const logs = networkLogService.getLogs();
  const filteredLogs = filterLogsByTime(logs, timeFilter);
  const uniqueIps = new Set(filteredLogs.map(log => log.ip));
  return uniqueIps.size;
};

/**
 * Most frequently accessed paths
 * @param limit Maximum number of paths to return (default: 5)
 * @param timeFilter Optional time period to analyze
 * @returns Array of paths and their access counts, sorted by count descending
 */
export const getTopPaths = (
  limit: number = 5,
  timeFilter: TimeFilter = "all"
): Array<{ path: string; count: number }> => {
  const logs = networkLogService.getLogs();
  const filteredLogs = filterLogsByTime(logs, timeFilter);
  const pathCounts = filteredLogs.reduce<Record<string, number>>((acc, log) => {
    const path = log.request.path;
    acc[path] = (acc[path] || 0) + 1;
    return acc;
  }, {});

  return Object.entries(pathCounts)
    .map(([path, count]) => ({ path, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
};

/**
 * Number of requests
 * @param timeFilter Optional time period to analyze
 * @returns Total number of requests
 */
export const getTotalRequests = async (timeFilter: TimeFilter = "all") => {
  const logs = networkLogService.getLogs();
  const filteredLogs = filterLogsByTime(logs, timeFilter);
  return filteredLogs.length;
};

/**
 * Total size of data served
 * @param timeFilter Optional time period to analyze
 * @returns Total size in bytes
 */
export const getTotalSize = async (timeFilter: TimeFilter = "all") => {
  const logs = networkLogService.getLogs();
  const filteredLogs = filterLogsByTime(logs, timeFilter);
  return filteredLogs.reduce((total, log) => total + log.size, 0);
};
