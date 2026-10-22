# Store items appear in the wrong order

Status: investigation open. The reported production behavior has not been reproduced in the current code during this investigation.

## Symptom

After loading or editing a store list, items can appear somewhere other than the position the user expects. This can mean either that the stored `order` values changed, that the UI rendered valid values in an unexpected sequence, or that an unsaved local order disappeared after refresh. Those cases need to be distinguished before assigning a cause.

## Current evidence

- `Shop.js` explicitly sorts ordered rows by numeric `order`; it uses the product name as a tie-breaker. The Rails `store_items` endpoint returns `StoreItem.all` without an `ORDER BY`, but fetch order by itself should not change the ordered section because the client sorts it.
- The current reorder path previews a move in React state, then on drop inserts the moved row into the full store order and assigns consecutive order values to the full sequence. This accounts for rows hidden by Generate list mode.
- The Playwright suite now covers each listed theory with a dedicated browser scenario. Its 120-row stress test performs six fast, real mouse drags; every captured PATCH matches the changed rows, and the full list matches after reload. This did not reproduce a stale drag-end state.
- Additional browser checks confirmed name-based display ordering for tied values, correct persistence through edge auto-scroll, HTTP 409 handling for a stale lock version, Action Cable refresh between two clients, sorting despite reversed API rows, invalid-value bucket behavior, and the settled order after switching stores.
- The collision test confirmed a drag released outside the list uses that drag's last valid target, then checked that a second drag leaving the list without a valid target does not reuse the previous drag's target. Neither check reproduced an unexpected persisted order.
- Reloading immediately after a drop, before the one-second debounce sends a PATCH, did discard the local-only reorder. This reproduces an unsaved-change loss, not a server-side reorder. Waiting for a PATCH and reloading preserved the order.
- The 120-row test uses an unusually tall viewport so all rows remain visible; the separate auto-scroll test covers the edge-scroll path. Generated-list filtering during a drag and two users editing simultaneously remain untested.
- Dragging downward onto a row places the moved row after that target; dragging upward places it before. This follows the index-based `arrayMove` behavior and was visible in the captured PATCH. If the intended interaction is “insert before the row under the pointer” in both directions, that expectation differs from current behavior.

## Theories

### 1. Duplicate order values make the name tie-break override the drop position

**Status: confirmed display mechanism; a current source of duplicate values is not established.**

`Shop.js` sorts equal order values alphabetically by item name. Therefore, two rows with the same `order` do not have a stable user-defined relative position: a rename or refetch can make them appear in a different order. The database has no uniqueness constraint or model validation for `store_items.order`.

This also occurred in an earlier implementation: Generate list mode renumbered only visible rows while hidden rows kept their old values. Restoring all rows could produce ties. The current implementation instead inserts into and renumbers the full ordered sequence, and the existing investigation records that fix. Duplicate values could still come from pre-existing data, manual/API updates, concurrent or failed editing paths, or another writer; none of those has been tied to a current report.

**Check:** compare each store's raw `store_items` response or database values. Look for repeated non-null `order` values. If ties exist, compare the tied products' names with their displayed sequence.

### 2. Collision detection retains a previous drop target

**Status: concrete risk in code; not yet reproduced as an order corruption.**

`SortableLists.js` stores `lastOverId` in a ref. Collision detection returns that ID when the current pointer has no intersection, and the ref is not cleared at drag start, end, or cancel. A drag that briefly loses a collision can therefore resolve to an old target, potentially even one from a previous drag. The final target passed to `Shop.onReordered` determines where the item is inserted.

The 120-item test kept all rows visible and dropped directly on row targets. It did not hit this fallback path. The separate drag-collision investigation also identifies this as a risk.

**Check:** reproduce with pointer traces that leave the list, move over gaps/empty containers, cancel, or start a second drag. Record `active.id`, `over.id`, container IDs, and whether the collision was current or reused from `lastOverId`.

### 3. A rapid drag-end uses an out-of-date React order snapshot

**Status: plausible, not reproduced by current browser stress test.**

`onReordering` updates `sortedItems` during drag-over. `onReordered` uses the `sortedItems` value captured by its render to determine the visible sequence, then mutates the shared store-item objects and schedules a save. If a drag-end callback ran with a render that did not include the final drag-over update, insertion around the wrong visible neighbor could produce a valid but unexpected full order.

Six fast drags on a 120-row list produced the expected PATCH values and reload order, which weighs against this happening on the ordinary same-container path. It does not prove the race impossible under other event sequences, auto-scroll, container transitions, or query refreshes during a drag.

**Check:** for a reproduction, capture the final `active` and `over` IDs, the visible ordered IDs used at drag end, the full pre-drag order, and the submitted PATCH. Compare those values before changing the implementation.

### 4. Drag target semantics differ from what the user expects

**Status: confirmed behavior; whether it is a bug depends on the intended interaction.**

`reorderVisibleItems` calls `arrayMove` with the active and over indexes. Moving down to a row places the active item after that row; moving up places it before. The stress test initially expected “before” in both directions; the captured payload showed the app consistently used the over-index semantics instead. This can look like an off-by-one or wrong drop even when the saved order matches the current implementation.

**Check:** clarify whether the expected behavior is “take the target row's index” or “insert before the target row,” and test drops in both directions against that rule.

### 5. Drag collision or auto-scroll selects a different row than the one the user sees

**Status: plausible; not covered by the 120-row capture.**

`SortableLists.js` combines pointer intersections, rectangle intersections, `closestCenter`, cached collision targets, and custom edge scrolling. With dense rows, scrolling, or a pointer near a row boundary, the resolved `over` item may not be the row the user intended. `Shop` then correctly saves according to the resolved target, which still looks like an order jump to the user.

**Check:** capture pointer coordinates, the active rectangle, the collision result, and the final PATCH while reproducing with normal viewport height and auto-scroll enabled.

### 6. A save conflict or failed request leaves the optimistic order visible temporarily

**Status: plausible and directly supported by save/error behavior; not reproduced as silent persistence.**

`BagOfHolding.save()` resets its local store only after a successful response. The bulk controller checks `lock_version` and returns a conflict if another client changed a row. A failed mutation sets the sync error state, but the current client does not restore the prior order in place. Since the order was changed on shared model objects before the request, the page may continue to show the attempted order until data is refetched or the page reloads. The database transaction prevents a partially applied bulk update when the controller reports a conflict.

This path is more likely to explain “it looked right, then jumped back after refresh” or a red sync indicator than a silently scrambled database order.

**Check:** inspect the PATCH response status/body and sync indicator. Look for HTTP 409 conflicts or 422 validation errors; compare the local order with a fresh GET after the response.

### 7. Concurrent edits or Action Cable refetches overlap a drag

**Status: plausible, not reproduced.**

Another user's successful change broadcasts a `store_items` event, which invalidates the store query. A refetch during a drag can replace the model objects and recompute visible rows while the active drag still refers to IDs and state from earlier renders. Optimistic locking should reject stale writes rather than silently overwrite them, but the timing could produce a transient display change or a conflict.

**Check:** reproduce with two clients editing the same store and record Action Cable events, query refetches, lock versions, drag targets, and PATCH responses.

### 8. Unordered or invalid values are interpreted differently from expected

**Status: confirmed edge-case behavior; no evidence these values exist in affected data.**

The UI uses truthiness (`item.order`) to split ordered and unordered rows. `null` and `0` appear in the Unordered section; negative numbers appear in the ordered section. The model and schema do not enforce positive, contiguous order values. Gaps do not themselves change relative order, but zero, negative, or duplicate values can make rows appear in a surprising section or sequence.

**Check:** inspect raw values for `null`, `0`, negatives, duplicates, or unexpectedly large gaps. A gap is lower priority unless another consumer assumes contiguous values.

### 9. A store switch briefly renders the previous store's derived rows

**Status: possible transient UI effect; not a persisted reorder.**

`ShoppingList` recomputes `sortedItems` in an effect after `currentStore.id` changes. React can render once with the previous `sortedItems` before that effect updates the sections. This could briefly show the previous store's list after changing stores, but should settle on the new store and does not by itself alter saved order.

**Check:** note whether the wrong rows appear only immediately after switching stores or remain after the list settles.

### 10. An unflushed debounced save is lost when the page closes

**Status: plausible unsaved-change path; not a server-side reorder.**

`sync()` schedules persistence after a one-second debounce. Closing/reloading the page before the request starts could discard a local order that was visible optimistically. This would make the order revert on the next load, rather than save in a different order.

**Check:** wait for the sync indicator to finish before reload, and verify a PATCH response occurred. Compare with an immediate reload after drop.

## Less likely explanations

- **Unordered API response order:** `/api/store_items` has no explicit SQL order, but the Shop UI sorts the ordered bucket by `order`; this alone does not explain the ordered section appearing randomly.
- **Rails changing submitted order values:** the bulk controller assigns the submitted `order` and saves the records in a transaction. No server-side reorder algorithm was found.
- **A stale drag-end snapshot on an ordinary drag:** the 120-product, six-drag Playwright test did not reproduce it. Keep it open only for event patterns not covered by that test.

## Evidence to collect on the next real report

1. Record the store, time, browser, whether Generate list mode or another client was active, and whether the order was wrong immediately or only after reload.
2. Before dragging, capture each relevant item's ID, name, store-item ID, and `order` from a fresh `/api/store_items` response.
3. Capture drag start/over/end IDs and container IDs, including whether collision detection fell back to `lastOverId` and whether auto-scroll was active.
4. Capture the `store_items` PATCH payload and response status/body.
5. Fetch the records again after the response and compare three sequences: database/API order values, the submitted values, and the rendered order.

The first boundary where those sequences differ identifies whether the problem is collision/interaction, client staging, save/conflict handling, or display sorting.
