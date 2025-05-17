import Layout from "./components/layout";
import { Outlet } from "react-router";

function App() {

  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}

export default App;
