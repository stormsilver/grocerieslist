const categories = [
  { id: 1, name: 'Dairy' },
  { id: 2, name: 'Produce' },
  { id: 3, name: 'Bakery' },
  { id: 4, name: 'Pantry' },
];

export const getCategoriesQuery = () => [
  ['categories'],
  async () => {
    return categories;
  },
];
