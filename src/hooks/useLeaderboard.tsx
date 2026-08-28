import { useQuery } from "@tanstack/react-query";
import { LeaderboardEntry } from "@/types";
import { gameService } from "@/service/game.service";

export function useLeaderboard(limit: number = 10) {
  const {
    data: leaderboard,
    isLoading,
    error,
    refetch,
  } = useQuery< LeaderboardEntry[] >({
    queryKey: ["leaderboard", limit],
    queryFn: () => gameService.getLeaderboard(limit),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    leaderboard: leaderboard || [],
    isLoading,
    error:  error?.message ?? null,
    refetch,
  };
}
