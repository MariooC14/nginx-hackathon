import NetworkTrafficLineChart from "../components/charts/NetworkTrafficLineChart.tsx";
import StatusPieChart from "../components/charts/StatusPieChart.tsx";
import UniqueVisitorsChart from "../components/charts/UniqueVisitorsChart.tsx";
import DataServedChart from "../components/charts/DataServedChart.tsx";
import { SectionCards } from "../components/charts/SectionCards.tsx";
import { EndpointsChart } from "../components/charts/EndpointsChart.tsx";

export default function NetworkChartsView() {
  return (
    <div className="m-8">
      <div className="grid grid-cols-2 gap-4">
        <div className="grid grid-rows-2 w-full gap-4 grid-cols-3">
          <SectionCards />
          <div className="col-span-4">
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
