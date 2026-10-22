import { expect, test } from '@playwright/test';
import { dragOn, listNames, openShop, resetDatabase } from './support';

const itemIdsByName = async (page) => {
  const items = await (await page.request.get('/api/items')).json();
  return Object.fromEntries(items.map(({ id, name }) => [name, id]));
};

const storeItems = async (page) => (await page.request.get('/api/store_items')).json();

const reorderAtTarget = (names, activeName, overName) => {
  const nextNames = names.filter((name) => name !== activeName);
  nextNames.splice(names.indexOf(overName), 0, activeName);
  return nextNames;
};

const expectSavedOrder = async (page, expectedNames) => {
  const itemIds = await itemIdsByName(page);
  const stores = await (await page.request.get('/api/stores')).json();
  const primaryStoreId = stores.find(({ name }) => name === 'Playwright store').id;
  const persisted = await storeItems(page);
  const ordered = persisted
    .filter((storeItem) => storeItem.storeId === primaryStoreId && storeItem.order != null)
    .sort((left, right) => left.order - right.order);
  expect(ordered.map(({ itemId }) => itemIdsById(itemIds, itemId))).toEqual(expectedNames);
};

const itemIdsById = (itemIds, id) => Object.keys(itemIds).find((name) => itemIds[name] === id);

test('tied order values use the name tie-breaker, so renaming a tied item changes its displayed position', async ({
  page,
}) => {
  resetDatabase('duplicates');
  await openShop(page);

  const firstTwelve = await page
    .locator('.sortable-list')
    .first()
    .locator('.item-name')
    .evaluateAll((inputs) => inputs.slice(0, 12).map((input) => input.value));
  expect(firstTwelve.slice(-2)).toEqual(['A tie', 'Z tie']);
  const stores = await (await page.request.get('/api/stores')).json();
  const primaryStoreId = stores.find(({ name }) => name === 'Playwright store').id;
  const tieRows = (await storeItems(page)).filter(
    (storeItem) => storeItem.storeId === primaryStoreId && storeItem.order === 11
  );
  expect(tieRows).toHaveLength(2);

  const item = page.locator('.item-name[value="A tie"]');
  const itemSave = page.waitForResponse(
    (response) => response.request().method() === 'PATCH' && response.url().endsWith('/api/items'),
    { timeout: 10_000 }
  );
  await item.fill('ZZ tie');
  expect((await itemSave).status()).toBe(204);
  await expect
    .poll(() => listNames(page).then((names) => names.slice(9, 12)))
    .toEqual(['Product 010', 'Z tie', 'ZZ tie']);
});

test('releasing outside the list keeps the last valid drop target for that drag', async ({ page }) => {
  resetDatabase();
  await openShop(page);
  const before = await listNames(page);
  const newOrder = reorderAtTarget(before, 'Product 030', 'Product 020');
  const responsePromise = page.waitForResponse(
    (response) => response.request().method() === 'PATCH' && response.url().endsWith('/api/store_items'),
    { timeout: 10_000 }
  );

  const source = page
    .locator('.item')
    .filter({ has: page.locator('.item-name[value="Product 030"]') })
    .locator('.drag-handle');
  const target = page.locator('.item-name[value="Product 020"]');
  const sourceBounds = await source.boundingBox();
  const targetBounds = await target.boundingBox();
  await page.mouse.move(sourceBounds.x + 5, sourceBounds.y + 5);
  await page.mouse.down();
  await page.mouse.move(targetBounds.x + targetBounds.width / 2, targetBounds.y + targetBounds.height / 2, {
    steps: 3,
  });
  await page.mouse.move(-20, 100, { steps: 1 });
  await page.mouse.up();

  expect((await responsePromise).status()).toBe(204);
  await expect.poll(() => listNames(page)).toEqual(newOrder);
  await expectSavedOrder(page, newOrder);

  const afterFirstDrag = await listNames(page);
  const patches = [];
  page.on('request', (request) => {
    if (request.method() === 'PATCH' && request.url().endsWith('/api/store_items')) patches.push(request);
  });
  const secondSource = page
    .locator('.item')
    .filter({ has: page.locator('.item-name[value="Product 040"]') })
    .locator('.drag-handle');
  const secondBounds = await secondSource.boundingBox();
  await page.mouse.move(secondBounds.x + 5, secondBounds.y + 5);
  await page.mouse.down();
  await page.mouse.move(-20, 100, { steps: 1 });
  await page.mouse.up();
  await page.waitForTimeout(1_100);
  expect(patches).toHaveLength(0);
  expect(await listNames(page)).toEqual(afterFirstDrag);
});

test('dragging down lands after the target row and dragging up lands before it', async ({ page }) => {
  resetDatabase();
  await openShop(page);
  let names = await listNames(page);

  const downwardSave = await dragOn(page, 'Product 010', 'Product 020');
  expect(downwardSave.status()).toBe(204);
  names = reorderAtTarget(names, 'Product 010', 'Product 020');
  await expect.poll(() => listNames(page)).toEqual(names);
  expect(names.indexOf('Product 010')).toBe(names.indexOf('Product 020') + 1);

  const upwardSave = await dragOn(page, 'Product 030', 'Product 015');
  expect(upwardSave.status()).toBe(204);
  names = reorderAtTarget(names, 'Product 030', 'Product 015');
  await expect.poll(() => listNames(page)).toEqual(names);
  expect(names.indexOf('Product 030')).toBe(names.indexOf('Product 015') - 1);
  await expectSavedOrder(page, names);
});

test('edge auto-scroll can move an item down a long list and persists the resulting order', async ({ page }) => {
  resetDatabase();
  await openShop(page, { viewportHeight: 900 });
  const source = page
    .locator('.item')
    .filter({ has: page.locator('.item-name[value="Product 003"]') })
    .locator('.drag-handle');
  const sourceBounds = await source.boundingBox();
  await page.mouse.move(sourceBounds.x + 5, sourceBounds.y + 5);
  await page.mouse.down();
  await page.mouse.move(1000, 810, { steps: 5 });
  await expect.poll(() => page.evaluate(() => window.scrollY), { timeout: 5_000 }).toBeGreaterThan(0);
  await page.waitForTimeout(250);

  const responsePromise = page.waitForResponse(
    (response) => response.request().method() === 'PATCH' && response.url().endsWith('/api/store_items'),
    { timeout: 10_000 }
  );
  await page.mouse.up();
  expect((await responsePromise).status()).toBe(204);
  const after = await listNames(page);
  expect(after).toHaveLength(120);
  expect(after[0]).not.toBe('Product 003');
  expect(new Set(after).size).toBe(120);
  await expectSavedOrder(page, after);
  await page.reload();
  await expect.poll(() => listNames(page)).toEqual(after);
});

test('a stale lock version rejects the whole order update and reload restores persisted values', async ({ page }) => {
  resetDatabase();
  await openShop(page);
  const before = await listNames(page);
  let submittedBody;
  let conflictBody;

  await page.route('**/api/store_items', async (route) => {
    if (route.request().method() !== 'PATCH') return route.continue();
    submittedBody = route.request().postDataJSON();
    submittedBody.storeItems[0].lockVersion += 1;
    const response = await route.fetch({ postData: JSON.stringify(submittedBody) });
    conflictBody = await response.json();
    await route.fulfill({ response });
  });

  const responsePromise = page.waitForResponse(
    (response) => response.request().method() === 'PATCH' && response.url().endsWith('/api/store_items'),
    { timeout: 10_000 }
  );
  const source = page.locator('.item-name[value="Product 030"]');
  const target = page.locator('.item-name[value="Product 010"]');
  const sourceBounds = await source.locator('xpath=../..').locator('.drag-handle').boundingBox();
  const targetBounds = await target.boundingBox();
  await page.mouse.move(sourceBounds.x + 5, sourceBounds.y + 5);
  await page.mouse.down();
  await page.mouse.move(targetBounds.x + targetBounds.width / 2, targetBounds.y + targetBounds.height / 2, {
    steps: 3,
  });
  await page.mouse.up();

  expect((await responsePromise).status()).toBe(409);
  expect(conflictBody.conflicts.length).toBeGreaterThan(0);
  await expect.poll(() => listNames(page)).not.toEqual(before);
  await page.reload();
  await expect.poll(() => listNames(page)).toEqual(before);
  const stores = await (await page.request.get('/api/stores')).json();
  const primaryStoreId = stores.find(({ name }) => name === 'Playwright store').id;
  const persisted = await storeItems(page);
  expect(
    persisted
      .filter((row) => row.storeId === primaryStoreId)
      .sort((left, right) => left.order - right.order)
      .map((row) => row.order)
  ).toEqual(Array.from({ length: 120 }, (_, index) => index + 1));
});

test('another client update broadcasts and refreshes the store order', async ({ browser }) => {
  resetDatabase();
  const firstPage = await browser.newPage({ viewport: { width: 1280, height: 10_000 } });
  const secondPage = await browser.newPage({ viewport: { width: 1280, height: 10_000 } });
  await openShop(firstPage);
  await openShop(secondPage);
  const expected = reorderAtTarget(await listNames(firstPage), 'Product 030', 'Product 010');

  expect((await dragOn(firstPage, 'Product 030', 'Product 010')).status()).toBe(204);
  await expect.poll(() => listNames(secondPage)).toEqual(expected);
  await expect.poll(() => listNames(firstPage)).toEqual(expected);

  await firstPage.close();
  await secondPage.close();
});

test('zero and null orders display as unordered while negative order remains ordered', async ({ page }) => {
  resetDatabase('invalid');
  await openShop(page);

  expect(await listNames(page)).toEqual([
    'Product 003',
    ...Array.from({ length: 117 }, (_, index) => `Product ${String(index + 4).padStart(3, '0')}`),
  ]);
  expect(await listNames(page, 1)).toEqual(['Product 001', 'Product 002']);
});

test('the ordered section sorts correctly even when the API returns rows in reverse order', async ({ page }) => {
  resetDatabase();
  await page.route('**/api/store_items', async (route) => {
    if (route.request().method() !== 'GET') return route.continue();
    const response = await route.fetch();
    const rows = await response.json();
    await route.fulfill({ response, body: JSON.stringify(rows.reverse()) });
  });
  await openShop(page);
  expect(await listNames(page)).toEqual(
    Array.from({ length: 120 }, (_, index) => `Product ${String(index + 1).padStart(3, '0')}`)
  );
});

test('switching stores settles on that store’s independent order', async ({ page }) => {
  resetDatabase();
  await openShop(page);
  await page.locator('select.form-select').selectOption({ label: 'Second Playwright store' });
  await expect.poll(() => listNames(page)).toEqual(['Product 002', 'Product 003', 'Product 001']);
});

test('reloading before the debounce fires discards the local-only drag', async ({ page }) => {
  resetDatabase();
  await openShop(page);
  const before = await listNames(page);
  const patches = [];
  page.on('request', (request) => {
    if (request.method() === 'PATCH' && request.url().endsWith('/api/store_items')) patches.push(request);
  });

  const source = page.locator('.item-name[value="Product 030"]');
  const target = page.locator('.item-name[value="Product 010"]');
  const sourceBounds = await source.locator('xpath=../..').locator('.drag-handle').boundingBox();
  const targetBounds = await target.boundingBox();
  await page.mouse.move(sourceBounds.x + 5, sourceBounds.y + 5);
  await page.mouse.down();
  await page.mouse.move(targetBounds.x + targetBounds.width / 2, targetBounds.y + targetBounds.height / 2, {
    steps: 3,
  });
  await page.mouse.up();
  await page.reload();
  await expect.poll(() => listNames(page)).toEqual(before);
  await page.waitForTimeout(1_100);
  expect(patches).toHaveLength(0);
});
