"use client";

import { useEffect, useState } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { ModeToggle } from "@/components/mode-toggle";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { toast } from "sonner"
import { useParams } from "next/navigation";
import API from "@/utils/axios";



interface Column {
  name: string;
  type: "text" | "date";
}
interface TableRowData {
  value: unknown; // Using `unknown` instead of `any` for better type safety
  columnId: number;
}
interface TableRow {
  data: TableRowData[];
  createdAt: string;
}

interface TableData {
  _id: string;
  columns: { name: string; dataType: "text" | "date"; order: number }[];
  rows: { _id: string; data: Record<string, string> }[];
}

export default function Page() {
  const [isLoading, setIsLoading] = useState(true);
  const [tableData, setTableData] = useState<TableData | null>(null);
  const [columns, setColumns] = useState<Column[]>([]);
  const [rows, setRows] = useState<Record<string, string>[]>([]);
  const [newColumnName, setNewColumnName] = useState("");
  const [newColumnType, setNewColumnType] = useState<"text" | "date">("text");
  const [isColumnDialogOpen, setIsColumnDialogOpen] = useState(false);
  const params = useParams();
  const tableId = params.tableId as string; 

  // Fetch table data
  useEffect(() => {
    const fetchTableData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await API.get(`/api/tables/${tableId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const data: TableData = response.data;
        
        setTableData(data);
        setColumns(data.columns.map(col => ({ name: col.name, type: col.dataType })));
        setRows(data.rows.map(row => row.data));
        setIsLoading(false);
      } catch (error) {
        toast.error("Failed to load table data");
        console.error("Error loading table data:", error);
        setIsLoading(false);
      }
    };
    fetchTableData();
  }, [tableId]);

  // Handle cell changes
  const handleCellChange = async (rowIndex: number, column: string, value: string) => {
    try {
      const rowId = tableData?.rows[rowIndex]?._id;
      if (!rowId || !tableId) return;

      const updatedRows = [...rows];
      updatedRows[rowIndex] = { ...updatedRows[rowIndex], [column]: value };
      setRows(updatedRows);

      await API.put(`/api/tables/${tableId}/rows`, {
        rowId,
        data: updatedRows[rowIndex]
      });
    } catch (error) {
      console.error("Error loading table data:", error);
      toast.error("Failed to update cell");
    }
  };

  // Add a new row
  const addRow = async () => {
    try {
      if (!tableId) return;

      const newRow: Record<string, string> = Object.fromEntries(
        columns.map((col) => [col.name, ""])
      );

      const response = await API.post(`/api/tables/${tableId}/rows`, {
        data: newRow
      });

      const updatedTable = response.data;
      setTableData(updatedTable);
      setRows(updatedTable.rows.map((row: TableRow) => row.data));
    } catch (error) {
      console.error("Error loading table data:", error);
      toast.error("Failed to add row");
    }
  };

  // Add a new column
  const addColumn = async () => {
    if (!newColumnName.trim() || !tableId) return;
    
    try {
      // Backend endpoint for adding column would need to be implemented
      const newColumns = [...columns, { name: newColumnName, type: newColumnType }];
      setColumns(newColumns);

      const updatedRows = rows.map((row) => ({
        ...row,
        [newColumnName]: "",
      }));
      setRows(updatedRows);

      setNewColumnName("");
      setIsColumnDialogOpen(false);
    } catch (error) {
      console.error("Error loading table data:", error);
      toast.error("Failed to add column");
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <ModeToggle />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="#">Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href="#">Sheets</BreadcrumbLink>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="flex justify-between">
            <Button onClick={addRow}>Add Row</Button>
            <Dialog open={isColumnDialogOpen} onOpenChange={setIsColumnDialogOpen}>
              <DialogTrigger asChild>
                <Button>Add Column</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Column</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col gap-3">
                  <Label htmlFor="column-name">Column Name</Label>
                  <Input id="column-name" value={newColumnName} onChange={(e) => setNewColumnName(e.target.value)} />
                  <Label>Column Type</Label>
                  <select
                    className="border p-2 rounded-md"
                    value={newColumnType}
                    onChange={(e) => setNewColumnType(e.target.value as "text" | "date")}
                  >
                    <option value="text">Text</option>
                    <option value="date">Date</option>
                  </select>
                </div>
                <DialogFooter>
                  <Button onClick={addColumn}>Add Column</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {/* Editable Table */}
          <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min p-4">
            <Table>
              <TableCaption>Live Table Data</TableCaption>
              <TableHeader>
                <TableRow>
                  {columns.map((col, index) => (
                    <TableHead key={index} className="font-semibold">
                      {col.name}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((row, rowIndex) => (
                  <TableRow key={rowIndex} className="hover:bg-muted/70">
                    {columns.map((col, colIndex) => (
                      <TableCell key={colIndex} className="p-2">
                        <Input
                          type={col.type === "date" ? "date" : "text"}
                          value={row[col.name]}
                          onChange={(e) =>
                            handleCellChange(rowIndex, col.name, e.target.value)
                          }
                          className="bg-background"
                        />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
