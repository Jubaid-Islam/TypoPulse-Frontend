"use client";

import { FaTimes } from "react-icons/fa";



interface TimerProps {
  timeMs: number;
  className?: string;
}

export function Timer({ timeMs, className }: TimerProps) {
  const seconds = timeMs / 1000;
  const displayTime = seconds.toFixed(2);

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <FaTimes className="h-5 w-5 text-muted-foreground" />
      <span className="text-2xl font-mono font-bold tabular-nums">
        {displayTime}s
      </span>
    </div>
  );
}