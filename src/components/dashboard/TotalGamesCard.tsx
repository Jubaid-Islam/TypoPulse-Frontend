"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FaGamepad } from "react-icons/fa";


interface TotalGamesCardProps {
  totalGames?: number;
  isLoading?: boolean;
}

export function TotalGamesCard({ totalGames = 0, isLoading = false }: TotalGamesCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Total Games Played</CardTitle>
        <FaGamepad className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-8 w-16 animate-pulse rounded bg-muted" />
        ) : (
          <div className="text-2xl font-bold">{totalGames}</div>
        )}
        <CardDescription>All-time games</CardDescription>
      </CardContent>
    </Card>
  );
}