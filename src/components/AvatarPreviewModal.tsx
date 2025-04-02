"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ZoomIn, ZoomOut } from "lucide-react";
import { useState, useRef, useEffect } from "react";

const MIN_SCALE = 0.5;
const MAX_SCALE = 1.9;

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
  const [scale, setScale] = useState(1);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && scale !== 1) {
        e.preventDefault();
        setScale(1);
      }
    };

    if (isOpen) {
      window.addEventListener("keydown", handleEscape);
    }

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, scale]);

  const handleZoomIn = () => {
    setScale((prev) => Math.min(prev + 0.3, MAX_SCALE));
  };

  const handleZoomOut = () => {
    setScale((prev) => Math.max(prev - 0.2, MIN_SCALE));
  };

  const handleContainerClick = (e: React.MouseEvent) => {
    e.preventDefault();
    // Check if the click was on the image or zoom buttons
    if (
      imageRef.current?.contains(e.target as Node) ||
      (e.target as Element).closest(".zoom-buttons")
    ) {
      return;
    }
    setScale(1);
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={() => {
        if (scale !== 1) return;
        onClose();
      }}
      modal
    >
      <DialogContent className="max-w-2xl" onClick={handleContainerClick}>
        <DialogHeader>
          <DialogTitle>Profile Picture</DialogTitle>
        </DialogHeader>
        <div className="relative flex items-center justify-center">
          <div className="zoom-buttons absolute right-4 top-4 flex gap-2">
            <Button
              variant="secondary"
              size="icon"
              onClick={handleZoomOut}
              disabled={scale <= MIN_SCALE}
              className="rounded-full bg-white/80 text-black backdrop-blur-sm hover:bg-white"
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              onClick={handleZoomIn}
              disabled={scale >= MAX_SCALE}
              className="rounded-full bg-white/80 text-black backdrop-blur-sm hover:bg-white"
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
          </div>
          <img
            ref={imageRef}
            src={imageUrl}
            alt="Profile Preview"
            className="max-h-[500px] w-auto rounded-lg object-contain transition-transform duration-200"
            style={{ transform: `scale(${scale})` }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
