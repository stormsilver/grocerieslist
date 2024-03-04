import { ApiModel } from './ApiModel';

export class Category extends ApiModel {
  name;

  updateFromApi({ id, name }) {
    this.id = id;
    this.name = name;
  }
}
