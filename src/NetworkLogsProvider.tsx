import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { NetworkLog } from "./types";
import { parseNetworkLogs } from "./lib/utils";

const NetworkLogsContext = createContext<NetworkLog[]>([]);

export default function NetworkLogsProvider({ children }: { children: ReactNode }) {
  const [networkLogs, setNetworkLogs] = useState<NetworkLog[]>([]);

  useEffect(() => {
    parseNetworkLogs().then((logs) => {
      setNetworkLogs(logs);
    });
  }, []);

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
