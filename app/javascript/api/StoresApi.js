const stores = [
  { name: 'Amazon', id: 1 },
  { name: 'Walmart', id: 2 },
  { name: 'Target', id: 3 },
];

export const getStoresQuery = () => [
  ['stores'],
  async () => {
    return stores;
  },
];
