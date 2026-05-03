"use client";

import Link from "next/link";
import React, { useState } from "react";
import { Edit2, Trash2 } from "lucide-react";

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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getImageUrl } from "@/lib/utils";
import type { IFighter } from "@/types";
import { useDeleteFighter } from "@/hooks/use-fighters";

interface FightersTableProps {
  fighters: IFighter[];
}

function recordLabel(fighter: IFighter) {
  return `${fighter.wins}-${fighter.losses}-${fighter.draws}`;
}

export function FightersTable({ fighters }: FightersTableProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { mutate: deleteFighter, isPending: isDeleting } = useDeleteFighter();

  const handleDeleteConfirm = () => {
    if (deleteId) {
      deleteFighter(deleteId, {
        onSuccess: () => setDeleteId(null),
      });
    }
  };

  return (
    <>
      <Card className="gap-0 py-0 shadow-sm border-slate-200">
        <CardHeader className="px-5 py-5 sm:px-6">
          <CardTitle className="text-xl font-bold text-slate-900">Fighters</CardTitle>
        </CardHeader>
        <CardContent className="px-0 pb-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/50 hover:bg-slate-50/50 border-b border-slate-200">
                <TableHead className="px-5 py-4 sm:px-6 font-semibold text-slate-700">Fighter</TableHead>
                <TableHead className="py-4 font-semibold text-slate-700">Division</TableHead>
                <TableHead className="py-4 font-semibold text-slate-700">Record</TableHead>
                <TableHead className="py-4 font-semibold text-slate-700">Avg L5</TableHead>
                <TableHead className="py-4 font-semibold text-slate-700">Rank</TableHead>
                <TableHead className="py-4 font-semibold text-slate-700 text-center">Nationality</TableHead>
                <TableHead className="pr-5 text-right sm:pr-6 font-semibold text-slate-700">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fighters.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center text-slate-500">
                    No fighters found.
                  </TableCell>
                </TableRow>
              ) : (
                fighters.map((fighter) => (
                  <TableRow key={fighter.id} className="hover:bg-slate-50/50 transition-colors border-b border-slate-100">
                    <TableCell className="px-5 py-4 sm:px-6">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 border border-slate-200">
                          <AvatarImage src={getImageUrl(fighter.avatarUrl)} alt={fighter.name} />
                          <AvatarFallback className="bg-slate-100 text-slate-600 font-bold">
                            {fighter.name.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-900 leading-none">{fighter.name}</span>
                          {fighter.nickname && (
                            <span className="text-xs text-slate-500 mt-1 italic">"{fighter.nickname}"</span>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <span className="text-sm font-medium text-slate-700">
                        {fighter.division?.name || "-"}
                      </span>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="inline-flex items-center px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-xs font-semibold">
                        {recordLabel(fighter)}
                      </div>
                    </TableCell>
                    <TableCell className="py-4 font-bold text-slate-900">
                      {fighter.avgL5?.toLocaleString() || "0"}
                    </TableCell>
                    <TableCell className="py-4">
                      {fighter.rank ? (
                        <span className="font-bold text-primary">#{fighter.rank}</span>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </TableCell>
                    <TableCell className="py-4 text-center">
                      <span className="font-medium text-slate-700">{fighter.nationality}</span>
                    </TableCell>
                    <TableCell className="py-4 pr-5 text-right sm:pr-6">
                      <div className="flex justify-end gap-2">
                        <Link href={`/admin/fighters/edit?fighterId=${fighter.id}`}>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-slate-600 hover:text-primary hover:bg-primary/10"
                          >
                            <Edit2 className="size-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                        </Link>
                        {/* <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-slate-600 hover:text-rose-600 hover:bg-rose-50"
                          onClick={() => setDeleteId(fighter.id)}
                        >
                          <Trash2 className="size-4" />
                          <span className="sr-only">Delete</span>
                        </Button> */}
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
            <DialogTitle className="text-xl font-bold text-slate-900">Delete Fighter Profile</DialogTitle>
            <DialogDescription className="text-slate-500 pt-2">
              Are you sure you want to delete this fighter profile? This action cannot be undone and will remove all their bout history and statistics.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-6 gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setDeleteId(null)}
              className="border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              className="bg-rose-600 hover:bg-rose-700 shadow-sm"
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete Fighter"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
