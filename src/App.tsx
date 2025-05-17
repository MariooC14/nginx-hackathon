import Layout from "./components/layout";
import NetworkLogGrid from "./components/NetworkLogGrid";
import NetworkChartsView from "./components/NetworkChartsView";

function App() {
  return (
    <Layout>
      <h1 className="text-4xl inline m-4">Dashboard</h1>
      {/* Charts area */}
      <NetworkChartsView />

      {/* Table area */}
      <NetworkLogGrid />
    </Layout>
  );
}

export default App;
