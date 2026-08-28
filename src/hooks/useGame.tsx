"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { TOTAL_CHARS, PENALTY_MS_PER_WRONG } from "@/types/constants";

interface UseGameOptions {
  onComplete?: (result: {
    correctChars: number;
    wrongAttempts: number;
    rawTimeMs: number;
    wpmTimeline: number[];
    characterTimeline: number[];
  }) => void;
}

const WRONG_FLASH_DURATION_MS = 250;

export function useGame({ onComplete }: UseGameOptions = {}) {
  const [chars, setChars] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctChars, setCorrectChars] = useState(0);
  const [wrongAttempts, setWrongAttempts] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [timeMs, setTimeMs] = useState(0);
  const [wpmTimeline, setWpmTimeline] = useState<number[]>([]);
  const [characterTimeline, setCharacterTimeline] = useState<number[]>([]);
  const [isWrongFlash, setIsWrongFlash] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const lastCharTimeRef = useRef<number | null>(null);
  const wrongFlashTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const generateChars = useCallback(() => {
    const alphabet = "abcdefghijklmnopqrstuvwxyz";
    return Array.from({ length: TOTAL_CHARS }, () => {
      const randomIndex = Math.floor(Math.random() * alphabet.length);
      return alphabet[randomIndex];
    });
  }, []);

  const startGame = useCallback(() => {
    setChars(generateChars());
    setCurrentIndex(0);
    setCorrectChars(0);
    setWrongAttempts(0);
    setIsPlaying(true);
    setIsComplete(false);
    setTimeMs(0);
    setWpmTimeline([]);
    setCharacterTimeline([]);
    setIsWrongFlash(false);

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (wrongFlashTimeoutRef.current) {
      clearTimeout(wrongFlashTimeoutRef.current);
      wrongFlashTimeoutRef.current = null;
    }

    const startTime = Date.now();
    startTimeRef.current = startTime;
    lastCharTimeRef.current = startTime;

    timerRef.current = setInterval(() => {
      if (startTimeRef.current) {
        setTimeMs(Date.now() - startTimeRef.current);
      }
    }, 10);
  }, [generateChars]);

  const handleKeyPress = useCallback(
    (key: string) => {
      if (!isPlaying || isComplete) return;

      const expectedChar = chars[currentIndex];
      if (!expectedChar) return;

      const now = Date.now();
      const charTime = lastCharTimeRef.current ? now - lastCharTimeRef.current : 0;
      lastCharTimeRef.current = now;

      setCharacterTimeline((prev) => [...prev, charTime]);

      if (key === expectedChar) {
        setCorrectChars((prev) => prev + 1);
        setCurrentIndex((prev) => prev + 1);

        const elapsedMinutes = (now - (startTimeRef.current || now)) / 60000;
        const charsTyped = correctChars + 1;
        const wpm = charsTyped / 5 / elapsedMinutes;
        setWpmTimeline((prev) => [...prev, wpm]);

        if (currentIndex === TOTAL_CHARS - 1) {
          setIsComplete(true);
          setIsPlaying(false);
          if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
          }

          const finalTimeMs = now - (startTimeRef.current || now);
          setTimeMs(finalTimeMs);

          onComplete?.({
            correctChars: correctChars + 1,
            wrongAttempts,
            rawTimeMs: finalTimeMs,
            wpmTimeline,
            characterTimeline: [...characterTimeline, charTime],
          });
        }
      } else {
        if (startTimeRef.current) {
          startTimeRef.current -= PENALTY_MS_PER_WRONG;
        }
        setWrongAttempts((prev) => prev + 1);

        // Trigger a brief red flash on the current character
        setIsWrongFlash(true);
        if (wrongFlashTimeoutRef.current) {
          clearTimeout(wrongFlashTimeoutRef.current);
        }
        wrongFlashTimeoutRef.current = setTimeout(() => {
          setIsWrongFlash(false);
          wrongFlashTimeoutRef.current = null;
        }, WRONG_FLASH_DURATION_MS);
      }
    },
    [
      isPlaying,
      isComplete,
      chars,
      currentIndex,
      correctChars,
      wrongAttempts,
      wpmTimeline,
      characterTimeline,
      onComplete,
    ]
  );

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key;
      if (key.length === 1 && key.match(/[a-zA-Z]/)) {
        event.preventDefault();
        handleKeyPress(key.toLowerCase());
      }
      if ((event.key === "Tab" || event.key === "Enter") && (isComplete || !isPlaying)) {
        event.preventDefault();
        startGame();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyPress, startGame, isPlaying, isComplete]);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      if (wrongFlashTimeoutRef.current) {
        clearTimeout(wrongFlashTimeoutRef.current);
        wrongFlashTimeoutRef.current = null;
      }
    };
  }, []);

  const resetGame = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (wrongFlashTimeoutRef.current) {
      clearTimeout(wrongFlashTimeoutRef.current);
      wrongFlashTimeoutRef.current = null;
    }
    setChars([]);
    setCurrentIndex(0);
    setCorrectChars(0);
    setWrongAttempts(0);
    setIsPlaying(false);
    setIsComplete(false);
    setTimeMs(0);
    setWpmTimeline([]);
    setCharacterTimeline([]);
    setIsWrongFlash(false);
    startTimeRef.current = null;
    lastCharTimeRef.current = null;
  }, []);

  return {
    chars,
    currentIndex,
    correctChars,
    wrongAttempts,
    isPlaying,
    isComplete,
    timeMs,
    wpmTimeline,
    characterTimeline,
    isWrongFlash,
    startGame,
    resetGame,
    handleKeyPress,
    totalChars: TOTAL_CHARS,
    currentChar: chars[currentIndex] || "",
    progress: chars.length > 0 ? currentIndex / TOTAL_CHARS : 0,
  };
}