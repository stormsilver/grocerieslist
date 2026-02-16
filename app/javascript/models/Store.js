import { ApiModel } from './ApiModel';

export class Store extends ApiModel {
  name;

  updateFromApi({ id, name, lockVersion }) {
    this.id = id;
    this.name = name;
    this.lockVersion = lockVersion;
  }
}
