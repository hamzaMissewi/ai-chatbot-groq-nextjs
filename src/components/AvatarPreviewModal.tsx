"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
// import { useState } from "react";

interface AvatarPreviewModalProps {
  imageUrl: string;
  isOpen: boolean;
  onClose: () => void;
}

export function AvatarPreviewModal({
  imageUrl,
  isOpen,
  onClose,
}: AvatarPreviewModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Profile Picture</DialogTitle>
        </DialogHeader>
        <div className="flex items-center justify-center">
          <img
            src={imageUrl}
            alt="Profile Preview"
            className="max-h-[500px] w-auto rounded-lg object-contain"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
