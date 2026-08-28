import { User } from "./user";
import { GameResult, LeaderboardEntry } from "./game";

// Auth payloads
export interface AuthPayload {
  user: User;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

// Game submission input
export interface SubmitGameResultInput {
  correctChars: number;
  wrongAttempts: number;
  rawTimeMs: number;
  wpmTimeline: number[];
  characterTimeline?: number[];
}

// Query responses
export interface MeQueryResponse {
  me: User | null;
}

export interface MyGameHistoryQueryResponse {
  myGameHistory: GameResult[];
}

export interface MyBestScoreQueryResponse {
  myBestScore: GameResult | null;
}

export interface LeaderboardQueryResponse {
  leaderboard: LeaderboardEntry[];
}