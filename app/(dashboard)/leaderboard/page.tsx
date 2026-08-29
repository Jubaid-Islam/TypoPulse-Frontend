"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LeaderboardTable } from "@/components/leaderboard/LeaderboardTable";
import { useLeaderboard } from "@/hooks/useLeaderboard";
import { FaTrophy } from "react-icons/fa";

export default function LeaderboardPage() {
  const { leaderboard, isLoading } = useLeaderboard(10);

  return (
    <div className="flex min-h-[calc(100vh-12rem)] items-center justify-center p-4">
      <Card className="w-full shadow-xl border-muted">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FaTrophy className="h-4 w-4" />
            Leaderboard
          </CardTitle>
          <CardDescription>Top players with the best times</CardDescription>
        </CardHeader>
        <CardContent>
          <LeaderboardTable entries={leaderboard} isLoading={isLoading} />
        </CardContent>
      </Card>
    </div>
  );
}