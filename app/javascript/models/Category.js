export class Category {
  id;

  name;

  updateFromApi({ id, name }) {
    this.id = id;
    this.name = name;
  }
}
