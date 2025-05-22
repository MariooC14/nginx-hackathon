import { useEffect, useState } from "react"
import { Pie, PieChart, LabelList, Cell } from "recharts"

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
  value: { label: "Requests" },
  "2xx": { label: "Success", color: "#10b981" },
  "3xx": { label: "Redirection", color: "yellow" },
  "4xx": { label: "Client Error", color: "orange" },
  "5xx": { label: "Server Error", color: "red" },
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
        <CardDescription>April - May 2025</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 justify-center pb-0">
        <ChartContainer config={chartConfig} className="flex justify-center items-center w-full">
          <PieChart width={320} height={320}>
            {/* --- Gradients --- */}
            <defs>
              <linearGradient id="pie-2xx" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#34d399" />
                <stop offset="100%" stopColor="#10b981" />
              </linearGradient>
              <linearGradient id="pie-3xx" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#fdba74" />
                <stop offset="100%" stopColor="#f97316" />
              </linearGradient>
              <linearGradient id="pie-4xx" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#fca5a5" />
                <stop offset="100%" stopColor="#ef4444" />
              </linearGradient>
              <linearGradient id="pie-5xx" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#a1a1aa" />
                <stop offset="100%" stopColor="#000000" />
              </linearGradient>
            </defs>
            {/* --- Pie --- */}
            <ChartTooltip content={<ChartTooltipContent nameKey="status" hideLabel />} />
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="status"
              innerRadius="60%"      // Use percentage for proportional thickness
              outerRadius="100%"     // Use percentage for full size
              strokeWidth={1}
              labelLine={false}
              isAnimationActive={true}
              fill="#8884d8"
            >
              {chartData.map((entry, idx) => (
                <Cell key={`cell-${idx}`} fill={chartConfig[entry.status as "2xx" | "3xx" | "4xx" | "5xx"].color} />
              ))}
              <LabelList
                dataKey="percent"
                position="inside"
                className="fill-background text-muted-foreground font-semibold"
                stroke="none"
                fontSize={15}
                formatter={(value: number) => `${value.toFixed(1)}%`}
              />
            </Pie>
            <ChartLegend
              content={<ChartLegendContent nameKey="status" />}
              layout="vertical"
              align="right"
              verticalAlign="middle"
              className="!text-xs !gap-1 !mr-2 !w-[90px] max-w-[90px] flex flex-col"
            />
          </PieChart>
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