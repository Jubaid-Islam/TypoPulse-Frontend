export interface GameResult {
  id: string;
  correctChars: number;
  wrongAttempts: number;
  rawTimeMs: number;
  penaltyMs: number;
  totalTimeMs: number;
  accuracy: number;
  wpmTimeline: number[];
  characterTimeline: number[];
  createdAt: string;
}

export interface LeaderboardEntry {
  rank: number;
  playerName: string;
  bestTimeMs: number;
}

export interface GameCompleteResult {
  correctChars: number;
  wrongAttempts: number;
  rawTimeMs: number;
  wpmTimeline: number[];
  characterTimeline: number[];
}