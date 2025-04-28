"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

interface MobileTabModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  children: React.ReactNode;
}

export default function MobileTabModal({
  open,
  onOpenChange,
  title,
  children,
}: MobileTabModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogTitle>{title}</DialogTitle>
        <div className="mt-4">{children}</div>
      </DialogContent>
    </Dialog>
  );
}
