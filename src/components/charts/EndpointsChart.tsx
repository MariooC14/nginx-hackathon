import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import TruncateWithTooltip from "../TruncateWithTooltip"
import { TrendingUp } from "lucide-react"

type EndpointsData = {
    endpoint: string;
    count: number;
};

const chartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
]


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
            accessibilityLayer
            data={data}
            layout="vertical"
            margin={{
              right: 16,
            }}
            width={400}
            height={220}
          >
            <CartesianGrid horizontal={false} />
            <YAxis
              dataKey="endpoint"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              hide
            />
            <XAxis dataKey="count" type="number" hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Bar
              dataKey="count"
              layout="vertical"
              fill="var(--color-desktop)"
              radius={7}
            >
              <LabelList
                dataKey="endpoint"
                position="insideLeft"
                offset={8}
                className="fill-foreground"
                fontSize={12}
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