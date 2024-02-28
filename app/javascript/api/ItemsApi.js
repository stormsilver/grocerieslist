const items = [
  { id: 1, name: 'Milk', categoryId: 1 },
  { id: 2, name: 'Cheese', categoryId: 1 },
  { id: 3, name: 'Yogurt', categoryId: 1 },
  { id: 4, name: 'Carrots', categoryId: 2 },
  { id: 5, name: 'Lettuce', categoryId: 2 },
  { id: 6, name: 'Kale', categoryId: 2 },
  { id: 7, name: 'Apples', categoryId: 2 },
  { id: 8, name: 'Oranges', categoryId: 2 },
  { id: 9, name: 'Bananas', categoryId: 2 },
  { id: 10, name: 'Grapes', categoryId: 2 },
  { id: 11, name: 'Bread', categoryId: 3 },
  { id: 12, name: 'Bagels', categoryId: 3 },
  { id: 13, name: 'Donuts', categoryId: 3 },
  { id: 14, name: 'Muffins', categoryId: 3 },
  { id: 15, name: 'Rice', categoryId: 4 },
  { id: 16, name: 'Pasta', categoryId: 4 },
  { id: 17, name: 'Cereal', categoryId: 4 },
  { id: 18, name: 'Pop Tarts', categoryId: 4 },
  { id: 19, name: 'Popcorn', categoryId: 4 },
  { id: 20, name: 'Peanut Butter', categoryId: 4 },
];

export const getItemsQuery = () => [
  ['items'],
  async () => {
    return items;
  },
];
