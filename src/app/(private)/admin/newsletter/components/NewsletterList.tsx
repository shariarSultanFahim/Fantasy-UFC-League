"use client";

import { Edit, Trash2, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNewsletters, useDeleteNewsletter } from "@/lib/actions/newsletter";
import { INewsletter } from "@/types/newsletter";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { getImageUrl } from "@/lib/utils";

interface NewsletterListProps {
  onEdit: (newsletter: INewsletter) => void;
}

export function NewsletterList({ onEdit }: NewsletterListProps) {
  const { data, isLoading } = useNewsletters();
  const { mutate: deleteNewsletter } = useDeleteNewsletter();

  const handleDelete = (id: string) => {
    deleteNewsletter(id, {
      onSuccess: () => {
        toast.success("Newsletter deleted successfully.");
      },
      onError: (error: any) => {
        toast.error(error?.message || "Failed to delete newsletter.");
      },
    });
  };

  const newsletters = data?.data?.data || [];

  if (isLoading) {
    return (
      <Card className="flex h-64 items-center justify-center rounded-3xl border-slate-100 bg-white shadow-sm">
        <p className="text-slate-500">Loading newsletters...</p>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden rounded-3xl border-slate-100 bg-white shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="border-slate-50 hover:bg-transparent">
            <TableHead className="w-[100px] font-bold text-slate-500">Image</TableHead>
            <TableHead className="font-bold text-slate-500">Title</TableHead>
            <TableHead className="font-bold text-slate-500">Created At</TableHead>
            <TableHead className="text-right font-bold text-slate-500">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {newsletters.map((newsletter) => (
            <TableRow key={newsletter.id} className="border-slate-50 hover:bg-slate-50/50">
              <TableCell>
                <div className="relative h-12 w-20 overflow-hidden rounded-lg">
                  <Image
                    src={getImageUrl(newsletter.image) || "/demo.jpeg"}
                    alt={newsletter.title}
                    unoptimized
                    fill
                    className="object-cover"
                  />
                </div>
              </TableCell>
              <TableCell>
                <div className="max-w-md">
                  <p className="font-bold text-slate-900 truncate">{newsletter.title}</p>
                </div>
              </TableCell>
              <TableCell className="text-slate-500">
                {format(new Date(newsletter.createdAt), "MMM d, yyyy")}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    asChild
                    className="h-8 w-8 text-slate-400 hover:text-[#3dbcf9]"
                  >
                    <Link href={`/blog/${newsletter.id}`} target="_blank">
                      <ExternalLink className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(newsletter)}
                    className="h-8 w-8 text-slate-400 hover:text-green-500"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-slate-400 hover:text-red-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="rounded-3xl border-none bg-white">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-xl font-black text-slate-900">Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription className="text-slate-500">
                          This action cannot be undone. This will permanently delete the
                          newsletter post.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="rounded-full border-slate-100 font-bold text-slate-500 hover:bg-slate-50">Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(newsletter.id)}
                          className="rounded-full bg-red-500 font-bold text-white hover:bg-red-600"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </TableCell>
            </TableRow>
          ))}
          {newsletters.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} className="h-32 text-center text-slate-500">
                No newsletters found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Card>
  );
}
