import NetworkTrafficLineChart from "./charts/NetworkTrafficLineChart";
import StatusPieChart from "./charts/StatusPieChart";
import UniqueVisitorsChart from "./charts/UniqueVisitorsChart";
import DataServedChart from "./charts/DataServedChart";
import { SectionCards } from "./charts/SectionCards";
import { EndpointsChart } from "./charts/EndpointsChart";

export default function NetworkChartsView() {
  return (
    <div className="m-8">
      <div className="grid grid-cols-2 gap-4">

        <div  className="grid grid-rows-2 w-full gap-4 grid-cols-3">
          <SectionCards />
          <div className="flex col-span-3">
            <EndpointsChart />
          </div>
        </div>

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
