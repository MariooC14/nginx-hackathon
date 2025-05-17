import type {NetworkLog} from "@/types";
import {parseNetworkLogs} from "@/lib/utils";

export class NetworkLogService {
    private static instance: NetworkLogService;
    private logs: NetworkLog[] = [];

    private constructor() {
    }

    public static getInstance(): NetworkLogService {
        if (!NetworkLogService.instance) {
            NetworkLogService.instance = new NetworkLogService();
        }
        return NetworkLogService.instance;
    }

    async fetchLogs(): Promise<NetworkLog[]> {
        try {
            this.logs = await parseNetworkLogs();
            return this.logs;
        } catch (error) {
            console.error("Error fetching logs:", error);
            return [];
        }
    }

    filterLogs(predicate: (log: NetworkLog) => boolean): NetworkLog[] {
        return this.logs.filter(predicate);
    }

    updateLogNote(timestamp: number, ip: string, note: string): void {
        const logEntry = this.logs.find(log =>
            log.timestamp === timestamp && log.ip === ip
        );
        if (logEntry) {
            logEntry.note = note;
        }
    }

    markAsAnomaly(timestamp: number, ip: string, isAnomaly: boolean): void {
        const logEntry = this.logs.find(log =>
            log.timestamp === timestamp && log.ip === ip
        );
        if (logEntry) {
            logEntry.isAnomaly = isAnomaly;
        }
    }

    getAllLogs(): NetworkLog[] {
        return [...this.logs];
    }
}