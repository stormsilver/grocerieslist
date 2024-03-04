export class ApiModel {
  id;

  #newRecord = false;

  #destroy = false;

  markForDeletion() {
    this.destroy = true;
  }

  unmarkForDeletion() {
    this.destroy = false;
  }

  get isMarkedForDeletion() {
    return this.destroy;
  }

  markForNew() {
    this.#newRecord = true;
  }

  unmarkForNew() {
    this.#newRecord = false;
  }

  get isMarkedForNew() {
    return this.#newRecord;
  }

  toApi() {
    return {
      id: this.id,
      _destroy: this.destroy,
    };
  }
}
