import { useEffect, useState } from "react"
import { Pie, PieChart, LabelList, ResponsiveContainer } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"
import { useNetworkLogs } from "@/NetworkLogsProvider"

// Type for the chart data
type StatusPieData = {
  status: string;
  value: number;
  fill: string;
  percent: number;
};

const chartConfig = {
  value: {
    label: "Requests",
  },
  "2xx": {
    label: "Success",
    color: "#10B981", // Green (Tailwind emerald-500)
  },
  "3xx": {
    label: "Redirection",
    color: "#F97316", // Orange (Tailwind orange-500)
  },
  "4xx": {
    label: "Client Error",
    color: "#EF4444", // Red (Tailwind red-500)
  },
  "5xx": {
    label: "Server Error",
    color: "#000000", // Black
  },
} satisfies ChartConfig;


export default function StatusPieChart() {
  const logs = useNetworkLogs();
  const [chartData, setChartData] = useState<StatusPieData[]>([]);

  useEffect(() => {
    type StatusCategory = "2xx" | "3xx" | "4xx" | "5xx";

    const statusCounts: Record<StatusCategory, number> = {
      "2xx": 0,
      "3xx": 0,
      "4xx": 0,
      "5xx": 0,
    };

    for (const log of logs) {
      const statusClass = Math.floor(log.status / 100);
      const key = `${statusClass}xx` as StatusCategory;

      if (statusCounts[key] !== undefined) {
        statusCounts[key]++;
      }
    }

    const total = Object.values(statusCounts).reduce((sum, count) => sum + count, 0);

    const pieData: StatusPieData[] = (
      Object.entries(statusCounts) as [StatusCategory, number][]
    ).map(([status, count]) => ({
      status,
      value: count,
      fill: chartConfig[status].color,
      percent: total > 0 ? (count / total) * 100 : 0,
    }));

    setChartData(pieData);
  }, [logs]);

  return (
    <Card className="@container/card w-full h-full">
      <CardHeader className="items-center">
        <CardTitle>HTTP Status Code Distribution</CardTitle>
        <CardDescription>January - June 2025</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 justify-center pb-0">
        <ChartContainer
          config={chartConfig}
          className="flex justify-center items-center">
          <div style={{ width: "100%", height: "100%" }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <ChartTooltip
                  content={<ChartTooltipContent nameKey="status" hideLabel />}
                />
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="status"
                  innerRadius={30}
                  strokeWidth={5}
                  labelLine={false}
                >
                  <LabelList
                    dataKey="percent"
                    position="inside"
                    className="fill-background"
                    stroke="none"
                    fontSize={12}
                    formatter={(value: number) => `${value.toFixed(1)}%`}
                  />
                </Pie>
                <ChartLegend
                  content={<ChartLegendContent nameKey="status" />}
                  layout="vertical"
                  align="right"
                  verticalAlign="middle"
                  className="flex flex-col gap-2 w-[80px] ml-2"
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="leading-none text-muted-foreground">
          Visualizing HTTP request status code distribution (2xx: Success, 3xx: Redirection, 4xx: Client Error, 5xx: Server Error) for performance monitoring
        </div>
      </CardFooter>
    </Card>
  );
}