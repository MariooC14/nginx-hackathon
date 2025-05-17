import NetworkTrafficLineChart from "./charts/NetworkTrafficLineChart";
import StatusPieChart from "./charts/StatusPieChart";
import UniqueVisitorsChart from "./charts/UniqueVisitorsChart";
import DataServedChart from "./charts/DataServedChart";

export default function NetworkChartsView() {
  return (
    <div className="m-8">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <StatusPieChart />
        <StatusPieChart />
      </div>

      <div className="p-4 max-w">
        <NetworkTrafficLineChart />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <UniqueVisitorsChart />
          <DataServedChart />
      </div>
    </div>
  )
};
