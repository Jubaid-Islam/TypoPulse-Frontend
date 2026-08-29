// Home page
"use client";

import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PersonalBestCard } from "@/components/dashboard/PersonalBestCard";
import { TotalGamesCard } from "@/components/dashboard/TotalGamesCard";
import { StartChallengeButton } from "@/components/dashboard/StartChallengeButton";
import { useBestScore } from "@/hooks/useBestScore";
import { useGameHistory } from "@/hooks/useGameHistory";
import { FaKeyboard, FaTrophy, FaUser } from "react-icons/fa";
import Link from "next/link";
import { BackgroundAnimation } from "@/components/animation/animation";

export default function HomePage() {
  const { user } = useAuth();
  const { bestScore, isLoading: bestLoading } = useBestScore();
  const { history, isLoading: historyLoading } = useGameHistory();

  return (
    <div className="relative">
      <BackgroundAnimation />

      <div className="relative z-10 space-y-8 sm:space-y-12">
        {/* Hero Section */}
        <section className="text-center space-y-4 sm:space-y-6 py-4 sm:py-12">
          <div className="flex justify-center">
            <div className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-sm ring-1 ring-primary/20">
              <FaKeyboard className="h-8 w-8 sm:h-10 sm:w-10" />
            </div>
          </div>

          <div className="space-y-2 max-w-3xl mx-auto px-2">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
              Test your precision. <br className="hidden sm:inline" />
              <span className="text-primary">Master the alphabet.</span>
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto">
              Type 20 random characters with highest accuracy. 0.5s penalty for every mistake.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 max-w-sm sm:max-w-none mx-auto pt-2">
            <StartChallengeButton />
            <Button asChild variant="outline" size="lg" className="w-full sm:w-auto gap-2">
              <Link href="/leaderboard">
                <FaTrophy className="h-4 w-4" />
                Leaderboard
              </Link>
            </Button>
          </div>
        </section>

        {/* Stats Cards */}
        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <PersonalBestCard
            bestTimeMs={bestScore?.totalTimeMs}
            isLoading={bestLoading}
          />
          <TotalGamesCard
            totalGames={history.length}
            isLoading={historyLoading}
          />
          <Card className="sm:col-span-2 lg:col-span-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Player Status</CardTitle>
              <FaUser className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {user ? user.name : "Guest"}
              </div>
              <CardDescription className="text-xs sm:text-sm mt-1">
                {user
                  ? `Logged in as ${user.email}`
                  : "Login to save your game results to leaderboard"}
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}