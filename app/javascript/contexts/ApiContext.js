import { createContext, useContext, useEffect } from 'react';
import { useDebounceCallback } from 'usehooks-ts';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createConsumer } from '@rails/actioncable';
import { Api } from '../api/Api';
import { hasActiveDrag, runAfterDrag } from '../drag/DragMonitor';

const ApiContext = createContext();
export const useApi = () => useContext(ApiContext);

const api = new Api();

export const ApiProvider = ({ children }) => {
  const queryClient = useQueryClient();
  useEffect(() => {
    const consumer = createConsumer();
    const subscription = consumer.subscriptions.create(
      { channel: 'GroceriesChannel' },
      {
        received: (message) => {
          switch (message.type) {
            case 'items':
              queryClient.invalidateQueries({ queryKey: api.getItemsByCategory().queryKey });
              queryClient.invalidateQueries({ queryKey: api.getItemsByStore().queryKey });
              break;
            case 'store_items':
              queryClient.invalidateQueries({ queryKey: api.getItemsByStore().queryKey });
              break;
            case 'categories':
              queryClient.invalidateQueries({ queryKey: api.getCategories().queryKey });
              queryClient.invalidateQueries({ queryKey: api.getItemsByCategory().queryKey });
              break;
            case 'stores':
              queryClient.invalidateQueries({ queryKey: api.getStores().queryKey });
              queryClient.invalidateQueries({ queryKey: api.getItemsByStore().queryKey });
              break;
            default:
              break;
          }
        },
      }
    );

    return () => {
      subscription.unsubscribe();
      consumer.disconnect();
    };
  }, [queryClient]);
  const {
    mutateAsync: performSync,
    isPending: isSyncPending,
    isError: isSyncError,
    isSuccess: isSyncSuccess,
  } = useMutation({
    mutationFn: api.synchronize,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: api.getItemsByCategory().queryKey });
      queryClient.invalidateQueries({ queryKey: api.getItemsByStore().queryKey });
    },
  });

  const {
    mutateAsync: performSave,
    isPending: isSavePending,
    isError: isSaveError,
    isSuccess: isSaveSuccess,
  } = useMutation({
    mutationFn: api.save,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: api.getStores().queryKey });
      queryClient.invalidateQueries({ queryKey: api.getCategories().queryKey });
      queryClient.invalidateQueries({ queryKey: api.getItemsByCategory().queryKey });
      queryClient.invalidateQueries({ queryKey: api.getItemsByStore().queryKey });
    },
  });

  const syncState = {
    isSyncing: isSyncPending || isSavePending,
    isError: isSyncError || isSaveError,
    isSuccess: isSyncSuccess || isSaveSuccess,
  };

  const schedulePerformSync = useDebounceCallback(() => {
    if (hasActiveDrag()) {
      runAfterDrag(() => {
        schedulePerformSync();
      });
      return;
    }

    performSync();
  }, 1000);

  const sync = () => {
    schedulePerformSync();
  };

  const save = () => performSave().then(performSync);

  return <ApiContext.Provider value={{ api, sync, syncState, save }}>{children}</ApiContext.Provider>;
};
