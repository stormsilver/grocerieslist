import { createContext, useContext } from 'react';
import { useDebounceCallback } from 'usehooks-ts';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Api } from '../api/Api';

const ApiContext = createContext();
export const useApi = () => useContext(ApiContext);

const api = new Api();

export const ApiProvider = ({ children }) => {
  const queryClient = useQueryClient();
  const {
    mutateAsync: performSync,
    isPending,
    isError,
    isSuccess,
  } = useMutation({
    mutationFn: api.synchronize,
    onSuccess: () => {
      console.log('  Synchronized!');
      queryClient.invalidateQueries({ queryKey: api.getItemsByCategory().queryKey });
      queryClient.invalidateQueries({ queryKey: api.getItemsByStore().queryKey });
    },
  });

  // const synchronize = async () => {
  //   setSyncState((state) => ({ ...state, isSyncing: true }));
  //   return performSync().then((response) => {
  //     setSyncState((state) => ({ ...state, isSyncing: false, lastSynced: new Date() }));
  //   });
  // };

  const syncState = {
    isSyncing: isPending,
    isError,
    isSuccess,
  };

  const sync = useDebounceCallback(performSync, 2000);

  return <ApiContext.Provider value={{ api, sync, syncState }}>{children}</ApiContext.Provider>;
};
