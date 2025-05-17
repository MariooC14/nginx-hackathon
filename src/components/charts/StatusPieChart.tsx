

"use client"

import { useEffect, useState } from "react"
import { Pie, PieChart, LabelList } from "recharts"

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

const renderLegend = (props: { payload?: { value: string; color: string; payload: { value: number } }[] }) => {
  const { payload } = props;
  return (
    <ul className="flex flex-col gap-2">
      {payload?.map((entry, index) => (
        <li key={`item-${index}`} className="flex items-center gap-2">
          <span
            className="inline-block w-3 h-3 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-sm">
            {chartConfig[entry.value as keyof typeof chartConfig]?.label} ({entry.payload.value})
          </span>
        </li>
      ))}
    </ul>
  );
};

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
    <Card className="">
      <CardHeader className="items-center">
        <CardTitle>HTTP Status Code Distribution</CardTitle>
        <CardDescription>January - June 2025</CardDescription>
      </CardHeader>
      <CardContent className="pb-0">
        <ChartContainer
          config={chartConfig}
          className="max-h-[250px] flex justify-center items-center"
        >
          <PieChart width={350} height={250}>
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