"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const Dialog = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;
const DialogPortal = DialogPrimitive.Portal;
const DialogClose = DialogPrimitive.Close;

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn("fixed inset-0 z-50 bg-black/50 backdrop-blur-sm", className)}
    {...props}
  />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    {/*
      Centering wrapper: a full-viewport flex box that centers its one child.
      This replaces fixed+translate centering, which can behave inconsistently
      across desktop viewport sizes/zoom levels. pointer-events-none lets clicks
      in the empty padding area fall through to the overlay (closing the dialog);
      the Content re-enables pointer-events for itself.
    */}
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-6 pointer-events-none">
      <DialogPrimitive.Content
        ref={ref}
        className={cn(
          // Mobile: full-screen app-like sheet, no rounding, safe-area aware.
          // sm+: centered card, capped width/height, scrolls internally if content is tall.
          "pointer-events-auto flex flex-col w-full h-[100dvh] bg-card/95 backdrop-blur-xl overflow-y-auto no-scrollbar",
          "sm:w-[92vw] sm:max-w-lg sm:h-auto sm:max-h-[88vh]",
          "sm:rounded-2xl sm:border sm:border-border/60 sm:shadow-glass-lg",
          "px-5 sm:px-6",
          className
        )}
        {...props}
        asChild
      >
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="flex flex-col flex-1 gap-4 min-h-0"
        >
          {children}
          <DialogPrimitive.Close className="absolute right-4 top-[calc(env(safe-area-inset-top)+1.1rem)] sm:top-4 h-8 w-8 flex items-center justify-center rounded-lg bg-background/60 sm:bg-transparent opacity-80 hover:opacity-100 hover:bg-accent transition-opacity z-20">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        </motion.div>
      </DialogPrimitive.Content>
    </div>
  </DialogPortal>
));
DialogContent.displayName = DialogPrimitive.Content.displayName;

const DialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-1.5 text-left pr-8 shrink-0",
      "sticky top-0 -mx-5 sm:-mx-6 px-5 sm:px-6 pb-3 bg-card/95 backdrop-blur-xl z-10 border-b border-border/60",
      "pt-[calc(env(safe-area-inset-top)+1.25rem)] sm:pt-6",
      className
    )}
    {...props}
  />
);

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title ref={ref} className={cn("text-lg font-semibold leading-none", className)} {...props} />
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;

const DialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row gap-2 sm:gap-0 sm:justify-end sm:space-x-2 shrink-0",
      "sticky bottom-0 -mx-5 sm:-mx-6 px-5 sm:px-6 pt-3 bg-card/95 backdrop-blur-xl border-t border-border/60",
      "pb-[calc(env(safe-area-inset-bottom)+1rem)] sm:pb-6",
      "[&>button]:w-full sm:[&>button]:w-auto",
      className
    )}
    {...props}
  />
);

export {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
};
