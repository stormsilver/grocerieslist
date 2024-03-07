import { ApiModel } from './ApiModel';

export class Item extends ApiModel {
  name;

  needed;

  categoryId;

  hidden;

  get itemId() {
    return this.id;
  }

  updateFromApi({ id, name, needed, categoryId }) {
    this.id = id;
    this.name = name;
    this.needed = needed;
    this.categoryId = categoryId;
  }

  toApi() {
    return {
      ...super.toApi(),
      name: this.name,
      needed: this.needed,
      categoryId: this.categoryId,
    };
  }
}
