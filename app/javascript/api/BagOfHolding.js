/* eslint-disable max-classes-per-file */
export class SaveError extends Error {
  response;

  status;

  details;

  constructor(kind, response, details = {}) {
    super(`Failed to save ${kind}`);
    this.response = response;
    this.status = response.status;
    this.details = details;
  }
}

export class BagOfHolding {
  apiPath;

  klass;

  key;

  #storage;

  #newInstances;

  #snapshots;

  #beforeInstantiation;

  #beforeSave;

  #afterFetch;

  constructor({ apiPath, key, klass, beforeInstantiation = null, beforeSave = null, afterFetch = null }) {
    this.apiPath = apiPath;
    this.klass = klass;
    this.key = key;
    this.#storage = {};
    this.#beforeInstantiation = beforeInstantiation;
    this.#beforeSave = beforeSave;
    this.#afterFetch = afterFetch;

    this.#reset();
  }

  get isEmpty() {
    return Object.keys(this.#storage).length === 0 && this.#newInstances.length === 0;
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
      this.#snapshots[instance.id] = this.#serialize(instance);
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
    const dirtyInstances = Object.values(this.#storage).filter((instance) => this.#isDirty(instance));
    let instances = this.#newInstances.concat(dirtyInstances);
    if (this.#beforeSave) {
      instances = this.#beforeSave(instances);
    }

    if (instances.length === 0) {
      return;
    }

    const payload = instances.map((instance) => instance.toApi());
    const response = await fetch(this.apiPath, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ [this.key]: payload }),
    });

    if (response.ok) {
      this.#reset();
    } else {
      const body = await response.json();
      throw new SaveError(this.key, response, body);
    }
  }

  #reset() {
    this.#storage = {};
    this.#newInstances = [];
    this.#snapshots = {};
  }

  #serialize(instance) {
    return JSON.stringify(instance.toApi());
  }

  #isDirty(instance) {
    const snapshot = this.#snapshots[instance.id];
    if (!snapshot) return true;
    return snapshot !== this.#serialize(instance);
  }
}
