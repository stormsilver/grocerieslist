import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useCurrentStore } from '../contexts/CurrentStoreContext';
import { useApi } from '../contexts/ApiContext';

export const StoreSelector = () => {
  const { currentStore, setCurrentStore } = useCurrentStore();
  const { data: stores } = useQuery(useApi().api.getStores());
  const options = [];

  useEffect(() => {
    if (stores && !currentStore) {
      setCurrentStore(stores[0]);
    }
  }, [stores, currentStore, setCurrentStore]);

  if (!stores) return null;

  if (stores.length === 0) {
    options.push(<option key={0} value={0}></option>);
  }

  stores.map((store) =>
    options.push(
      <option key={store.id} value={store.id}>
        {store.name}
      </option>
    )
  );

  const onSelect = (e) => {
    const store = stores.find((s) => s.id === parseInt(e.target.value, 10));
    setCurrentStore(store);
  };

  return (
    <select className="form-select" value={currentStore?.id} onChange={onSelect}>
      {options}
    </select>
  );
};
