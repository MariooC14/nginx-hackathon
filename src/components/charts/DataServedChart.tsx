import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNetworkLogs } from "@/NetworkLogsProvider";
import { getTotalSize } from "@/services/netstats";
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

type DataServedData = {
  date: string;
  bytes: number;
};

const chartConfig = {
} satisfies ChartConfig

const TIME_FILTERS = [
  { label: "Last 24 hours", value: "24h", days: 1 },
  { label: "Last 7 days", value: "7d", days: 7 },
  { label: "Last 30 days", value: "30d", days: 30 },
];

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  return `${(bytes / 1024 / 1024 / 1024).toFixed(2)} GB`;
}

export default function DataServedChart() {
  const logs = useNetworkLogs();
  const [data, setData] = useState<DataServedData[]>([]);
  const [timeRange, setTimeRange] = useState("30d");

  useEffect(() => {
    if (!logs.length) {
      setData([]);
      return;
    }

    const latestTimestamp = Math.max(...logs.map(l => l.timestamp));
    const endDate = new Date(latestTimestamp);
    const filter = TIME_FILTERS.find(f => f.value === timeRange);
    const days = filter?.days ?? 30;

    if (timeRange === "24h") {
      // Group by hour for the last 24 hours
      const hours: string[] = [];
      const bytesByHour: Record<string, number> = {};
      for (let i = 0; i < 24; i++) {
        const hourDate = new Date(endDate);
        hourDate.setHours(endDate.getHours() - (23 - i), 0, 0, 0);
        const hourStr = hourDate.toISOString().slice(0, 13); // "YYYY-MM-DDTHH"
        hours.push(hourStr);
        bytesByHour[hourStr] = 0;
      }

      logs.forEach(log => {
        const logDate = new Date(log.timestamp);
        if (logDate >= new Date(endDate.getTime() - 23 * 60 * 60 * 1000)) {
          const hourStr = logDate.toISOString().slice(0, 13);
          if (bytesByHour[hourStr] !== undefined) {
            bytesByHour[hourStr] += log.size;
          }
        }
      });

      const chartData: DataServedData[] = hours.map(hourStr => ({
        date: hourStr + ":00",
        bytes: bytesByHour[hourStr] ?? 0,
      }));

      setData(chartData);
    } else {
      // Group by day
      const startDate = new Date(endDate);
      startDate.setDate(endDate.getDate() - days + 1);

      const bytesByDate: Record<string, number> = {};
      for (let i = 0; i < days; i++) {
        const d = new Date(startDate);
        d.setDate(startDate.getDate() + i);
        const dateStr = d.toISOString().split("T")[0];
        bytesByDate[dateStr] = 0;
      }

      logs.forEach(log => {
        const logDate = new Date(log.timestamp);
        if (logDate >= startDate && logDate <= endDate) {
          const dateStr = logDate.toISOString().split("T")[0];
          if (bytesByDate[dateStr] !== undefined) {
            bytesByDate[dateStr] += log.size;
          }
        }
      });

      const chartData: DataServedData[] = [];
      for (let i = 0; i < days; i++) {
        const d = new Date(startDate);
        d.setDate(startDate.getDate() + i);
        const dateStr = d.toISOString().split("T")[0];
        chartData.push({
          date: dateStr,
          bytes: bytesByDate[dateStr] ?? 0,
        });
      }

      setData(chartData);
    }
  }, [logs, timeRange]);

  return (
    <Card>
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>Data Served</CardTitle>
          <CardDescription>
            Total bytes served per {timeRange === "24h" ? "hour" : "day"}
          </CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[160px] rounded-lg sm:ml-auto" aria-label="Select a value">
            <SelectValue placeholder="Last 30 days" />
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
      <CardContent>
        <ChartContainer
        config={chartConfig}
        className="aspect-auto h-[250px] w-full"
        >
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={value => {
                if (timeRange === "24h") {
                  return new Date(value).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
                } else {
                  return new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" });
                }
              }}
            />
            <YAxis
              tickFormatter={formatBytes}
              allowDecimals={false}
            />
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
            <Line type="monotone" dataKey="bytes" stroke="#10b981" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}