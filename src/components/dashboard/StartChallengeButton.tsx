"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FaPlay } from "react-icons/fa";

export function StartChallengeButton() {
  return (
    <Button asChild size="lg" className="w-full sm:w-auto gap-2 font-semibold shadow-md">
      <Link href="/game">
        <FaPlay className="h-4 w-4" />
        Start Challenge
      </Link>
    </Button>
  );
}