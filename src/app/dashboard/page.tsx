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
    BreadcrumbPage,
    BreadcrumbSeparator,
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
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"


import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

import { db, doc, onSnapshot } from "@/utils/firebase";
import { Link } from "lucide-react";

export default function Page() {

    const [columns, setColumns] = useState([]);
    const [rows, setRows] = useState([]);

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
                                        Building Your Application
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator className="hidden md:block" />
                                <BreadcrumbItem>
                                    <BreadcrumbPage>Data Fetching</BreadcrumbPage>
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
                        <Button onClick={() => window.open("https://docs.google.com/spreadsheets/d/1HiMr_wyFFUi1Us0KNlI-XK51wjwSHQ3lagEzLgvHLak/edit?gid=0#gid=0", "_blank")}>
                            Open Sheet
                        </Button>

                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
