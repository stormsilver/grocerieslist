export class Store {
  id;

  name;

  updateFromApi({ id, name }) {
    this.id = id;
    this.name = name;
  }
}
