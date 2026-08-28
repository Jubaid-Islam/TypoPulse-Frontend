"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LeaderboardEntry } from "@/types";
import { FaMedal, FaTrophy } from "react-icons/fa";
import { cn } from "@/lib/utils";

interface LeaderboardTableProps {
  entries: LeaderboardEntry[];
  isLoading?: boolean;
}

export function LeaderboardTable({
  entries,
  isLoading = false,
}: LeaderboardTableProps) {
  const formatTime = (ms?: number) => {
    if (ms === undefined || ms === null || isNaN(ms)) return "-";
    return (ms / 1000).toFixed(2) + "s";
  };

  if (isLoading) {
    return (
      <div className="flex h-48 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!entries || entries.length === 0) {
    return (
      <div className="flex h-48 flex-col items-center justify-center text-muted-foreground text-center p-4">
        <FaTrophy className="h-10 w-10 sm:h-12 sm:w-12 mb-3 opacity-40 text-yellow-500" />
        <p className="font-semibold text-foreground">No entries yet</p>
        <p className="text-xs sm:text-sm">Be the first to set a record!</p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto -mx-2 sm:mx-0">
      <Table className="w-full">
        <TableHeader>
          <TableRow className="text-xs sm:text-sm">
            <TableHead className="w-12 sm:w-16 text-center px-2 sm:px-4">Rank</TableHead>
            <TableHead className="px-2 sm:px-4">Player</TableHead>
            <TableHead className="text-right px-2 sm:px-4">Best Time</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {entries.map((entry, index) => {
            const rank = entry.rank ?? index + 1;
            const isTopThree = rank <= 3;

            return (
              <TableRow
                key={`${rank}-${entry.playerName ?? index}`}
                className={cn(
                  "text-xs sm:text-sm transition-colors",
                  isTopThree && "bg-muted/30 font-medium"
                )}
              >
                <TableCell className="text-center px-2 sm:px-4">
                  <div className="flex items-center justify-center">
                    {rank === 1 && (
                      <FaTrophy className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-yellow-500" />
                    )}
                    {rank === 2 && (
                      <FaMedal className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-slate-400" />
                    )}
                    {rank === 3 && (
                      <FaMedal className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-amber-600" />
                    )}
                    {rank > 3 && (
                      <span className="text-xs sm:text-sm font-semibold text-muted-foreground">
                        #{rank}
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell className="px-2 sm:px-4 max-w-[140px] sm:max-w-none truncate">
                  <span className={cn(isTopThree && "font-semibold text-foreground")}>
                    {entry.playerName || "Anonymous"}
                  </span>
                </TableCell>
                <TableCell className="text-right font-mono font-bold tabular-nums px-2 sm:px-4 text-primary">
                  {formatTime(entry.bestTimeMs)}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}