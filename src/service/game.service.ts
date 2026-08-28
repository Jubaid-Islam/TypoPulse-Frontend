import { client } from "./graphql/client";
import {
  GET_MY_GAME_HISTORY,
  GET_MY_BEST_SCORE,
  GET_LEADERBOARD,
} from "./graphql/queries";
import { SUBMIT_GAME_RESULT } from "./graphql/mutations";
import {
  GameResult,
  LeaderboardEntry,
  SubmitGameResultInput,
} from "@/types";


export const gameService = {
  // get user game history
  async getMyGameHistory(): Promise< GameResult[] > {
    const { data } = await client.query<{ myGameHistory: GameResult[] }>

    ({
      query: GET_MY_GAME_HISTORY,
      fetchPolicy: "network-only",
    });

    return data?.myGameHistory ?? [];
  },


  // get user best score
  async getMyBestScore(): Promise< GameResult | null > {
    const { data } = await client.query<{ myBestScore: GameResult | null }>

    ({
      query: GET_MY_BEST_SCORE,
      fetchPolicy: "network-only",
    });

    return data?.myBestScore ?? null;
  },


  // get leaderboard
  async getLeaderboard(limit: number = 10): Promise< LeaderboardEntry[] > {
    const { data } = await client.query<{ leaderboard: LeaderboardEntry[] }>

    ({
      query: GET_LEADERBOARD,
      variables: { limit },
      fetchPolicy: "network-only",
    });

    return data?.leaderboard ?? [];
  },


  // submit game result
  async submitGameResult(input: SubmitGameResultInput): Promise< GameResult | null > {
    const { data } = await client.mutate<{ submitGameResult: GameResult }>
    
    ({
      mutation: SUBMIT_GAME_RESULT,
      variables: { input },
    });

    return data?.submitGameResult ?? null;
  },
};