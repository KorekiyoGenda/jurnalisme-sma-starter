"use client";

import { useState } from 'react';
import { ChevronUp, ChevronDown, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

export interface Column<T> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  render?: (value: any, row: T) => React.ReactNode;
  width?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  selectable?: boolean;
  selectedIds?: string[];
  onSelectionChange?: (ids: string[]) => void;
  onRowAction?: (action: string, row: T) => void;
  actions?: { label: string; value: string }[];
  emptyMessage?: string;
  className?: string;
}

export function DataTable<T extends { id: string }>({
  data,
  columns,
  selectable = false,
  selectedIds = [],
  onSelectionChange,
  onRowAction,
  actions = [],
  emptyMessage = "No data available",
  className
}: DataTableProps<T>) {
  const [sortColumn, setSortColumn] = useState<keyof T | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const handleSort = (column: keyof T) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const sortedData = [...data].sort((a, b) => {
    if (!sortColumn) return 0;
    
    const aVal = String(a[sortColumn]);
    const bVal = String(b[sortColumn]);
    
    if (sortDirection === 'asc') {
      return aVal.localeCompare(bVal);
    } else {
      return bVal.localeCompare(aVal);
    }
  });

  const handleSelectAll = () => {
    if (selectedIds.length === data.length) {
      onSelectionChange?.([]); // Deselect all
    } else {
      onSelectionChange?.(data.map(row => row.id)); // Select all
    }
  };

  const handleSelectRow = (id: string) => {
    if (selectedIds.includes(id)) {
      onSelectionChange?.(selectedIds.filter(selectedId => selectedId !== id));
    } else {
      onSelectionChange?.([...selectedIds, id]);
    }
  };

  if (data.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={cn("overflow-hidden rounded-lg border border-border/50", className)}>
      <table className="data-table">
        <thead>
          <tr>
            {selectable && (
              <th className="w-12">
                <Checkbox
                  checked={selectedIds.length === data.length && data.length > 0}
                  onCheckedChange={handleSelectAll}
                />
              </th>
            )}
            {columns.map((column) => (
              <th
                key={String(column.key)}
                className={cn(
                  column.sortable && "cursor-pointer hover:bg-accent/30",
                  column.width && `w-[${column.width}]`
                )}
                onClick={() => column.sortable && handleSort(column.key)}
              >
                <div className="flex items-center gap-2">
                  {column.label}
                  {column.sortable && (
                    <div className="flex flex-col">
                      <ChevronUp 
                        className={cn(
                          "w-3 h-3 -mb-1",
                          sortColumn === column.key && sortDirection === 'asc' 
                            ? "text-primary" 
                            : "text-muted-foreground/50"
                        )} 
                      />
                      <ChevronDown 
                        className={cn(
                          "w-3 h-3",
                          sortColumn === column.key && sortDirection === 'desc' 
                            ? "text-primary" 
                            : "text-muted-foreground/50"
                        )} 
                      />
                    </div>
                  )}
                </div>
              </th>
            ))}
            {actions.length > 0 && (
              <th className="w-12">Actions</th>
            )}
          </tr>
        </thead>
        <tbody>
          {sortedData.map((row) => (
            <tr key={row.id} className="hover:bg-accent/30">
              {selectable && (
                <td>
                  <Checkbox
                    checked={selectedIds.includes(row.id)}
                    onCheckedChange={() => handleSelectRow(row.id)}
                  />
                </td>
              )}
              {columns.map((column) => (
                <td key={String(column.key)}>
                  {column.render 
                    ? column.render(row[column.key], row)
                    : String(row[column.key])
                  }
                </td>
              ))}
              {actions.length > 0 && (
                <td>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {actions.map((action) => (
                        <DropdownMenuItem
                          key={action.value}
                          onClick={() => onRowAction?.(action.value, row)}
                        >
                          {action.label}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}