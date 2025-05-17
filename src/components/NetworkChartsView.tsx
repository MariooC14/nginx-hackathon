import NetworkTrafficLineChart from "./charts/NetworkTrafficLineChart";
import StatusPieChart from "./charts/StatusPieChart";
import UniqueVisitorsChart from "./charts/UniqueVisitorsChart";
import DataServedChart from "./charts/DataServedChart";
import { SectionCards } from "./charts/SectionCards";

export default function NetworkChartsView() {
  return (
    <div className="m-8">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <SectionCards />
        <div className="col-span-1">
          <StatusPieChart />
        </div>
        <div className="col-span-2">
          <NetworkTrafficLineChart />
        </div>
          <UniqueVisitorsChart />
          <DataServedChart />
      </div>
    </div>
  )
};
