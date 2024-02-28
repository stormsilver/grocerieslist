export class Item {
  id;

  name;

  needed;

  categoryId;

  updateFromApi({ id, name, needed, categoryId }) {
    this.id = id;
    this.name = name;
    this.needed = needed;
    this.categoryId = categoryId;
  }
}
