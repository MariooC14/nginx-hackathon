import NetworkChartsView from "@/services/NetworkChartsView.tsx";
import { TypographyH1 } from "@/components/ui/TypographyH1.tsx";

export default function DashboardPage() {
  return (
    <>
      <TypographyH1 className="inline text-primary">Dashboard</TypographyH1>
      <NetworkChartsView />
    </>
  )
};
