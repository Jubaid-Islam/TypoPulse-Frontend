import { useMutation, useQueryClient } from "@tanstack/react-query";
import { gameService } from "@/service/game.service";
import { SubmitGameResultInput, GameResult } from "@/types";
import { useAuth } from "@/context/AuthContext";

export function useSubmitGameResult() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const mutation = useMutation<GameResult | null, Error, SubmitGameResultInput>({
    mutationFn: (input: SubmitGameResultInput) => {
      if (!user) {
        throw new Error("You must be logged in to submit results");
      }
      return gameService.submitGameResult(input);
    },
    onSuccess: () => {
      // invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ["gameHistory"] });
      queryClient.invalidateQueries({ queryKey: ["bestScore"] });
      queryClient.invalidateQueries({ queryKey: ["leaderboard"] });
    },
  });

  return {
    submitResult: mutation.mutateAsync,
    isSubmitting: mutation.isPending,
    data: mutation.data,
    error: mutation.error?.message ?? null,
    reset: mutation.reset,
  };
}