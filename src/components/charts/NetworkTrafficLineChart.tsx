import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useEffect, useState } from "react"
import { useNetworkLogs } from "@/NetworkLogsProvider"

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  bot: {
    label: "Bot",
    color: "orange",
  },
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
  mobile: {
    label: "Mobile",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

type NetworkTrafficData = {
  date: string;
  desktop: number;
  mobile: number;
  bot: number;
}
export default function NetworkTrafficLineChart() {
  const [chartData, setChartData] = useState<NetworkTrafficData[]>([]);
  const logs = useNetworkLogs();

  useEffect(() => {
    // Group logs by date and count occurrences
    const trafficByDate = logs.reduce<Record<string, { desktop: number; mobile: number; bot: number }>>((acc, log) => {
      const date = new Date(log.timestamp);
      const formattedDate = date.toISOString().split("T")[0];

      if (!acc[formattedDate]) {
        acc[formattedDate] = { desktop: 0, mobile: 0, bot: 0 };
      }

      const isMobile = /mobile|android|iphone|ipad|ipod/i.test(log.userAgent.toLowerCase());
      const isBot = log.userAgent.toLowerCase().includes("gptbot");

      if (isBot) {
        acc[formattedDate].bot += 1;
      } else if (isMobile) {
        acc[formattedDate].mobile += 1;
      } else {
        acc[formattedDate].desktop += 1;
      }

      return acc;
    }, {});

    // Convert to array format needed for the chart
    const parsedData = Object.entries(trafficByDate).map(([date, counts]) => ({
      date,
      desktop: counts.desktop,
      mobile: counts.mobile,
      bot: counts.bot,
      total: counts.desktop + counts.mobile + counts.bot,
    }));

    // Sort by date
    parsedData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    setChartData(parsedData);
  }, [logs]);

  const [timeRange, setTimeRange] = useState("30d");

  const referenceDate = new Date(1746200632000); // Last timestamp in the logs

  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date)
    let daysToSubtract = 30
    if (timeRange === "7d") {
      daysToSubtract = 7
    }
    const startDate = new Date(referenceDate)
    startDate.setDate(startDate.getDate() - daysToSubtract)
    return date >= startDate
  })

  return (
    <Card>
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>Daily Traffic</CardTitle>
          <CardDescription>
            Showing total visitors for the last 3 months
          </CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger
            className="w-[160px] rounded-lg sm:ml-auto"
            aria-label="Select a value"
          >
            <SelectValue placeholder="Last 3 months" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="30d" className="rounded-lg">
              Last 30 days
            </SelectItem>
            <SelectItem value="7d" className="rounded-lg">
              Last 7 days
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillBot" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-bot)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-bot)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-desktop)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-desktop)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-mobile)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-mobile)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="bot"
              type="natural"
              fill="url(#fillBot)"
              stroke="var(--color-bot)"
              stackId="a"
            />
            <Area
              dataKey="mobile"
              type="natural"
              fill="url(#fillMobile)"
              stroke="var(--color-mobile)"
              stackId="a"
            />
            <Area
              dataKey="desktop"
              type="natural"
              fill="url(#fillDesktop)"
              stroke="var(--color-desktop)"
              stackId="a"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
