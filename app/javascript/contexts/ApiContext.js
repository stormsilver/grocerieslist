import { createContext, useContext } from 'react';
import { Api } from '../api/Api';

const ApiContext = createContext();
export const useApi = () => useContext(ApiContext);

const api = new Api();

export const ApiProvider = ({ children }) => {
  return <ApiContext.Provider value={api}>{children}</ApiContext.Provider>;
};
