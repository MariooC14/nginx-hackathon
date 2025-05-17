import {NetworkLogService} from '../services/networkLogService';

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

export type TimeFilter = 'day' | 'week' | 'month' | 'all';

const getNetworkLogs = async () => {
    const networkLogService = NetworkLogService.getInstance();
    return await networkLogService.fetchLogs();
};

const filterLogsByTime = (logs: LogEntry[], timeFilter: TimeFilter): LogEntry[] => {
    if (timeFilter === 'all') return logs;

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
export const getUniqueVisitors = async (timeFilter: TimeFilter = 'all'): Promise<number> => {
    const logs = await getNetworkLogs();
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
export const getTopPaths = async (limit: number = 5, timeFilter: TimeFilter = 'all'): Promise<Array<{
    path: string;
    count: number
}>> => {
    const logs = await getNetworkLogs();
    const filteredLogs = filterLogsByTime(logs, timeFilter);
    const pathCounts = filteredLogs.reduce<Record<string, number>>((acc, log) => {
        const path = log.request.path;
        acc[path] = (acc[path] || 0) + 1;
        return acc;
    }, {});

    return Object.entries(pathCounts)
        .map(([path, count]) => ({path, count}))
        .sort((a, b) => b.count - a.count)
        .slice(0, limit);
};

/**
 * Number of requests
 * @param timeFilter Optional time period to analyze
 * @returns Total number of requests
 */
export const getTotalRequests = async (timeFilter: TimeFilter = 'all'): Promise<number> => {
    const logs = await getNetworkLogs();
    const filteredLogs = filterLogsByTime(logs, timeFilter);
    return filteredLogs.length;
};

/**
 * Total size of data served
 * @param timeFilter Optional time period to analyze
 * @returns Total size in bytes
 */
export const getTotalSize = async (timeFilter: TimeFilter = 'all'): Promise<number> => {
    const logs = await getNetworkLogs();
    const filteredLogs = filterLogsByTime(logs, timeFilter);
    return filteredLogs.reduce((total, log) => total + log.size, 0);
};

/**
 * Detect anomalies in logs and mark them
 * @param timeFilter Optional time period to analyze
 * @returns Updated logs with anomalies marked
 */
export const detectAnomalies = async (timeFilter: TimeFilter = 'all'): Promise<LogEntry[]> => {
    const networkLogService = NetworkLogService.getInstance();
    const logs = await getNetworkLogs();
    const filteredLogs = filterLogsByTime(logs, timeFilter);
    const updatedLogs = [...filteredLogs];

    // Group logs by IP
    const logsByIp = updatedLogs.reduce<Record<string, LogEntry[]>>((acc, log) => {
        if (!log.ip) return acc;
        acc[log.ip] = acc[log.ip] || [];
        acc[log.ip].push(log);
        return acc;
    }, {});

    Object.entries(logsByIp).forEach(([ip, ipLogs]) => {
        if (!ip) return;

        // Check for high frequency requests (more than 100 per minute)
        const timeWindowMs = 60000;
        const requestsPerMinute = new Map<number, number>();

        ipLogs.forEach(log => {
            const minute = Math.floor(log.timestamp / timeWindowMs);
            requestsPerMinute.set(minute, (requestsPerMinute.get(minute) || 0) + 1);
            const requestCount = requestsPerMinute.get(minute) || 0;
            if (requestCount > 100) {
                networkLogService.markAsAnomaly(log.timestamp, ip, true);
                networkLogService.updateLogNote(log.timestamp, ip, 'High frequency requests detected (>100/min)');
            }
        });

        // Check for error patterns
        let consecutiveErrors = 0;
        const errorCount = ipLogs.filter(log => log.status >= 400).length;
        const errorRate = errorCount / ipLogs.length;

        ipLogs.forEach(log => {
            if (log.status >= 400) {
                consecutiveErrors++;
                if (consecutiveErrors >= 5) {
                    networkLogService.markAsAnomaly(log.timestamp, ip, true);
                    networkLogService.updateLogNote(log.timestamp, ip, `${consecutiveErrors} consecutive errors detected`);
                }
                if (errorRate > 0.2) {
                    networkLogService.markAsAnomaly(log.timestamp, ip, true);
                    networkLogService.updateLogNote(log.timestamp, ip, `High error rate: ${(errorRate * 100).toFixed(1)}%`);
                }
            } else {
                consecutiveErrors = 0;
            }
        });
    });

    return networkLogService.getAllLogs();
};