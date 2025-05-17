import type { NetworkLog } from "@/types";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function parseNetworkLogs(): Promise<NetworkLog[]> {
  try {
    const response = await fetch("/src/assets/access.log");
    const text = await response.text();
    const lines = text.split("\n").filter(line => line.trim() !== "");

    const networkLogs: NetworkLog[] = [];

    for (const line of lines) {
      // Regular expression to match NGINX log format
      const regex =
        /^(\S+) - - \[(.*?)\] "(\S+) (\S+) (\S+)" (\d+) (\d+) ".*?" "([^"]*)"$/;
      const match = line.match(regex);

      if (match) {
        const [, ip, dateStr, method, path, version, status, size, userAgent] =
          match;

        // Convert date string to timestamp
        const timestamp = new Date(dateStr.replace(":", " ")).getTime();

        networkLogs.push({
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

    console.log(`Parsed ${networkLogs.length} logs successfully`);
    return networkLogs;
  } catch (error) {
    console.error("Error parsing network logs:", error);
    // If parsing fails, return mock data as fallback
    return [];
  }
}
