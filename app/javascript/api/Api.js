import { Store } from '../models/Store';
import { StoreItem } from '../models/StoreItem';
import { Item } from '../models/Item';
import { Category } from '../models/Category';

export const UNCATEGORIZED_CATEGORY_ID = -1;

export class Api {
  #categories = [];

  #stores = [];

  #items = [];

  #storeItems = [];

  synchronize = async () => {
    console.log('API: synchronize');

    return Promise.all([
      // save stores
      // save categories
      // save items
      // this.#saveItems(),
      // save store items
      this.#saveStoreItems(),
    ]);
  };

  getItemsByCategory = () => {
    return {
      queryKey: ['items-by-category'],
      queryFn: async () => {
        console.log('API: getItemsByCategory');
        if (this.#categories.length === 0) {
          // fetch categories
          await this.getCategories().queryFn();
        }
        if (this.#items.length === 0) {
          // fetch items
          await this.#getItems();
        }

        return this.#items.reduce((acc, item) => {
          const category = this.#categories.find((c) => c.id === item.categoryId);

          acc[category?.id || UNCATEGORIZED_CATEGORY_ID] ||= [];
          acc[category?.id || UNCATEGORIZED_CATEGORY_ID].push(item);
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
        if (this.#items.length === 0) {
          // fetch items
          await this.#getItems();
        }
        if (this.#stores.length === 0) {
          // fetch stores
          await this.getStores().queryFn();
        }

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

        // build a StoreItem for any item that doesn't have a storeItem
        this.#items.forEach((item) => {
          if (!storeItems.some((si) => si.itemId === item.id)) {
            storeItems.push(new StoreItem({ item }));
          }
        });

        return storeItems.reduce((acc, storeItem) => {
          acc[storeItem.store?.id] ||= [];
          acc[storeItem.store?.id].push(storeItem);
          return acc;
        }, {});
      },
    };
  };

  createStoreItem = (storeItem) => {
    console.log('API: createStoreItem');
    this.#storeItems.push(storeItem);
  };

  getStores = () => {
    return {
      queryKey: ['stores'],
      queryFn: async () => {
        console.log('API: getStores');

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

        const categoriesFromApi = await fetch('/api/categories').then((res) => res.json());
        // Add an "Uncategorized" category
        categoriesFromApi.push({ id: UNCATEGORIZED_CATEGORY_ID, name: 'Uncategorized' });

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

  #saveItems = async () => {
    console.log('API: saveItems');

    const body = this.#items.map((item) => item.toApi());

    return fetch(`/api/items`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ items: body }),
    });
  };

  #saveStoreItems = async () => {
    console.log('API: saveStoreItems');

    const body = this.#storeItems.map((item) => item.toApi());

    return fetch(`/api/store_items`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ storeItems: body }),
    });
  };
}
