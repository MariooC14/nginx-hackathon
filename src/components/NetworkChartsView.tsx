import NetworkTrafficLineChart from "./charts/NetworkTrafficLineChart";
import StatusPieChart from "./charts/StatusPieChart";
import UniqueVisitorsChart from "./charts/UniqueVisitorsChart";
import DataServedChart from "./charts/DataServedChart";
import { SectionCards } from "./charts/SectionCards";
import { EndpointsChart } from "./charts/EndpointsChart";

export default function NetworkChartsView() {
  return (
    <div className="m-4 sm:m-8">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:grid-rows-2">
          <SectionCards />
          <div className="col-span-4">
            <EndpointsChart />
          </div>
        </div>

        <div>
          <StatusPieChart />
        </div>
        <div className="md:col-span-2">
          <NetworkTrafficLineChart />
        </div>
        <UniqueVisitorsChart />
        <DataServedChart />
      </div>
    </div>
  )
}
