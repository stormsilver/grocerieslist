import { Store } from '../models/Store';
import { StoreItem } from '../models/StoreItem';
import { Item } from '../models/Item';
import { Category } from '../models/Category';
import { BagOfHolding } from './BagOfHolding';

export const UNCATEGORIZED_CATEGORY_ID = -1;
const DEBUG = true;

export class Api {
  #categories = new BagOfHolding({
    apiPath: '/api/categories',
    key: 'categories',
    klass: Category,
    beforeSave: (categories) => {
      // Remove the "Uncategorized" category
      return categories.filter((c) => c.id !== UNCATEGORIZED_CATEGORY_ID);
    },
    afterFetch: (categories) => {
      // Add an "Uncategorized" category
      categories.push({ id: UNCATEGORIZED_CATEGORY_ID, name: 'Uncategorized' });
    },
  });

  #stores = new BagOfHolding({ apiPath: '/api/stores', key: 'stores', klass: Store });

  #items = new BagOfHolding({ apiPath: '/api/items', key: 'items', klass: Item });

  #storeItems = new BagOfHolding({
    apiPath: '/api/store_items',
    key: 'storeItems',
    klass: StoreItem,
    beforeInstantiation: (storeItemData) => {
      if (storeItemData.storeId) {
        storeItemData.store = this.#stores.findOne(storeItemData.storeId);
        if (!storeItemData.store) {
          throw new Error(`Store not found for storeItemData: ${JSON.stringify(storeItemData)}`);
        }
      }
      storeItemData.item = this.#items.findOne(storeItemData.itemId);
      if (!storeItemData.item) {
        throw new Error(`Item not found for storeItemData: ${JSON.stringify(storeItemData)}`);
      }
    },
  });

  synchronize = async () => {
    console.log('API: synchronize');

    const thingsToSync = [this.#items, this.#storeItems];
    const savers = thingsToSync.map((thing) => () => (thing.isEmpty ? Promise.resolve() : thing.save()));

    if (DEBUG) {
      // save each thing in order
      const saveNext = () => {
        const nextSaver = savers.shift();
        if (nextSaver) {
          return nextSaver().then(saveNext);
        }
        return Promise.resolve();
      };
      return saveNext();
    }
    return Promise.all(savers.map((saver) => saver()));

    //
    //     if (DEBUG) {
    //       await this.#items.save();
    //       await this.#storeItems.save();
    //       return Promise.resolve();
    //     }
    //     return Promise.all([this.#items.save(), this.#storeItems.save()]);
  };

  save = async () => {
    console.log('API: save');

    const thingsToSave = [this.#stores, this.#categories];
    const savers = thingsToSave.map((thing) => () => (thing.isEmpty ? Promise.resolve() : thing.save()));

    if (DEBUG) {
      // save each thing in order
      const saveNext = () => {
        const nextSaver = savers.shift();
        if (nextSaver) {
          return nextSaver().then(saveNext);
        }
        return Promise.resolve();
      };
      return saveNext();
    }
    return Promise.all(savers.map((saver) => saver()));
  };

  getItemsByCategory = () => {
    return {
      queryKey: ['items-by-category'],
      queryFn: async () => {
        console.log('API: getItemsByCategory');

        await this.#categories.fetchAllIfEmpty();
        const items = await this.#items.fetchAllIfEmpty();

        return items.reduce((acc, item) => {
          const category = this.#categories.findOne(item.categoryId);
          const categoryId = category?.id || UNCATEGORIZED_CATEGORY_ID;

          acc[categoryId] ||= [];
          acc[categoryId].push(item);
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

        await this.#stores.fetchAllIfEmpty();
        const items = await this.#items.fetchAllIfEmpty();
        const storeItems = await this.#storeItems.fetchAll();

        // build a StoreItem for any item that doesn't have a storeItem
        items.forEach((item) => {
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

    this.#storeItems.createOne(storeItem);
  };

  createItem = (item) => {
    console.log('API: createItem');

    this.#items.createOne(item);
  };

  getStores = () => {
    return {
      queryKey: ['stores'],
      queryFn: async () => {
        console.log('API: getStores');

        return this.#stores.fetchAll();
      },
    };
  };

  getCategories = () => {
    return {
      queryKey: ['categories'],
      queryFn: async () => {
        console.log('API: getCategories');

        return this.#categories.fetchAll();
      },
    };
  };
}
