import DataTable from "@/pages/LogsPage/data-table.tsx";
import { TypographyH1 } from "@/components/ui/TypographyH1.tsx";

export default function LogsPage() {

  return (
    <>
      <TypographyH1 className="inline text-primary">Logs</TypographyH1>
      <div>
          <DataTable/>
      </div>
    </>
  );
};
