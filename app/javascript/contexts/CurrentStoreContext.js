import { createContext, useContext, useState } from 'react';

const CurrentStoreContext = createContext();
export const useCurrentStore = () => useContext(CurrentStoreContext);

export const CurrentStoreProvider = ({ children }) => {
  const [currentStore, setCurrentStore] = useState(null);

  const value = {
    currentStore,
    setCurrentStore,
  };

  return <CurrentStoreContext.Provider value={value}>{children}</CurrentStoreContext.Provider>;
};
