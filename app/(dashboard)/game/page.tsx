// Game page
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { GameContainer } from "@/components/game/GameContainer";
import { GameResult } from "@/components/game/GameResult";
import { GameCompleteResult } from "@/types";
import { useBestScore } from "@/hooks/useBestScore";

export default function GamePage() {
  const router = useRouter();

  const { bestScore } = useBestScore();
  const [gameResult, setGameResult] = useState<GameCompleteResult | null>(null);

  const handleGameComplete = async (result: GameCompleteResult) => {
    setGameResult(result);
  };

  const handlePlayAgain = () => {
    setGameResult(null);
  };

  const handleViewLeaderboard = () => {
    router.push("/leaderboard");
  };

  if (gameResult) {
    const accuracy =
      (gameResult.correctChars / (gameResult.correctChars + gameResult.wrongAttempts)) * 100;
    return (
      <div className="py-8">
        <GameResult
          totalTimeMs={gameResult.rawTimeMs}
          correctChars={gameResult.correctChars}
          wrongAttempts={gameResult.wrongAttempts}
          accuracy={accuracy}
          previousBestMs={bestScore?.totalTimeMs}
          onPlayAgain={handlePlayAgain}
          onViewLeaderboard={handleViewLeaderboard}
        />
      </div>
    );
  }

  return <GameContainer onComplete={handleGameComplete} />;
}