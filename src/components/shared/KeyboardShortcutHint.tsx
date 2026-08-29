"use client";

import { Keyboard } from "lucide-react";
import { cn } from "@/lib/utils";

interface KeyboardShortcutHintProps {
  className?: string;
  shortcut?: string;
  description?: string;
}

export function KeyboardShortcutHint({
  className,
  shortcut = "Tab + Enter",
  description = "Press Tab + Enter to restart",
}: KeyboardShortcutHintProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 text-sm text-muted-foreground",
        className
      )}
    >
      <Keyboard className="h-4 w-4" />
      <span>
        <kbd className="rounded border bg-muted px-1.5 py-0.5 text-xs font-mono">
          {shortcut}
        </kbd>
        {" "}
        {description}
      </span>
    </div>
  );
}