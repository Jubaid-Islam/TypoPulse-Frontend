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

  const formatDate = (dateValue: string | number | null | undefined) => {
    if (!dateValue) return "Unknown date";

    let date: Date;
    if (typeof dateValue === "number") {
      date = new Date(dateValue);
    } else if (!isNaN(Number(dateValue)) && !isNaN(parseFloat(dateValue))) {
      date = new Date(Number(dateValue));
    } else {
      date = new Date(dateValue);
    }

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
        <CardContent className="flex h-48 flex-col items-center justify-center gap-1 text-muted-foreground text-center p-4">
          <p className="font-semibold text-foreground">No games played yet</p>
          <p className="text-xs sm:text-sm">Start a challenge to see your history here</p>
        </CardContent>
      </Card>
    );
  }

  const bestTimeMs = Math.min(...history.map((r) => r.totalTimeMs));

  return (
    <div className="space-y-3">
      {history.map((result) => {
        const isBest = result.totalTimeMs === bestTimeMs;
        return (
          <Card
            key={result.id}
            className={
              isBest
                ? "border-primary/50 shadow-sm bg-primary/[0.02]"
                : "border-border/60"
            }
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 p-3 sm:p-4 pb-2 sm:pb-3">
              <CardTitle className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-medium text-muted-foreground">
                <FiCalendar className="h-3.5 w-3.5 text-primary" />
                {formatDate(result.createdAt)}
              </CardTitle>
              {isBest && (
                <Badge className="gap-1 bg-white text-black text-[10px] sm:text-xs">
                  <FaTrophy className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                  Best
                </Badge>
              )}
            </CardHeader>
            <CardContent className="p-3 sm:p-4 pt-0">
              <div className="grid grid-cols-3 divide-x rounded-lg border bg-muted/20">
                <div className="flex flex-col items-center gap-0.5 sm:gap-1 py-2 sm:py-3">
                  <FaClock className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-muted-foreground" />
                  <span className="font-mono text-sm sm:text-base font-bold tabular-nums">
                    {formatTime(result.totalTimeMs)}
                  </span>
                  <span className="text-[10px] sm:text-xs text-muted-foreground">
                    Time
                  </span>
                </div>
                <div className="flex flex-col items-center gap-0.5 sm:gap-1 py-2 sm:py-3">
                  <FiTarget className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-muted-foreground" />
                  <span className="text-sm sm:text-base font-bold tabular-nums">
                    {result.accuracy.toFixed(0)}%
                  </span>
                  <span className="text-[10px] sm:text-xs text-muted-foreground">
                    Accuracy
                  </span>
                </div>
                <div className="flex flex-col items-center gap-0.5 sm:gap-1 py-2 sm:py-3">
                  <FiAlertCircle className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-destructive" />
                  <span className="text-sm sm:text-base font-bold tabular-nums text-destructive">
                    {result.wrongAttempts}
                  </span>
                  <span className="text-[10px] sm:text-xs text-muted-foreground">
                    Mistakes
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}