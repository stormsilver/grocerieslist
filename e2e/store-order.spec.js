import { expect, test } from '@playwright/test';
import { resetDatabase } from './support';

const orderedNames = (page) => page.locator('.item-name').evaluateAll((inputs) => inputs.map((input) => input.value));

const reorderAtDropTarget = (currentOrder, itemName, targetName) => {
  const nextOrder = currentOrder.filter((name) => name !== itemName);
  nextOrder.splice(currentOrder.indexOf(targetName), 0, itemName);
  return nextOrder;
};

const dragBefore = async ({ page, itemName, targetName, currentOrder, itemIds }) => {
  const draggedItem = page.locator('.item').filter({ has: page.locator(`.item-name[value="${itemName}"]`) });
  const targetItem = page.locator('.item').filter({ has: page.locator(`.item-name[value="${targetName}"]`) });
  const sourceBounds = await draggedItem.locator('.drag-handle').boundingBox();
  const targetBounds = await targetItem.locator('.item-name').boundingBox();
  const saveResponse = page.waitForResponse(
    (response) => response.request().method() === 'PATCH' && response.url().endsWith('/api/store_items'),
    { timeout: 10_000 }
  );

  await page.mouse.move(sourceBounds.x + sourceBounds.width / 2, sourceBounds.y + sourceBounds.height / 2);
  await page.mouse.down();
  await page.mouse.move(targetBounds.x + targetBounds.width / 2, targetBounds.y + targetBounds.height / 2, {
    steps: 1,
  });
  await page.mouse.up();

  const response = await saveResponse;
  expect(response.status()).toBe(204);
  const payload = response.request().postDataJSON().storeItems;
  const nextOrder = reorderAtDropTarget(currentOrder, itemName, targetName);
  const expectedUpdates = nextOrder
    .filter((name, index) => name !== currentOrder[index])
    .map((name) => ({ itemId: itemIds[name], order: nextOrder.indexOf(name) + 1 }))
    .sort((left, right) => left.order - right.order);
  const savedOrder = payload
    .filter((storeItem) => storeItem.order != null)
    .map(({ itemId, order }) => ({ itemId, order }))
    .sort((left, right) => left.order - right.order);

  expect(savedOrder).toEqual(expectedUpdates);
  await expect.poll(() => orderedNames(page)).toEqual(nextOrder);
  return nextOrder;
};

test('fast drags in a large store list save and reload the full new order', async ({ page }) => {
  resetDatabase();
  await page.setViewportSize({ width: 1280, height: 10_000 });
  await page.goto('/shop');
  await expect(page.locator('.item-name')).toHaveCount(120);
  const initialOrder = Array.from({ length: 120 }, (_, index) => `Product ${String(index + 1).padStart(3, '0')}`);
  await expect.poll(() => orderedNames(page)).toEqual(initialOrder);
  const items = await (await page.request.get('/api/items')).json();
  const itemIds = Object.fromEntries(items.map(({ id, name }) => [name, id]));

  let expectedOrder = initialOrder;
  for (let repetition = 0; repetition < 3; repetition += 1) {
    expectedOrder = await dragBefore({
      page,
      itemName: 'Product 087',
      targetName: 'Product 012',
      currentOrder: expectedOrder,
      itemIds,
    });
    console.log(`Fast drag ${repetition * 2 + 1} saved ${expectedOrder[11]} at order 12`);

    expectedOrder = await dragBefore({
      page,
      itemName: 'Product 087',
      targetName: 'Product 088',
      currentOrder: expectedOrder,
      itemIds,
    });
    console.log(`Fast drag ${repetition * 2 + 2} saved ${expectedOrder[87]} at order 88`);
  }

  await page.reload();
  await expect(page.locator('.item-name')).toHaveCount(120);
  await expect.poll(() => orderedNames(page)).toEqual(expectedOrder);
});
