import DataServedChart from "./charts/DataServedChart";
import NetworkTrafficLineChart from "./charts/NetworkTrafficLineChart";
import StatusPieChart from "./charts/StatusPieChart";
import UniqueVisitorsChart from "./charts/UniqueVisitorsChart";

export default function NetworkChartsView() {

  return (
    <div className="m-8">
      <br />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <NetworkTrafficLineChart />
        <UniqueVisitorsChart />
        <DataServedChart />
        <StatusPieChart />
      </div>
    </div>
  )
};
