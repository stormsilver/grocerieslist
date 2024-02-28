import { useEffect } from 'react';
import { useCurrentStore } from '../contexts/CurrentStoreContext';
import { useApi } from '../contexts/ApiContext';
import { useQuery } from '../hooks/useQuery';

export const StoreSelector = () => {
  const { currentStore, setCurrentStore } = useCurrentStore();
  const { data: stores } = useQuery(useApi().getStores());
  const options = [<option key={0} value={0}></option>];

  useEffect(() => {
    if (stores && !currentStore) {
      setCurrentStore(stores[0]);
    }
  }, [stores, currentStore, setCurrentStore]);

  if (!stores) return null;

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
