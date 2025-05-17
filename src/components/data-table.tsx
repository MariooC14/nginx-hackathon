import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from "@/components/ui/table";

type Request = {
    method: string;
    path: string;
    version: string;
};

export type Data = {
    ip: string;
    timestamp: number;
    request: Request;
    status: number;
    size: number;
    userAgent: string;
};

function formatDate(ts: number) {
    return new Date(ts).toLocaleString();
}

type DataTableProps = {
    data: Data[];
};

export function DataTable({ data }: DataTableProps) {
    return (
        <div className="w-full p-4">
            <div className="w-full max-h-96 overflow-y-auto rounded border">
                <Table className="w-full">
                    <TableHeader>
                        <TableRow>
                            <TableHead>IP</TableHead>
                            <TableHead>Timestamp</TableHead>
                            <TableHead>Method</TableHead>
                            <TableHead>Path</TableHead>
                            <TableHead>Version</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Size</TableHead>
                            <TableHead>User Agent</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.map((row, idx) => (
                            <TableRow key={idx}>
                                <TableCell>{row.ip}</TableCell>
                                <TableCell>{formatDate(row.timestamp)}</TableCell>
                                <TableCell>{row.request.method}</TableCell>
                                <TableCell>{row.request.path}</TableCell>
                                <TableCell>{row.request.version}</TableCell>
                                <TableCell>{row.status}</TableCell>
                                <TableCell>{row.size}</TableCell>
                                <TableCell className="truncate max-w-xs">{row.userAgent}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}

export default DataTable;