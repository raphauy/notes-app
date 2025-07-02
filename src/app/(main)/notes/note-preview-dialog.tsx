"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Loader, Trash2 } from "lucide-react";
import { Doc } from "../../../../convex/_generated/dataModel";
import { useSearchParams } from "next/navigation";
import { api } from "../../../../convex/_generated/api";
import { useMutation } from "convex/react";
import { useState } from "react";
import { toast } from "sonner";


type NotePreviewDialogProps = {
  note: Doc<"notes">;
};

export function NotePreviewDialog({ note }: NotePreviewDialogProps) {
  const searchParams = useSearchParams();
  const isOpen = searchParams.get("noteId") === note._id;
  const [isDeleting, setIsDeleting] = useState(false);

  function handleClose() {
    window.history.pushState(null, "", window.location.pathname);
  }

  const deleteNote = useMutation(api.notes.deleteNote);

  async function handleDeleteNote() {
    setIsDeleting(true);
    try {
      await deleteNote({ noteId: note._id });
      toast.success("Note deleted");
      handleClose();
    } catch (error) {
      console.error("Failed to delete note", error);
      toast.error("Failed to delete note");
    } finally {
      setIsDeleting(false);
    }
  }
  
  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>{note.title}</DialogTitle>
        </DialogHeader>
        <div className="mt-4 whitespace-pre-wrap">{note.body}</div>
        <DialogFooter className="mt-6">
          <Button variant="destructive" className="gap-2" onClick={handleDeleteNote} disabled={isDeleting}>
            {isDeleting ? <Loader className="animate-spin" /> : <Trash2 />}
            "Delete Note"
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
