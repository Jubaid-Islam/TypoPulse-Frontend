"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FaTrophy } from "react-icons/fa";
import {
  FiAlertCircle,
  FiClock,
  FiTarget,
  FiTrendingDown,
  FiTrendingUp,
  FiRefreshCw,
} from "react-icons/fi";

interface GameResultProps {
  totalTimeMs: number;
  correctChars: number;
  wrongAttempts: number;
  accuracy: number;
  previousBestMs?: number | null;
  onPlayAgain: () => void;
  onViewLeaderboard: () => void;
}

export function GameResult({
  totalTimeMs,
  correctChars,
  wrongAttempts,
  accuracy,
  previousBestMs,
  onPlayAgain,
  onViewLeaderboard,
}: GameResultProps) {
  const isNewBest = previousBestMs ? totalTimeMs < previousBestMs : true;
  const totalSeconds = totalTimeMs / 1000;
  const diffSeconds = previousBestMs
    ? (previousBestMs - totalTimeMs) / 1000
    : null;

  return (
    <Card className="w-full max-w-2xl mx-auto overflow-hidden shadow-xl border-muted">
      <CardHeader className="space-y-2 pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl sm:text-2xl font-bold">Game Results</CardTitle>
          {isNewBest ? (
            <Badge className="gap-1 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold">
              <FaTrophy className="h-3 w-3" />
              New Best
            </Badge>
          ) : (
            <Badge variant="secondary" className="gap-1">
              <FiAlertCircle className="h-3 w-3" />
              Challenge Complete
            </Badge>
          )}
        </div>
        <CardDescription className="text-xs sm:text-sm">
          {isNewBest
            ? "Congratulations! You beat your previous best time."
            : "Great effort! Practice more to beat your best score."}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Hero Metric */}
        <div className="flex flex-col items-center justify-center rounded-xl border bg-muted/30 py-6 sm:py-8 shadow-inner">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Final Time
          </span>
          <span className="mt-1 text-4xl sm:text-5xl md:text-6xl font-extrabold font-mono tabular-nums text-primary">
            {totalSeconds.toFixed(2)}s
          </span>
          {diffSeconds !== null && (
            <span
              className={
                "mt-2 flex items-center gap-1 text-xs sm:text-sm font-medium px-3 py-1 rounded-full " +
                (diffSeconds >= 0
                  ? "bg-green-500/10 text-green-600"
                  : "bg-muted text-muted-foreground")
              }
            >
              {diffSeconds >= 0 ? (
                <FiTrendingUp className="h-3.5 w-3.5" />
              ) : (
                <FiTrendingDown className="h-3.5 w-3.5" />
              )}
              {diffSeconds >= 0
                ? `${diffSeconds.toFixed(2)}s faster than best`
                : `${Math.abs(diffSeconds).toFixed(2)}s slower than best`}
            </span>
          )}
        </div>

        {/* Secondary Stats Grid */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4">
          <div className="flex flex-col items-center justify-center gap-1 rounded-xl bg-muted/40 p-2.5 sm:p-4 text-center border">
            <FiTarget className="h-4 w-4 text-primary" />
            <span className="text-lg sm:text-2xl font-bold tabular-nums">
              {accuracy.toFixed(0)}%
            </span>
            <span className="text-[10px] sm:text-xs text-muted-foreground font-medium">
              Accuracy
            </span>
          </div>
          <div className="flex flex-col items-center justify-center gap-1 rounded-xl bg-muted/40 p-2.5 sm:p-4 text-center border">
            <FiClock className="h-4 w-4 text-primary" />
            <span className="text-lg sm:text-2xl font-bold tabular-nums">
              {correctChars}
            </span>
            <span className="text-[10px] sm:text-xs text-muted-foreground font-medium">
              Correct
            </span>
          </div>
          <div className="flex flex-col items-center justify-center gap-1 rounded-xl bg-muted/40 p-2.5 sm:p-4 text-center border">
            <FiAlertCircle className="h-4 w-4 text-destructive" />
            <span className="text-lg sm:text-2xl font-bold tabular-nums text-destructive">
              {wrongAttempts}
            </span>
            <span className="text-[10px] sm:text-xs text-muted-foreground font-medium">
              Mistakes
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Button
            onClick={onPlayAgain}
            variant="outline"
            size="lg"
            className="w-full sm:flex-1 gap-2 font-medium"
          >
            <FiRefreshCw className="h-4 w-4" />
            Play Again
          </Button>
          <Button
            onClick={onViewLeaderboard}
            size="lg"
            className="w-full sm:flex-1 gap-2 font-semibold shadow-md"
          >
            <FaTrophy className="h-4 w-4" />
            Leaderboard
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}