"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GameResult } from "@/types";
import { FaClock, FaTrophy } from "react-icons/fa";
import { FiAlertCircle, FiTarget, FiCalendar } from "react-icons/fi";

interface HistoryListProps {
  history: GameResult[];
  isLoading?: boolean;
}

export function HistoryList({ history, isLoading = false }: HistoryListProps) {
  const formatTime = (ms: number) => {
    const seconds = ms / 1000;
    return seconds.toFixed(2) + "s";
  };

  const formatDate = (dateStr: string | null | undefined) => {
    if (!dateStr) return "Unknown date";
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return "Unknown date";
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="flex h-48 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex h-48 flex-col items-center justify-center gap-1 text-muted-foreground">
          <p className="font-medium">No games played yet</p>
          <p className="text-sm">Start a challenge to see your history here</p>
        </CardContent>
      </Card>
    );
  }

  const bestTimeMs = Math.min(...history.map((r) => r.totalTimeMs));

  // Pin the best-time entry to the top; keep everything else in the
  // order it was given (typically most-recent-first from the API).
  const bestEntry = history.find((r) => r.totalTimeMs === bestTimeMs);
  const restEntries = history.filter((r) => r !== bestEntry);
  const orderedHistory = bestEntry ? [bestEntry, ...restEntries] : history;

  return (
    <div className="space-y-3">
      {orderedHistory.map((result) => {
        const isBest = result.totalTimeMs === bestTimeMs;
        return (
          <Card key={result.id} className={isBest ? "border-primary/40" : undefined}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <FiCalendar className="h-3.5 w-3.5" />
                {formatDate(result.createdAt)}
              </CardTitle>
              {isBest && (
                <Badge className="gap-1">
                  <FaTrophy className="h-3 w-3" />
                  Best
                </Badge>
              )}
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-3 divide-x rounded-md border">
                <div className="flex flex-col items-center gap-1 py-3">
                  <FaClock className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="font-mono text-base font-semibold tabular-nums">
                    {formatTime(result.totalTimeMs)}
                  </span>
                  <span className="text-xs text-muted-foreground">Time</span>
                </div>
                <div className="flex flex-col items-center gap-1 py-3">
                  <FiTarget className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-base font-semibold tabular-nums">
                    {result.accuracy.toFixed(0)}%
                  </span>
                  <span className="text-xs text-muted-foreground">Accuracy</span>
                </div>
                <div className="flex flex-col items-center gap-1 py-3">
                  <FiAlertCircle className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-base font-semibold tabular-nums">
                    {result.wrongAttempts}
                  </span>
                  <span className="text-xs text-muted-foreground">Mistakes</span>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}