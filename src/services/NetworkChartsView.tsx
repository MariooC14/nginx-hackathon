import NetworkTrafficLineChart from "../components/charts/NetworkTrafficLineChart.tsx";
import StatusPieChart from "../components/charts/StatusPieChart.tsx";
import UniqueVisitorsChart from "../components/charts/UniqueVisitorsChart.tsx";
import DataServedChart from "../components/charts/DataServedChart.tsx";
import { SectionCards } from "../components/charts/SectionCards.tsx";
import { EndpointsChart } from "../components/charts/EndpointsChart.tsx";

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
