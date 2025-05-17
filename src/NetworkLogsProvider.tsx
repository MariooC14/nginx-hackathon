import { createContext, useContext, type ReactNode } from "react";
import type { NetworkLog } from "./types";
import { networkLogService } from "./services/NetworkLogService";

const NetworkLogsContext = createContext<NetworkLog[]>([]);

export default function NetworkLogsProvider({ children }: { children: ReactNode }) {
  const networkLogs: NetworkLog[] = networkLogService.getLogs();

  return (
    <NetworkLogsContext.Provider value={networkLogs}>
      {children}
    </NetworkLogsContext.Provider>
  );
}

export function useNetworkLogs() {
  const context = useContext(NetworkLogsContext);
  if (!context) {
    throw new Error("useNetworkLogs must be used within a NetworkLogsProvider");
  }
  return context;
}
