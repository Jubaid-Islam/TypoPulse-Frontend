import { useQuery } from "@tanstack/react-query";
import { gameService } from "@/service/game.service";
import { GameResult } from "@/types";
import { useAuth } from "@/context/AuthContext";

export function useBestScore() {
  const { user } = useAuth();

  const {
    data: bestScore,
    isLoading,
    error,
    refetch,
  } = useQuery<GameResult | null>({
    queryKey: ["bestScore"],
    queryFn: () => gameService.getMyBestScore(),
    enabled: !!user, 
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    bestScore,
    isLoading,
    error:  error?.message ?? null,
    refetch,
  };
}