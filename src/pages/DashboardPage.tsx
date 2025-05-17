import NetworkChartsView from "@/components/NetworkChartsView";
import { TypographyH1 } from "@/components/ui/TypographyH1";

export default function DashboardPage() {
  return (
    <>
      <TypographyH1 className="inline">Dashboard</TypographyH1>
      <NetworkChartsView />
    </>
  )
};
