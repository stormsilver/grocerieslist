import { useQuery as useReactQuery, useQueryClient } from '@tanstack/react-query';

export const useQuery = ({ queryKey, queryFn, ...options }) => {
  const queryClient = useQueryClient();

  const queryOptions = {
    retry: 1,
    ...options,
    onSuccess: (data) => options.onSuccess?.(data, queryClient),
    onError: (error) => {
      // eslint-disable-next-line no-console
      console.error(error);
      // TODO: show error message to user
      options.onError?.(error, queryClient);
    },
  };

  const query = useReactQuery({ queryKey, queryFn, ...queryOptions });

  return query;
};
