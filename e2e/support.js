import { execFileSync } from 'node:child_process';
import { expect } from '@playwright/test';

export const resetDatabase = (mode = 'default') => {
  execFileSync('bin/rails', ['runner', 'e2e/prepare_database.rb', mode], {
    env: { ...process.env, RAILS_ENV: 'test' },
    stdio: 'pipe',
  });
};

export const openShop = async (page, { viewportHeight = 10_000 } = {}) => {
  await page.setViewportSize({ width: 1280, height: viewportHeight });
  await page.goto('/shop');
  await expect(page.locator('.item-name')).toHaveCount(120);
};

export const listNames = (page, index = 0) =>
  page
    .locator('.sortable-list')
    .nth(index)
    .locator('.item-name')
    .evaluateAll((inputs) => inputs.map((input) => input.value));

export const dragOn = async (page, sourceName, targetName) => {
  const sourceRow = page.locator('.item').filter({ has: page.locator(`.item-name[value="${sourceName}"]`) });
  const targetRow = page.locator('.item').filter({ has: page.locator(`.item-name[value="${targetName}"]`) });
  const source = sourceRow.locator('.drag-handle');
  const target = targetRow.locator('.item-name');
  await source.scrollIntoViewIfNeeded();
  await target.scrollIntoViewIfNeeded();
  const sourceBounds = await source.boundingBox();
  const targetBounds = await target.boundingBox();
  const responsePromise = page.waitForResponse(
    (response) => response.request().method() === 'PATCH' && response.url().endsWith('/api/store_items'),
    { timeout: 10_000 }
  );

  await page.mouse.move(sourceBounds.x + sourceBounds.width / 2, sourceBounds.y + sourceBounds.height / 2);
  await page.mouse.down();
  await page.mouse.move(targetBounds.x + targetBounds.width / 2, targetBounds.y + targetBounds.height / 2, {
    steps: 1,
  });
  await page.mouse.up();

  return responsePromise;
};
