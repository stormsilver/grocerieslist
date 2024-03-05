export class BagOfHolding {
  apiPath;

  klass;

  key;

  #storage;

  #newInstances;

  #beforeInstantiation;

  #afterFetch;

  constructor({ apiPath, key, klass, beforeInstantiation = null, afterFetch = null }) {
    this.apiPath = apiPath;
    this.klass = klass;
    this.key = key;
    this.#storage = {};
    this.#beforeInstantiation = beforeInstantiation;
    this.#afterFetch = afterFetch;

    this.#reset();
  }

  get isEmpty() {
    return Object.keys(this.#storage).length === 0;
  }

  async fetchAllIfEmpty() {
    if (this.isEmpty) {
      return this.fetchAll();
    }
    return Object.values(this.#storage);
  }

  async fetchAll() {
    const dataFromApi = await fetch(this.apiPath).then((res) => res.json());
    if (this.#afterFetch) {
      this.#afterFetch(dataFromApi);
    }
    this.#reset();

    return dataFromApi.map((data) => {
      // eslint-disable-next-line new-cap -- klass is a class
      const instance = new this.klass();
      if (this.#beforeInstantiation) {
        this.#beforeInstantiation(data);
      }
      instance.updateFromApi(data);
      this.#storage[instance.id] = instance;
      return instance;
    });
  }

  findOne(id) {
    return this.#storage[id];
  }

  createOne(data) {
    this.#newInstances.push(data);
  }

  async save() {
    const body = this.#newInstances.concat(Object.values(this.#storage)).map((instance) => instance.toApi());
    await fetch(this.apiPath, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ [this.key]: body }),
    });
    this.#reset();
  }

  #reset() {
    this.#storage = {};
    this.#newInstances = [];
  }
}
