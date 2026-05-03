"use client";

import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui";
import React, { useState } from "react";
import type { IDivision } from "@/types";
import { Edit2, Trash2 } from "lucide-react";

interface DivisionTableProps {
  divisions: IDivision[];
  onEdit: (division: IDivision) => void;
  onDelete: (id: string) => void;
}

export function DivisionTable({ divisions, onEdit, onDelete }: DivisionTableProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleDeleteConfirm = () => {
    if (deleteId) {
      onDelete(deleteId);
      setDeleteId(null);
    }
  };

  return (
    <>
    <Card className="gap-0 py-0 shadow-sm border-slate-200">
      <CardHeader className="px-5 py-5 sm:px-6">
        <CardTitle className="text-xl font-bold text-slate-900">Weight Divisions</CardTitle>
      </CardHeader>
      <CardContent className="px-0 pb-0">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/50 hover:bg-slate-50/50 border-b border-slate-200">
              <TableHead className="px-5 py-4 sm:px-6 font-semibold text-slate-700">Division Name</TableHead>
              <TableHead className="py-4 font-semibold text-slate-700">Fighters Count</TableHead>
              <TableHead className="py-4 font-semibold text-slate-700 text-center">Created At</TableHead>
              <TableHead className="pr-5 text-right sm:pr-6 font-semibold text-slate-700">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {divisions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-32 text-center text-slate-500">
                  No divisions found.
                </TableCell>
              </TableRow>
            ) : (
              divisions.map((division) => (
                <TableRow key={division.id} className="hover:bg-slate-50/50 transition-colors border-b border-slate-100">
                  <TableCell className="px-5 py-4 sm:px-6">
                    <span className="font-semibold text-slate-900">{division.name}</span>
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                      {division._count?.fighters || 0} Fighters
                    </div>
                  </TableCell>
                  <TableCell className="py-4 text-center text-sm text-slate-600">
                    {new Date(division.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="py-4 pr-5 text-right sm:pr-6">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-slate-600 hover:text-primary hover:bg-primary/10"
                        onClick={() => onEdit(division)}
                      >
                        <Edit2 className="size-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-slate-600 hover:text-rose-600 hover:bg-rose-50"
                        onClick={() => setDeleteId(division.id)}
                      >
                        <Trash2 className="size-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>

      <Dialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-slate-900">Confirm Deletion</DialogTitle>
            <DialogDescription className="text-slate-500 pt-2">
              Are you sure you want to delete this division? This action cannot be undone and may affect associated fighters.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-6 gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setDeleteId(null)}
              className="border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              className="bg-rose-600 hover:bg-rose-700 shadow-sm"
            >
              Delete Division
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
