import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ClipboardPaste } from "lucide-react";

interface JobDescriptionModalProps {
  open: boolean;
  onClose: () => void;
  jdDraft: string;
  setJdDraft: (value: string) => void;
  onClear: () => void;
  onSave: () => void;
  pasteFromClipboard: () => void;
}

export function JobDescriptionModal({
  open,
  onClose,
  jdDraft,
  setJdDraft,
  onClear,
  onSave,
  pasteFromClipboard,
}: JobDescriptionModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-2xl rounded-md">
        <DialogHeader>
          <DialogTitle>Add Job Description</DialogTitle>
          <DialogDescription>
            Paste the job description to match your resume against it. This
            enables keyword comparison and costs 2.5 credits instead of 1.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <Button
            variant="outline"
            size="sm"
            type="button"
            onClick={pasteFromClipboard}
            className="text-xs"
          >
            <ClipboardPaste className="w-3.5 h-3.5 mr-1.5" />
            Paste from Clipboard
          </Button>
          <textarea
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
            rows={10}
            placeholder="Paste the job description here..."
            value={jdDraft}
            onChange={(e) => setJdDraft(e.target.value)}
            autoFocus
          />
        </div>
        <DialogFooter className="gap-2">
          <Button variant="ghost" onClick={onClear}>
            Clear & Close
          </Button>
          <Button onClick={onSave} disabled={!jdDraft.trim()}>
            Apply Job Description
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
