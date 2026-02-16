import { describe, expect, it } from 'vitest';
import { ApiModel } from '../ApiModel';

class TestModel extends ApiModel {
  name;

  constructor({ id, name, lockVersion } = {}) {
    super();
    this.id = id;
    this.name = name;
    this.lockVersion = lockVersion;
  }

  toApi() {
    return {
      ...super.toApi(),
      name: this.name,
    };
  }
}

describe('ApiModel', () => {
  it('includes lockVersion in API payloads', () => {
    const model = new TestModel({ id: 12, name: 'Milk', lockVersion: 3 });

    expect(model.toApi()).toEqual({
      id: 12,
      _destroy: undefined,
      lockVersion: 3,
      name: 'Milk',
    });
  });

  it('tracks deletion flags', () => {
    const model = new TestModel({ id: 5, name: 'Eggs', lockVersion: 1 });
    model.markForDeletion();

    expect(model.toApi()).toEqual({
      id: 5,
      _destroy: true,
      lockVersion: 1,
      name: 'Eggs',
    });
  });
});
