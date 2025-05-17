import Layout from "./components/layout";
import NetworkLogGrid from "./components/NetworkLogGrid";
import NetworkChartsView from "./components/NetworkChartsView";
import { useNetworkLogs } from "./NetworkLogsProvider";
import { useEffect } from "react";
import { mockNetworkLogs } from "./mocks/networkLogMock";
import DataTable from "./components/data-table";

function App() {
  const logs = useNetworkLogs();

  useEffect(() => {
    console.log("Network logs:", logs);
  }, [logs]);

  return (
    <Layout>
      <h1 className="text-4xl inline m-4">Dashboard</h1>
      {/* Charts area */}
      <NetworkChartsView />

      {/* Table area */}
      <NetworkLogGrid />
        <div>
            <DataTable data={mockNetworkLogs} />
        </div>
    </Layout>
  );
}

export default App;
