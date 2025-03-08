"use client"
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Column = {
  name: string;
  type: "Text" | "Date";
};

export default function ColumnDialog() {
  const [columns, setColumns] = useState<Column[]>([]);
  const [numColumns, setNumColumns] = useState<number>(0);
  const [tableName, setTableName] = useState<string>("");

  const handleColumnChange = (index: number, key: keyof Column, value: string) => {
    const updatedColumns = [...columns];
    updatedColumns[index] = { ...updatedColumns[index], [key]: value };
    setColumns(updatedColumns);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="cursor-pointer w-full h-full">+ Create new table</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Specify Table Details</DialogTitle>
        </DialogHeader>
        <Input
          type="text"
          placeholder="Enter table name"
          value={tableName}
          onChange={(e) => setTableName(e.target.value)}
        />
        <Input
          type="number"
          placeholder="Enter number of columns"
          value={numColumns}
          onChange={(e) => {
            const count = parseInt(e.target.value, 10) || 0;
            setNumColumns(count);
            setColumns(new Array(count).fill({ name: "", type: "Text" }));
          }}
        />
        {columns.map((col, index) => (
          <div key={index} className="flex gap-2 mt-2">
            <Input
              placeholder="Column Name"
              value={col.name}
              onChange={(e) => handleColumnChange(index, "name", e.target.value)}
            />
            <Select
              value={col.type}
              onValueChange={(value) => handleColumnChange(index, "type", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Text">Text</SelectItem>
                <SelectItem value="Date">Date</SelectItem>
              </SelectContent>
            </Select>
          </div>
        ))}
        <Button className="mt-4">Create</Button>
      </DialogContent>
    </Dialog>
  );
}