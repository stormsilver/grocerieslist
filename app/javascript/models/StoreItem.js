export class StoreItem {
  id;

  item;

  store;

  order;

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
}
