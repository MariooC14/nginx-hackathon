import { useEffect, useState } from "react";
import Layout from "./components/layout";
import { Outlet } from "react-router";
import { networkLogService } from "./services/NetworkLogService";
import { anomalyService } from "./services/AnomalyService";

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function init() {
      await networkLogService.init();
      anomalyService.scanForAnomalies();
      setLoading(false);
    }
    init();
  }, []);

  return (
    <>
      {loading ? (
        <div className="w-screen h-screen flex justify-center items-center bg-accent">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-2">Loading...</span>
        </div>
      ) : (
        <Layout>
          <Outlet />
        </Layout>
      )}
    </>
  );
}

export default App;
