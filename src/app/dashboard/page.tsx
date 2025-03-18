"use client"
import { useEffect, useState } from "react";
import { AppSidebar } from "@/components/app-sidebar"
import ColumnDialog from "@/components/column-dialog"
import { ModeToggle } from "@/components/mode-toggle"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar"

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import {
    Dialog,
    DialogTrigger,
} from "@/components/ui/dialog"

import { db, doc, onSnapshot } from "@/utils/firebase";
import { useAuth } from "@/utils/useAuth";
import axios from "axios";
import API from "@/utils/axios";


interface TableColumn {
  name: string;
  dataType: string;
  order: number;
}

interface TableRowData {
  value: unknown; // Using `unknown` instead of `any` for better type safety
  columnId: number;
}

interface TableRow {
  data: TableRowData[];
  createdAt: string;
}

interface Table {
  _id: string;
  user: string; // Reference to User model
  columns: TableColumn[];
  rows: TableRow[];
  createdAt: string;
  updatedAt: string;
}

export default function Page() {
    const [columns, setColumns] = useState([]);
    const [rows, setRows] = useState([]);
    const [tables, setTables] = useState<Table[]>([]);

    const fetchTables = async () => {
        try {
            const response = await API.get('api/tables', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            setTables(response.data); 
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error('Error fetching tables:', error.response?.data || error.message);
            } else {
                console.error('Error fetching tables:', error);
            }
        }
    };

    useEffect(() => {
        const docRef = doc(db, "sheets", "data");

        const unsubscribe = onSnapshot(docRef, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.data();
                setColumns(data.columns || []);
                setRows(data.rows || []);
            }
        });

        return () => unsubscribe();
    }, []);

    const { isAuthenticated } = useAuth();

    useEffect(() => {
        if (isAuthenticated) {
            fetchTables();
            console.log(tables);
        }
    }, [isAuthenticated]);

    if (isAuthenticated === null) {
        return <p>Loading...</p>; // Show loading while checking auth
    }

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
                    <div className="flex items-center gap-2 px-4">
                        <SidebarTrigger className="-ml-1" />
                        <ModeToggle />
                        <Separator
                            orientation="vertical"
                            className="mr-2 data-[orientation=vertical]:h-4"
                        />
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem className="hidden md:block">
                                    <BreadcrumbLink href="#">
                                        Dashboard
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                </header>
                <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                    <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                        <div className="bg-muted/50 aspect-video rounded-xl flex justify-center items-center font-medium cursor-pointer " >
                            <Dialog>
                                <DialogTrigger asChild>
                                </DialogTrigger>
                                <ColumnDialog />
                            </Dialog>
                        </div>
                        <div className="bg-muted/50 aspect-video rounded-xl" />
                        <div className="bg-muted/50 aspect-video rounded-xl" />
                    </div>
                    <div className="bg-muted/50 flex-1 rounded-xl p-4">
                        <Table>
                            <TableCaption>Your Tables</TableCaption>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Table ID</TableHead>
                                    <TableHead>Columns</TableHead>
                                    <TableHead>Rows</TableHead>
                                    <TableHead>Created At</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {tables.map((table) => (
                                    <TableRow key={table._id}>
                                        <TableCell>{table._id}</TableCell>
                                        <TableCell>{table.columns.length}</TableCell>
                                        <TableCell>{table.rows.length}</TableCell>
                                        <TableCell>
                                            {new Date(table.createdAt).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => {
                                                    setColumns(table.columns.map(col => col.name));
                                                    setRows(table.rows);
                                                }}
                                            >
                                                View
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                    <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min p-4">
                    <Table>
                            <TableCaption>Live Google Sheets Data</TableCaption>
                            <TableHeader>
                                <TableRow>
                                    {columns.map((col, index) => (
                                        <TableHead key={index}>{col}</TableHead>
                                    ))}
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {rows.map((row, rowIndex) => (
                                    <TableRow key={rowIndex}>
                                        {columns.map((col, colIndex) => (
                                            <TableCell key={colIndex}>{row[col]}</TableCell>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
