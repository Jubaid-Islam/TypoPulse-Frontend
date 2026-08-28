"use client";

import { useRef, useEffect } from "react";
import { useGame } from "@/hooks/useGame";
import { GameCompleteResult } from "@/types";
import { CharacterDisplay } from "./CharacterDisplay";
import { Timer } from "./Timer";
import { ProgressIndicator } from "./ProgressIndicator";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { KeyboardShortcutHint } from "@/components/shared";
import { FiPlay } from "react-icons/fi";
import { useSubmitGameResult } from "@/hooks/useSubmitGameResult";
import { useAuth } from "@/context/AuthContext";

interface GameContainerProps {
  previousBestMs?: number;
  onComplete?: (result: GameCompleteResult, previousBestMs?: number) => void;
}

export function GameContainer({ onComplete, previousBestMs }: GameContainerProps) {
  const { user } = useAuth();
  const { submitResult } = useSubmitGameResult();
  const mobileInputRef = useRef<HTMLInputElement>(null);
  const previousBestSnapshotRef = useRef<number | undefined>(previousBestMs);

  const handleGameComplete = async (result: GameCompleteResult) => {
    if (user) {
      await submitResult(result);
    }
    onComplete?.(result, previousBestSnapshotRef.current);
  };

  const {
    chars,
    currentIndex,
    correctChars,
    wrongAttempts,
    isPlaying,
    isComplete,
    timeMs,
    isWrongFlash,
    startGame,
    handleKeyPress,
    totalChars,
  } = useGame({ onComplete: handleGameComplete });

  const handleStartGame = () => {
    previousBestSnapshotRef.current = previousBestMs;
    startGame();
    setTimeout(() => {
      mobileInputRef.current?.focus();
    }, 50);
  };

  const handleContainerClick = () => {
    if (isPlaying && !isComplete) {
      mobileInputRef.current?.focus();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value && isPlaying && !isComplete) {
      const lastChar = value.slice(-1);
      handleKeyPress(lastChar.toLowerCase());
    }
    e.target.value = "";
  };

  useEffect(() => {
    if (isPlaying && !isComplete) {
      mobileInputRef.current?.focus();
    }
  }, [isPlaying, isComplete]);

  return (
    <div className="flex w-full min-h-[calc(100vh-14rem)] items-center justify-center py-4 sm:py-8">
      <Card
        className="w-full container mx-auto shadow-lg border-muted cursor-pointer"
        onClick={handleContainerClick}
      >
        <CardContent className="p-4 sm:p-6 md:p-8 space-y-6">
          <input
            ref={mobileInputRef}
            type="text"
            inputMode="text"
            autoCapitalize="none"
            autoCorrect="off"
            autoComplete="off"
            spellCheck="false"
            onChange={handleInputChange}
            className="sr-only"
            aria-label="Typing input for mobile and screen readers"
          />

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b pb-4">
            <Timer timeMs={timeMs} />
            <div className="flex items-center gap-3 text-xs sm:text-sm font-medium">
              <span className="px-2.5 py-1 rounded-md">
                Correct: {correctChars}
              </span>
              <span className=" px-2.5 py-1 rounded-md">
                Mistakes: <span className="text-red-400">{wrongAttempts}</span>
              </span>
            </div>
          </div>

          <div className="py-2">
            <CharacterDisplay
              chars={chars}
              currentIndex={currentIndex}
              isComplete={isComplete}
              isWrongFlash={isWrongFlash}
            />
          </div>

          <ProgressIndicator current={currentIndex} total={totalChars} />

          <div className="flex flex-col gap-4 pt-2">
            <div className="flex flex-col sm:flex-row justify-center gap-3">
              {!isPlaying && !isComplete && (
                <Button
                  onClick={handleStartGame}
                  size="lg"
                  className="w-full sm:w-auto gap-2 font-semibold shadow-md"
                >
                  <FiPlay className="h-4 w-4" />
                  Start Game
                </Button>
              )}
            </div>

            <div className="text-center">
              <KeyboardShortcutHint
                shortcut={isComplete || !isPlaying ? "Enter" : "Type keys"}
                description={
                  isComplete || !isPlaying
                    ? "Press Enter to start"
                    : "Type the highlighted character to play"
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}