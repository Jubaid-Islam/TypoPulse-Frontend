// Leaderboard page
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LeaderboardTable } from "@/components/leaderboard/LeaderboardTable";
import { useLeaderboard } from "@/hooks/useLeaderboard";
import { FaTrophy } from "react-icons/fa";

export default function LeaderboardPage() {
  const { leaderboard, isLoading } = useLeaderboard(10);

  return (
    <div className="space-y-6">
      <Card>
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