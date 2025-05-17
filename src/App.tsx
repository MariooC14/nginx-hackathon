import Layout from "./components/layout";
import { useNetworkLogs } from "./NetworkLogsProvider";
import { useEffect } from "react";
import { getUniqueVisitors, getTopPaths, getTotalRequests, getTotalSize } from "./services/netstats";
import { Outlet } from "react-router";

function App() {
  const logs = useNetworkLogs();

  useEffect(() => {
    console.log("Network logs:", logs);
    console.log("Unique visitors", getUniqueVisitors());
    console.log("Total size ", getTotalSize());
    console.log("Total requests ", getTotalRequests());
    console.log("Top paths ", getTopPaths());
  }, [logs]);

  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}

export default App;
