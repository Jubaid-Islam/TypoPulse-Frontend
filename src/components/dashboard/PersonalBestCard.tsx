"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FaTrophy } from "react-icons/fa";

interface PersonalBestCardProps {
  bestTimeMs?: number | null;
  isLoading?: boolean;
}

export function PersonalBestCard({ bestTimeMs, isLoading = false }: PersonalBestCardProps) {
  const formatTime = (ms: number) => {
    const seconds = ms / 1000;
    return seconds.toFixed(2) + "s";
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Personal Best</CardTitle>
        <FaTrophy className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-8 w-20 animate-pulse rounded bg-muted" />
        ) : (
          <div className="text-2xl font-bold">
            {bestTimeMs ? formatTime(bestTimeMs) : "0.00s"}
          </div>
        )}
        <CardDescription>Your fastest time</CardDescription>
      </CardContent>
    </Card>
  );
}