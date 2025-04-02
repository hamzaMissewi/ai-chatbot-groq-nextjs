"use client";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { IconType } from "react-icons/lib";
import React from "react";

interface ConfirmDialogProps {
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  ConfirmIcon?: React.ReactNode; // IconType | SVGSVGElement;
}

export const useConfirmDialog = ({
  title = "Are you sure?",
  description,
  //   description = "This action cannot be undone.",
  confirmText = "Confirm",
  cancelText = "Cancel",
  ConfirmIcon,
}: ConfirmDialogProps = {}) => {
  const [promise, setPromise] = useState<{
    resolve: (value: boolean) => void;
  } | null>(null);

  const confirm = () =>
    new Promise<boolean>((resolve) => {
      setPromise({ resolve });
    });

  const handleClose = () => {
    if (promise) {
      promise.resolve(false);
      setPromise(null);
    }
  };

  const handleConfirm = () => {
    if (promise) {
      promise.resolve(true);
      setPromise(null);
    }
  };

  const ConfirmDialog = () => (
    <Dialog open={promise !== null} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && (
            // <DialogDescription className="text-red-700">
            <DialogDescription className="text-base">
              {description}
            </DialogDescription>
          )}
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={handleClose}>
            {cancelText}
          </Button>
          <Button onClick={handleConfirm} className="flex items-center gap-1">
            {/* {confirmText} {ConfirmIcon && <ConfirmIcon />} */}
            {confirmText} {ConfirmIcon}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  return {
    confirm,
    ConfirmDialog,
  };
};
