import NetworkTrafficLineChart from "./charts/NetworkTrafficLineChart";
import StatusPieChart from "./charts/StatusPieChart";

export default function NetworkChartsView() {

  return (
    <>
        <h1>Charts</h1>
        <NetworkTrafficLineChart/>
        <StatusPieChart/>
    </>
  )
};
