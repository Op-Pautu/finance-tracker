"use client";

import * as React from "react";
import { MoreHorizontal, Pencil, Trash2, Loader2, Undo2 } from "lucide-react";
import { toast } from "sonner";
import { deleteEmi, undoEmiPayment } from "@/lib/actions/emis";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { EmiDialog } from "@/components/emis/emi-dialog";
import type { Emi } from "@/types/db";

export function EmiActions({
  emi,
  canUndo,
}: {
  emi: Emi;
  canUndo: boolean;
}) {
  const [editOpen, setEditOpen] = React.useState(false);
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [deleting, setDeleting] = React.useState(false);

  async function handleUndo() {
    const res = await undoEmiPayment(emi.id);
    if (res.ok) toast.success("Reverted last payment");
    else toast.error(res.error);
  }

  async function handleDelete() {
    setDeleting(true);
    try {
      await deleteEmi(emi.id); // redirects to /emis
    } catch {
      setDeleting(false);
      toast.error("Couldn't delete the EMI");
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button variant="ghost" size="icon-sm" aria-label="EMI actions" />
          }
        >
          <MoreHorizontal className="size-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setEditOpen(true)}>
            <Pencil className="size-4" />
            Edit
          </DropdownMenuItem>
          {canUndo && (
            <DropdownMenuItem onClick={() => void handleUndo()}>
              <Undo2 className="size-4" />
              Undo last payment
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant="destructive"
            onClick={() => setDeleteOpen(true)}
          >
            <Trash2 className="size-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <EmiDialog open={editOpen} onOpenChange={setEditOpen} emi={emi} />

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {emi.name}?</AlertDialogTitle>
            <AlertDialogDescription>
              This removes the EMI and its payment progress. This can&apos;t be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={deleting}
              onClick={(e) => {
                e.preventDefault();
                void handleDelete();
              }}
            >
              {deleting && <Loader2 className="size-4 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
