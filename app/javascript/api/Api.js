// export QueryKeys = {
//   categories: ['categories'],
//   items: ['items'],
//   stores: ['stores'],
// };

import { Store } from '../models/Store';
import { StoreItem } from '../models/StoreItem';
import { Item } from '../models/Item';
import { Category } from '../models/Category';

const CATEGORIES_FROM_API = [
  { id: 1, name: 'Dairy' },
  { id: 2, name: 'Produce' },
  { id: 3, name: 'Bakery' },
  { id: 4, name: 'Pantry' },
];

const STORES_FROM_API = [
  { name: 'Amazon', id: 1 },
  { name: 'Walmart', id: 2 },
  { name: 'Target', id: 3 },
];

const ITEMS_FROM_API = [
  { id: 1, name: 'Kindle', needed: true, categoryId: 1 },
  { id: 2, name: 'Echo Dot', needed: false, categoryId: 2 },
  { id: 3, name: 'Fire TV Stick', needed: true, categoryId: 3 },
  { id: 4, name: 'The Pragmatic Programmer', needed: true, categoryId: 1 },
  { id: 5, name: 'Clean Code', needed: false, categoryId: 2 },
  { id: 6, name: 'The Mythical', needed: true, categoryId: 3 },
  { id: 7, name: 'Great Value Milk', needed: true, categoryId: 1 },
  { id: 8, name: 'Great Value Cheese', needed: false, categoryId: 2 },
  { id: 9, name: 'Great Value Yogurt', needed: true, categoryId: 3 },
  { id: 10, name: 'Great Value Carrots', needed: true },
  { id: 11, name: 'Great Value Lettuce', needed: false },
  { id: 12, name: 'Great Value Kale', needed: true },
  { id: 13, name: 'Up & Up Bread', needed: true, categoryId: 2 },
  { id: 14, name: 'Up & Up Bagels', needed: false, categoryId: 2 },
  { id: 15, name: 'Up & Up Donuts', needed: true, categoryId: 1 },
  { id: 16, name: 'Up & Up Muffins', needed: true, categoryId: 2 },
  { id: 17, name: 'Up & Up Rice', needed: true, categoryId: 2 },
  { id: 18, name: 'Up & Up Pasta', needed: false, categoryId: 2 },
  { id: 19, name: 'Up & Up Cereal', needed: true },
  { id: 20, name: 'Up & Up Pop Tarts', needed: true, categoryId: 3 },
  { id: 21, name: 'Up & Up Popcorn', needed: true, categoryId: 1 },
  { id: 22, name: 'Up & Up Peanut Butter', needed: true },
];

const STORE_ITEMS_FROM_API = [
  { id: 1, order: 1, itemId: 1 },
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
  { id: 20, order: 19, itemId: 19, storeId: 2 },
  { id: 21, order: 20, itemId: 20, storeId: 1 },
  { id: 22, order: 1, itemId: 20, storeId: 2 },
  { id: 23, order: 2, itemId: 20, storeId: 3 },
];

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
//
// const listData = [
//   {
//     name: 'Dairy',
//     items: [
//       { id: 1, name: 'Milk', needed: true },
//       { id: 2, name: 'Cheese', needed: false },
//       { id: 3, name: 'Yogurt', needed: true },
//     ],
//   },
//   {
//     name: 'Produce',
//     items: [
//       { id: 4, name: 'Carrots', needed: true },
//       { id: 5, name: 'Lettuce', needed: false },
//       { id: 6, name: 'Kale', needed: true },
//       { id: 7, name: 'Apples', needed: true },
//       { id: 8, name: 'Oranges', needed: true },
//       { id: 9, name: 'Bananas', needed: true },
//       { id: 10, name: 'Grapes', needed: true },
//     ],
//   },
//   {
//     name: 'Bakery',
//     items: [
//       { id: 11, name: 'Bread', needed: true },
//       { id: 12, name: 'Bagels', needed: false },
//       { id: 13, name: 'Donuts', needed: true },
//       { id: 14, name: 'Muffins', needed: true },
//     ],
//   },
//   {
//     name: 'Pantry',
//     items: [
//       { id: 15, name: 'Rice', needed: true },
//       { id: 16, name: 'Pasta', needed: false },
//       { id: 17, name: 'Cereal', needed: true },
//       { id: 18, name: 'Pop Tarts', needed: true },
//       { id: 19, name: 'Popcorn', needed: true },
//       { id: 20, name: 'Peanut Butter', needed: true },
//     ],
//   },
// ];

// ===========================================================

export class Api {
  #categories = [];

  #stores = [];

  #items = [];

  #storeItems = [];

  getItemsByCategory = () => {
    return {
      queryKey: ['items-by-category'],
      queryFn: async () => {
        console.log('API: getItemsByCategory');
        // refresh categories
        await this.getCategories().queryFn();
        // refresh items
        await this.#getItems();

        return this.#items.reduce((acc, item) => {
          const category = this.#categories.find((c) => c.id === item.categoryId);

          acc[category?.id] ||= [];
          acc[category?.id].push(item);
          return acc;
        }, {});
      },
    };
  };

  getItemsByStore = () => {
    return {
      queryKey: ['items-by-store'],
      queryFn: async () => {
        console.log('API: getItemsByStore');
        // refresh items
        await this.#getItems();
        // refresh stores
        await this.getStores().queryFn();

        // const storeItemsFromApi = STORE_ITEMS_FROM_API;
        const storeItemsFromApi = await fetch('/api/store_items').then((res) => res.json());
        const storeItems = storeItemsFromApi.map((storeItemData) => {
          let storeItem = this.#storeItems.find((si) => si.id === storeItemData.id);
          if (!storeItem) {
            storeItem = new StoreItem();
            this.#storeItems.push(storeItem);
          }
          if (storeItemData.storeId) {
            storeItemData.store = this.#stores.find((s) => s.id === storeItemData.storeId);
            if (!storeItemData.store) {
              throw new Error(`Store not found for storeItemData: ${JSON.stringify(storeItemData)}`);
            }
          }
          storeItemData.item = this.#items.find((i) => i.id === storeItemData.itemId);
          if (!storeItemData.item) {
            throw new Error(`Item not found for storeItemData: ${JSON.stringify(storeItemData)}`);
          }
          storeItem.updateFromApi(storeItemData);
          return storeItem;
        });

        // return Object.groupBy(storeItems, (storeItem) => storeItem.storeId);
        return storeItems.reduce((acc, storeItem) => {
          acc[storeItem.store?.id] ||= [];
          acc[storeItem.store?.id].push(storeItem);
          return acc;
        }, {});
      },
    };
  };

  getStores = () => {
    return {
      queryKey: ['stores'],
      queryFn: async () => {
        console.log('API: getStores');
        // const storesFromApi = STORES_FROM_API;
        const storesFromApi = await fetch('/api/stores').then((res) => res.json());
        return storesFromApi.map((storeData) => {
          let store = this.#stores.find((s) => s.id === storeData.id);
          if (!store) {
            store = new Store();
            this.#stores.push(store);
          }
          store.updateFromApi(storeData);
          return store;
        });
      },
    };
  };

  getCategories = () => {
    return {
      queryKey: ['categories'],
      queryFn: async () => {
        console.log('API: getCategories');
        // const categoriesFromApi = CATEGORIES_FROM_API;
        const categoriesFromApi = await fetch('/api/categories').then((res) => res.json());
        // Add an "Uncategorized" category
        categoriesFromApi.push({ id: undefined, name: 'Uncategorized' });

        return categoriesFromApi.map((categoryData) => {
          let category = this.#categories.find((c) => c.id === categoryData.id);
          if (!category) {
            category = new Category();
            this.#categories.push(category);
          }
          category.updateFromApi(categoryData);
          return category;
        });
      },
    };
  };

  #getItems = async () => {
    console.log('API: getItems');
    // const itemsFromApi = ITEMS_FROM_API;
    const itemsFromApi = await fetch('/api/items').then((res) => res.json());
    return itemsFromApi.map((itemData) => {
      let item = this.#items.find((i) => i.id === itemData.id);
      if (!item) {
        item = new Item();
        this.#items.push(item);
      }
      item.updateFromApi(itemData);
      return item;
    });
  };
}

// //
// const [categoriesQueryKey, categoriesQueryFn] = getCategoriesQuery();
// const { data: categories } = useQuery(categoriesQueryKey, categoriesQueryFn);
// const [itemsQueryKey, itemsQueryFn] = getItemsQuery();
// const { data: items } = useQuery(itemsQueryKey, itemsQueryFn);
//
// const categorySections = categories.map((category, i) => {
//   const itemsInCategory = items.filter((item) => item.categoryId === category.id);
//   const itemRows = itemsInCategory.map((item, j) => {
//     return <Item key={j} item={item} />;
//   });
//
//   return (
//     <Category key={i} category={category}>
//       {itemRows}
//     </Category>
//   );
// });
// //
// const [itemsQueryKey, itemsQueryFn] = getItemsQuery();
// const { data: items } = useQuery(itemsQueryKey, itemsQueryFn);
// const [storeItemsQueryKey, storeItemsQueryFn] = getStoreItemsQuery();
// const { data: storeItems } = useQuery(storeItemsQueryKey, storeItemsQueryFn);
// const currentStoreItems = [];
//
// storeItems.forEach((storeItem) => {
//   if (storeItem.storeId === currentStore) {
//     const item = items.find((item) => item.id === storeItem.itemId);
//     currentStoreItems.push({ ...item, ...storeItem });
//   }
// }
//
//
//
// const listDataByStore = storeItems.reduce((acc, storeItem) => {
//   const store = acc.find((store) => store.storeId === storeItem.storeId);
//   if (store) {
//     store.items.push(storeItem);
//   } else {
//     acc.push({ storeId: storeItem.storeId, items: [storeItem] });
//   }
//   return acc;
// });
// //
