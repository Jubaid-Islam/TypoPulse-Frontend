import { useQuery } from "@tanstack/react-query";
import { gameService } from "@/service/game.service";
import { GameResult } from "@/types";
import { useAuth } from "@/context/AuthContext";

export function useGameHistory() {
  const { user } = useAuth();

  const {
    data: history,
    isLoading,
    error,
    refetch,
  } = useQuery<GameResult[]>({
    queryKey: ["gameHistory"],
    queryFn: () => gameService.getMyGameHistory(),
    enabled: !!user,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  return {
    history: history || [],
    isLoading,
    error:  error?.message ?? null,
    refetch,
  };
}