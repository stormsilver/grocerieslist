import { ApiModel } from './ApiModel';

export class Store extends ApiModel {
  name;

  updateFromApi({ id, name }) {
    this.id = id;
    this.name = name;
  }
}
