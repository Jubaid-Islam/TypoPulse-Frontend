// History page
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { HistoryList } from "@/components/history/HistoryList";
import { useGameHistory } from "@/hooks/useGameHistory";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FaHistory } from "react-icons/fa";

export default function HistoryPage() {
  const { user } = useAuth();
  const { history, isLoading } = useGameHistory();

  if (!user) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4">
        <FaHistory className="h-12 w-12 text-muted-foreground" />
        <h2 className="text-2xl font-bold">Login Required</h2>
        <p className="text-muted-foreground">Please login to view your game history</p>
        <Button asChild>
          <Link href="/login">Login</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FaHistory className="h-5 w-5" />
            Game History
          </CardTitle>
          <CardDescription>Your previous game results</CardDescription>
        </CardHeader>
        <CardContent>
          <HistoryList history={history} isLoading={isLoading} />
        </CardContent>
      </Card>
    </div>
  );
}