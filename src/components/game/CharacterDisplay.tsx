"use client";

import { cn } from "@/lib/utils";

interface CharacterDisplayProps {
  chars: string[];
  currentIndex: number;
  isComplete: boolean;
  isWrongFlash?: boolean;
}

export function CharacterDisplay({
  chars,
  currentIndex,
  isComplete,
  isWrongFlash = false,
}: CharacterDisplayProps) {
  // Placeholder sequence shown before the game starts (chars is empty)
  const displayChars =
    chars.length > 0 ? chars : "abcdefghijklmnopqrst".split("");

  return (
    <div className="rounded-xl border bg-muted/20 px-3 py-6 sm:px-6 sm:py-8 shadow-inner select-none">
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 md:gap-4 font-mono">
        {displayChars.map((char, index) => {
          const isTyped = chars.length > 0 && index < currentIndex;
          const isCurrent =
            chars.length > 0 && index === currentIndex && !isComplete;
          const isCurrentWrong = isCurrent && isWrongFlash;

          return (
            <span
              key={index}
              className={cn(
                "flex h-9 w-9 sm:h-11 sm:w-11 md:h-12 md:w-12 items-center justify-center rounded-lg text-lg sm:text-2xl md:text-3xl font-bold transition-all duration-150",
                isCurrent &&
                  "shadow-md shadow-zinc-400 text-primary scale-110",
                isCurrentWrong &&
                  "bg-red-500 text-white animate-shake scale-110",
                isTyped && " text-zinc-500 scale-95 opacity-50",
                !isCurrent && !isTyped && "text-zinc-200",
              )}
            >
              {char}
            </span>
          );
        })}
      </div>
    </div>
  );
}
