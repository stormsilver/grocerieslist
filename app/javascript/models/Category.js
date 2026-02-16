import { ApiModel } from './ApiModel';

export class Category extends ApiModel {
  name;

  updateFromApi({ id, name, lockVersion }) {
    this.id = id;
    this.name = name;
    this.lockVersion = lockVersion;
  }
}
