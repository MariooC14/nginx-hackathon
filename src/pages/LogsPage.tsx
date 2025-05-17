import DataTable from "@/components/data-table";
import { TypographyH1 } from "@/components/ui/TypographyH1";

export default function LogsPage() {

  return (
    <>
      <TypographyH1 className="inline">Logs</TypographyH1>
      <div>
          <DataTable/>
      </div>
    </>
  );
};
