import { Routes, Route, BrowserRouter as Router } from 'react-router-dom';
import { QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Layout } from './Layout';
import { List } from './List';
import { Shop } from './Shop';
import { ApiProvider } from '../contexts/ApiContext';
import { CurrentStoreProvider } from '../contexts/CurrentStoreContext';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: true,
    },
  },
  queryCache: new QueryCache({
    onError: (error) => {
      // eslint-disable-next-line no-console
      console.error(error);
    },
  }),
});

export const App = () => {
  return (
    <Router>
      <QueryClientProvider client={queryClient}>
        <ApiProvider>
          <CurrentStoreProvider>
            <Layout>
              <Routes>
                <Route path="/list" element={<List />} />
                <Route path="/shop" element={<Shop />} />
              </Routes>
            </Layout>
          </CurrentStoreProvider>
        </ApiProvider>
      </QueryClientProvider>
    </Router>
  );
};
