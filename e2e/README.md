# Browser tests

Run the store ordering end-to-end test with:

```sh
bun run test:e2e
```

The Playwright web server builds the current JavaScript and CSS, prepares the Rails **test** database, and seeds it with a dedicated household, 120 primary-store items, and a second store. Every test resets that database to a known scenario; workers are serialized because they share the database. Development data is not used.

The suite covers duplicate and invalid order values, fast repeated drags, directional drop behavior, release outside the list, edge auto-scroll, stale lock-version conflicts, Action Cable refreshes between clients, reversed API responses, store switching, and reload before the save debounce fires. It captures PATCH payloads and compares saved values with the rendered order where applicable.

Install the browser once after `bun install`:

```sh
bunx playwright install chromium
```
