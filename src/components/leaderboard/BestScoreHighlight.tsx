"use client";

import { Card, CardContent } from "@/components/ui/card";
import { FaTrophy } from "react-icons/fa";
import { cn } from "@/lib/utils";

interface BestScoreHighlightProps {
  isNewBest: boolean;
  timeMs?: number;
  previousBestMs?: number;
  className?: string;
}

export function BestScoreHighlight({
  isNewBest,
  timeMs,
  previousBestMs,
  className,
}: BestScoreHighlightProps) {
  if (!isNewBest) return null;

  const formatTime = (ms: number) => (ms / 1000).toFixed(2) + "s";

  return (
    <Card
      className={cn(
        "border-primary/40 bg-primary/5",
        className
      )}
    >
      <CardContent className="flex items-center gap-4 p-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <FaTrophy className="h-5 w-5" />
        </div>
        <div>
          <p className="font-semibold text-foreground">New Best Score</p>
          <p className="text-sm text-muted-foreground">
            {timeMs !== undefined ? formatTime(timeMs) : ""}
            {previousBestMs !== undefined
              ? ` · Previous best ${formatTime(previousBestMs)}`
              : ""}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}