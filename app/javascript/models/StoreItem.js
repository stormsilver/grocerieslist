import { ApiModel } from './ApiModel';

export class StoreItem extends ApiModel {
  static #currentFakeId;

  static #nextFakeId = () => {
    if (!this.#currentFakeId) this.#currentFakeId = 0;
    return `f-${++this.#currentFakeId}`;
  };

  item;

  store;

  order;

  #fakeId;

  constructor({ store, order, item } = {}) {
    super();
    this.item = item;
    this.store = store;
    this.order = order;
    this.#fakeId = StoreItem.#nextFakeId();
    this.id = this.#fakeId;
  }

  get itemId() {
    return this.item.id;
  }

  get name() {
    return this.item.name;
  }

  set name(value) {
    this.item.name = value;
  }

  get needed() {
    return this.item.needed;
  }

  set needed(value) {
    this.item.needed = value;
  }

  updateFromApi({ id, store, order, item }) {
    this.id = id;
    this.store = store;
    this.order = order;
    this.item = item;
  }

  toApi() {
    return {
      ...super.toApi(),
      id: this.id === this.#fakeId ? undefined : this.id,
      storeId: this.store?.id,
      order: this.order,
      itemId: this.item?.id,
    };
  }
}
