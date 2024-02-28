// const listDataByStore = [
//   {
//     storeId: 1,
//     items: [
//       { id: 6, name: 'The Mythical Man-Month', needed: true },
//       { id: 1, name: 'Kindle', needed: true, order: 2 },
//       { id: 4, name: 'The Pragmatic Programmer', needed: true, order: 4 },
//       { id: 2, name: 'Echo Dot', needed: false, order: 1 },
//       { id: 3, name: 'Fire TV Stick', needed: true, order: 2 },
//       { id: 5, name: 'Clean Code', needed: false },
//     ],
//   },
//   {
//     storeId: 2,
//     items: [
//       { id: 7, name: 'Great Value Milk', needed: true },
//       { id: 8, name: 'Great Value Cheese', needed: false },
//       { id: 9, name: 'Great Value Yogurt', needed: true },
//       { id: 10, name: 'Great Value Carrots', needed: true },
//       { id: 11, name: 'Great Value Lettuce', needed: false },
//       { id: 12, name: 'Great Value Kale', needed: true },
//     ],
//   },
//   {
//     storeId: 3,
//     items: [
//       { id: 13, name: 'Up & Up Bread', needed: true },
//       { id: 14, name: 'Up & Up Bagels', needed: false },
//       { id: 15, name: 'Up & Up Donuts', needed: true },
//       { id: 16, name: 'Up & Up Muffins', needed: true },
//       { id: 17, name: 'Up & Up Rice', needed: true },
//       { id: 18, name: 'Up & Up Pasta', needed: false },
//     ],
//   },
// ];

const storeItems = [
  { id: 1, order: 1, itemId: 1, storeId: 1 },
  { id: 2, order: 2, itemId: 2, storeId: 1 },
  { id: 3, itemId: 3, storeId: 1 },
  { id: 4, itemId: 4, storeId: 1 },
  { id: 5, order: 5, itemId: 5, storeId: 2 },
  { id: 6, order: 6, itemId: 6, storeId: 3 },
  { id: 7, order: 7, itemId: 7, storeId: 1 },
  { id: 8, order: 8, itemId: 8, storeId: 2 },
  { id: 9, order: 9, itemId: 9, storeId: 1 },
  { id: 10, order: 10, itemId: 10, storeId: 1 },
  { id: 11, order: 11, itemId: 11, storeId: 1 },
  { id: 12, order: 12, itemId: 12, storeId: 1 },
  { id: 13, order: 1, itemId: 13, storeId: 2 },
  { id: 14, order: 2, itemId: 14, storeId: 1 },
  { id: 15, order: 3, itemId: 15, storeId: 1 },
  { id: 16, order: 16, itemId: 16, storeId: 1 },
  { id: 17, order: 17, itemId: 17, storeId: 3 },
  { id: 18, order: 18, itemId: 18, storeId: 1 },
  { id: 19, order: 19, itemId: 19, storeId: 3 },
  { id: 20, order: 20, itemId: 20, storeId: 1 },
  { id: 20, order: 1, itemId: 20, storeId: 2 },
  { id: 20, order: 2, itemId: 20, storeId: 3 },
];

export const getStoreItemsQuery = () => [
  ['store-items'],
  async () => {
    return storeItems;
  },
];
