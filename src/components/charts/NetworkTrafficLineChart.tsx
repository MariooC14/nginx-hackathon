import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

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
  const [timeRange, setTimeRange] = useState("30d");
  const logs = useNetworkLogs();

useEffect(() => {
  if (!logs.length) {
    setChartData([]);
    return;
  }

  const latestTimestamp = Math.max(...logs.map(l => l.timestamp));
  const referenceDate = new Date(latestTimestamp);

  if (timeRange === "24h") {
    // Group by hour for last 24 hours
    const endDate = new Date(referenceDate);
    const hours: string[] = [];
    const trafficByHour: Record<string, { desktop: number; mobile: number; bot: number }> = {};

    // Generate 24 hour slots
    for (let i = 0; i < 24; i++) {
      const hourDate = new Date(endDate);
      hourDate.setHours(endDate.getHours() - (23 - i), 0, 0, 0);
      const hourStr = hourDate.toISOString().slice(0, 13); // "YYYY-MM-DDTHH"
      hours.push(hourStr);
      trafficByHour[hourStr] = { desktop: 0, mobile: 0, bot: 0 };
    }

    // Process logs
    logs.forEach(log => {
      const logDate = new Date(log.timestamp);
      if (logDate >= new Date(endDate.getTime() - 23 * 60 * 60 * 1000)) {
        const hourStr = logDate.toISOString().slice(0, 13);
        if (trafficByHour[hourStr]) {
          const isMobile = /mobile|android|iphone|ipad|ipod/i.test(log.userAgent.toLowerCase());
          const isBot = log.userAgent.toLowerCase().includes("gptbot");
          
          if (isBot) trafficByHour[hourStr].bot += 1;
          else if (isMobile) trafficByHour[hourStr].mobile += 1;
          else trafficByHour[hourStr].desktop += 1;
        }
      }
    });
    // Create chart data with time labels
    const parsedData = hours.map(hourStr => ({
      date: hourStr + ":00",
      ...trafficByHour[hourStr],
      total: trafficByHour[hourStr].desktop + trafficByHour[hourStr].mobile + trafficByHour[hourStr].bot,
    }));

    setChartData(parsedData);
  } else {
    // Group by date for other time ranges
    const days = timeRange === "7d" ? 7 : 30;
    const startDate = new Date(referenceDate);
    startDate.setDate(startDate.getDate() - days + 1);

    const trafficByDate: Record<string, { desktop: number; mobile: number; bot: number }> = {};

    // Initialize date slots
    for (let i = 0; i < days; i++) {
      const d = new Date(startDate);
      d.setDate(startDate.getDate() + i);
      const dateStr = d.toISOString().split("T")[0];
      trafficByDate[dateStr] = { desktop: 0, mobile: 0, bot: 0 };
    }

    // Process logs
    logs.forEach(log => {
      const logDate = new Date(log.timestamp);
      const dateStr = logDate.toISOString().split("T")[0];
      
      if (logDate >= startDate && logDate <= referenceDate) {
        const isMobile = /mobile|android|iphone|ipad|ipod/i.test(log.userAgent.toLowerCase());
        const isBot = log.userAgent.toLowerCase().includes("gptbot");

        if (isBot) trafficByDate[dateStr].bot += 1;
        else if (isMobile) trafficByDate[dateStr].mobile += 1;
        else trafficByDate[dateStr].desktop += 1;
      }
    });

    // Convert to chart data
    const parsedData = Object.entries(trafficByDate)
      .map(([date, counts]) => ({
        date,
        ...counts,
        total: counts.desktop + counts.mobile + counts.bot,
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    setChartData(parsedData);
  }
}, [logs, timeRange]); // <-- Dependency array properly placed outside



  const referenceDate = new Date(1746200632000); // Last timestamp in the logs

  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date);
    let daysToSubtract = 30;
    if (timeRange === "7d") {
      daysToSubtract = 7;
    } else if (timeRange === "24h") {
      // Only include the last 24 hourly data points
      const startDate = new Date(referenceDate);
      startDate.setHours(startDate.getHours() - 23);
      return date >= startDate;
    }
    const startDate = new Date(referenceDate);
    startDate.setDate(startDate.getDate() - daysToSubtract);
    return date >= startDate;
  });


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
            <SelectItem value="24h" className="rounded-lg">
              Last 24 hours
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full">
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
                const date = new Date(value);
                if (timeRange === "24h") {
                  return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
                }
                return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
              }}
            />
            <YAxis domain={[0, 'auto']} tickLine={false} axisLine={false} />

            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    if(timeRange === "24h") {
                      return new Date(value).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
                    }
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
              type="monotone"
              fill="url(#fillBot)"
              stroke="var(--color-bot)"
              stackId="a"
            />
            <Area
              dataKey="mobile"
              type="monotone"
              fill="url(#fillMobile)"
              stroke="var(--color-mobile)"
              stackId="a"
            />
            <Area
              dataKey="desktop"
              type="monotone"
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
