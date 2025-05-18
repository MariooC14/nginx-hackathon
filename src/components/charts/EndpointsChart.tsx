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
  ChartTooltipContent,
} from "@/components/ui/chart"
import { getTopPaths } from "@/services/netstats"
import { useEffect, useState } from "react"
import { BarChart, Bar, CartesianGrid, LabelList, XAxis, YAxis } from "recharts"

type EndpointsData = {
    endpoint: string;
    count: number;
};

const chartConfig = {} satisfies ChartConfig

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
      <CardContent className="p-2">
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={data}
            layout="vertical"
            margin={{ right: 8, top: 8, bottom: 8 }}
            width={260}
            height={120}
          >
            {/* --- Gradient --- */}
            <defs>
              <linearGradient id="bar-gradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#34d399" />
              </linearGradient>
            </defs>
            <CartesianGrid horizontal={false} />
            <YAxis dataKey="endpoint" type="category" tickLine={false} tickMargin={6} axisLine={false} hide />
            <XAxis dataKey="count" type="number" hide />
            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
            <Bar
              dataKey="count"
              layout="vertical"
              fill="url(#bar-gradient)" // 👈 Use the gradient here
              radius={5}
            >
              <LabelList
                dataKey="endpoint"
                position="insideLeft"
                offset={8}
                className="fill-background"
                fontSize={14}
              />
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