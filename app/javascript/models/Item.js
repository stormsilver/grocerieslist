import { ApiModel } from './ApiModel';

export class Item extends ApiModel {
  name;

  needed;

  categoryId;

  hidden;

  get itemId() {
    return this.id;
  }

  constructor({ name, needed, categoryId } = {}) {
    super();
    this.name = name;
    this.needed = needed;
    this.categoryId = categoryId;
  }

  updateFromApi({ id, name, needed, categoryId, lockVersion }) {
    this.id = id;
    this.name = name;
    this.needed = needed;
    this.categoryId = categoryId;
    this.lockVersion = lockVersion;
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
