import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { ChartConfig } from "@/components/ui/chart"

import {
  ChartContainer,
  ChartTooltip,
} from "@/components/ui/chart"
import { getTopPaths } from "@/services/netstats"
import { useEffect, useState } from "react"
import { BarChart, Bar, CartesianGrid, LabelList, XAxis, YAxis } from "recharts"
import TruncateWithTooltip from "../TruncateWithTooltip"

type EndpointsData = {
    endpoint: string;
    count: number;
};

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
  mobile: {
    label: "Mobile",
    color: "hsl(var(--chart-2))",
  },
  label: {
    color: "hsl(var(--background))",
  },
} satisfies ChartConfig

export function EndpointsChart() {
    const [data, setData] = useState<EndpointsData[]>([]);
    useEffect(() => {
        const topPaths = getTopPaths().map(({ path, count }) => ({
            endpoint: path,
            count,
        }));
        setData(topPaths);
    }, []);
  return (
    <Card className="@container/card w-full h-full">
      <CardHeader>
        <CardTitle>Top requested endpoints</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            data={data}
            layout="vertical"
            margin={{ right: 16 }} // left matches YAxis width
            width={400}
            height={220}
          >
            <CartesianGrid horizontal={false} strokeDasharray="3 3" />
            <YAxis
              dataKey="endpoint"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              width={180}
              tick={({ y, payload }) => (
                <g style={{ zIndex: 10 }}>
                  <foreignObject x={0} y={y - 12} width={160} height={24}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "left",
                        height: "24px",
                        width: "100%",
                        justifyContent: "flex-start",
                      }}
                    >
                      <span className="font-medium fill-[--color-label]">
                        <TruncateWithTooltip text={payload.value} width={140} />
                      </span>
                    </div>
                  </foreignObject>
                </g>
              )}
            />
            <XAxis dataKey="count" type="number" hide />
            <ChartTooltip
              cursor={false}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const { endpoint, count } = payload[0].payload;
                  return (
                    <div className="p-2">
                      <div>{endpoint}</div>
                      <div>Requests: {count}</div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar
              dataKey="count"
              layout="vertical"
              fill="var(--color-desktop)"
              radius={4}
            >
              <LabelList
                dataKey="count"
                position="right"
                offset={8}
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}