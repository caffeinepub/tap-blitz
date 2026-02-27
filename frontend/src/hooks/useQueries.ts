import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';

export function useHighScore() {
  const { actor, isFetching } = useActor();

  return useQuery<bigint>({
    queryKey: ['highScore'],
    queryFn: async () => {
      if (!actor) return BigInt(0);
      return actor.getHighScore();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSubmitScore() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (finalScore: number) => {
      if (!actor) return false;
      return actor.submitScore(BigInt(finalScore));
    },
    onSuccess: (isNewHighScore) => {
      if (isNewHighScore) {
        queryClient.invalidateQueries({ queryKey: ['highScore'] });
      }
    },
  });
}
