import { beforeEach, describe, expect, it, vi } from 'vitest';
import { BagOfHolding } from '../BagOfHolding';
import { ApiModel } from '../../models/ApiModel';

class TestModel extends ApiModel {
  name;

  constructor({ name, lockVersion } = {}) {
    super();
    this.name = name;
    this.lockVersion = lockVersion;
  }

  updateFromApi({ id, name, lockVersion }) {
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

describe('BagOfHolding', () => {
  beforeEach(() => {
    global.fetch = vi.fn();
  });

  it('saves only dirty and new instances', async () => {
    const bag = new BagOfHolding({ apiPath: '/api/tests', key: 'tests', klass: TestModel });

    fetch.mockResolvedValueOnce({
      json: vi.fn().mockResolvedValue([
        { id: 1, name: 'Apples', lockVersion: 2 },
        { id: 2, name: 'Bananas', lockVersion: 1 },
      ]),
    });

    await bag.fetchAll();

    const apples = bag.findOne(1);
    apples.name = 'Green Apples';

    const newItem = new TestModel({ name: 'Cherries' });
    bag.createOne(newItem);

    fetch.mockResolvedValueOnce({ ok: true });

    await bag.save();

    expect(fetch).toHaveBeenCalledTimes(2);
    const request = fetch.mock.calls[1][1];
    const body = JSON.parse(request.body);

    expect(body.tests).toHaveLength(2);
    expect(body.tests).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: 1, name: 'Green Apples', lockVersion: 2 }),
        expect.objectContaining({ name: 'Cherries' }),
      ])
    );
  });

  it('skips save when nothing is dirty', async () => {
    const bag = new BagOfHolding({ apiPath: '/api/tests', key: 'tests', klass: TestModel });

    fetch.mockResolvedValueOnce({
      json: vi.fn().mockResolvedValue([{ id: 1, name: 'Apples', lockVersion: 1 }]),
    });

    await bag.fetchAll();
    await bag.save();

    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it('reports non-empty when only new instances exist', () => {
    const bag = new BagOfHolding({ apiPath: '/api/tests', key: 'tests', klass: TestModel });

    bag.createOne(new TestModel({ name: 'Fresh' }));

    expect(bag.isEmpty).toBe(false);
  });
});
