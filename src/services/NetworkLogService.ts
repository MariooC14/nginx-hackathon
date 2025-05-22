import type { NetworkLog } from "@/types";

class NetworkLogService {
  private logs: NetworkLog[] = [];

  async init() {
    try {
      this.logs = await this.parseNetworkLogs();
    } catch (error) {
      console.error("Error fetching logs:", error);
    }
  }

  async parseNetworkLogs() {
    try {
      const response = await fetch(new URL("/src/assets/access.log", import.meta.url));
      const text = await response.text();
      const lines = text.split("\n").filter(line => line.trim() !== "");

      const networkLogs: NetworkLog[] = [];
      let id = 0;

      for (const line of lines) {
        // Regular expression to match NGINX log format
        const regex =
          /^(\S+) - - \[(.*?)\] "(\S+) (\S+) (\S+)" (\d+) (\d+) ".*?" "([^"]*)"$/;
        const match = line.match(regex);

        if (match) {
          const [
            ,
            ip,
            dateStr,
            method,
            path,
            version,
            status,
            size,
            userAgent,
          ] = match;

          // Convert date string to timestamp
          const timestamp = new Date(dateStr.replace(":", " ")).getTime();

          networkLogs.push({
            id: id++,
            ip,
            timestamp,
            request: {
              method,
              path,
              version,
            },
            status: parseInt(status),
            size: parseInt(size),
            userAgent,
            isAnomaly: false,
          });
        }
      }

      return networkLogs;
    } catch (error) {
      console.error("Error parsing network logs:", error);
      return [];
    }
  }

  getLogs() {
    return this.logs;
  }
}

export const networkLogService = new NetworkLogService();
