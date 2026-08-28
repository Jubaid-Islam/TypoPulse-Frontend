"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { GameContainer } from "@/components/game/GameContainer";
import { GameResult } from "@/components/game/GameResult";
import { GameCompleteResult } from "@/types";
import { useBestScore } from "@/hooks/useBestScore";
import { PENALTY_MS_PER_WRONG } from "@/types/constants";

export default function GamePage() {
  const router = useRouter();

  const { bestScore } = useBestScore();
  const [gameResult, setGameResult] = useState<GameCompleteResult | null>(null);
  const [previousBestMs, setPreviousBestMs] = useState<number | undefined>(undefined);

  const handleGameComplete = (result: GameCompleteResult, prevBestMs?: number) => {
    setGameResult(result);
    setPreviousBestMs(prevBestMs);
  };

  const handlePlayAgain = () => {
    setGameResult(null);
    setPreviousBestMs(undefined);
  };

  const handleViewLeaderboard = () => {
    router.push("/leaderboard");
  };

  if (gameResult) {
    const accuracy =
      (gameResult.correctChars /
        (gameResult.correctChars + gameResult.wrongAttempts)) *
      100;

    const penaltyMs = gameResult.wrongAttempts * PENALTY_MS_PER_WRONG;
    const totalTimeMs = gameResult.rawTimeMs + penaltyMs;

    return (
      <div className="py-8">
        <GameResult
          totalTimeMs={totalTimeMs}
          correctChars={gameResult.correctChars}
          wrongAttempts={gameResult.wrongAttempts}
          accuracy={accuracy}
          previousBestMs={previousBestMs}
          onPlayAgain={handlePlayAgain}
          onViewLeaderboard={handleViewLeaderboard}
        />
      </div>
    );
  }

  return (
    <GameContainer
      onComplete={handleGameComplete}
      previousBestMs={bestScore?.totalTimeMs}
    />
  );
}