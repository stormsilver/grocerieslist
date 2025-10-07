# Drag-and-drop Bugs

## Resolved

### ✅ Collision detection filtered out whole containers *(resolved October 6, 2025)*
- **Location:** `app/javascript/components/SortableLists.js` around the collision detection strategy.
- **What happened:** The strategy treated `allItems` like a dictionary keyed by container id, so any id that happened to match an array index caused entire containers to disappear from hit tests.
- **Outcome:** Replaced the lookup with explicit `itemsByContainer` metadata, allowing all containers to remain visible to the collision algorithm.

### ✅ `recentlyMovedToNewContainer` never resets *(resolved October 7, 2025)*
- **Location:** `app/javascript/components/SortableLists.js` drag handlers.
- **What happened:** The flag flipped to `true` when crossing containers but only reset in an effect keyed to `allItems`, which rarely changed during drag sessions, keeping the flag stuck.
- **Outcome:** Reset the flag directly within `handleDragEnd`/`handleDragCancel`, decoupling it from `allItems` updates so fallback collision logic no longer biases toward the origin container.

### ✅ Dropping in the Shop view always sent the item to the top when `overItem` was missing *(resolved October 7, 2025)*
- **Location:** `app/javascript/components/Shop.js` `updateOrderedItems` helper.
- **What happened:** When `@dnd-kit` reported the container droppable (e.g. dropping below the last row or into an empty list), `overItem` was `undefined` and the fallback index defaulted to `0`, forcing the item to the top of the "In order" section.
- **Outcome:** Normalized the fallback index to the list's tail, so container-level drops append instead of jumping to the front. We also guard against `findIndex` misses, keeping the helper robust for cross-container moves.

### ✅ Debounced sync interrupted active drags *(resolved October 7, 2025)*
- **Location:** `app/javascript/contexts/ApiContext.js` and `app/javascript/components/SortableLists.js`.
- **What happened:** The debounced `sync()` mutation could fire mid-drag, invalidating queries and forcing a re-render that cancelled the drag. Any pending drop then landed wherever the pointer happened to be at the moment of the forced update.
- **Outcome:** Introduced a lightweight drag monitor that tracks active drags. Sync requests now queue until all drags complete, preventing mid-drag re-renders. `SortableLists` notifies the monitor on drag start/end so the deferred sync executes immediately after the user drops or cancels.

### ✅ List view scroll jumped to top after saves *(resolved October 7, 2025)*
- **Location:** `app/javascript/components/Shop.js`.
- **What happened:** The Shop view forced a full remount by bumping a `key` whenever store data refreshed (e.g., after a save). That remount reset the page scroll position to the top.
- **Outcome:** Removed the render hack and now recompute hidden-state flags via state updates, so the list preserves scroll position when React Query refetches data.

### ✅ Empty categories did not accept drops *(resolved October 7, 2025)*
- **Location:** `app/javascript/components/SortableList.js` and `.sortable-list` styles in `app/assets/stylesheets/application.bootstrap.scss`.
- **What happened:** When a category had no items the droppable collapsed to zero height, so collision detection never triggered while dragging over it.
- **Outcome:** Added a compact placeholder and empty-state styling for open lists so the droppable surface stays active without affecting collapsed sections.

## Open

### 1. Dropping outside any container throws an exception
- **Location:** `app/javascript/components/SortableLists.js` (`reorderPropsFromDragEvent`).
- **What happens:** When a drag ends with `over === null` (e.g., the user releases the item outside a droppable zone), the helper still tries to access `over.data.current`, triggering a runtime error and aborting the drag clean-up.
- **User impact:** The UI crashes back to the "Something went wrong" overlay whenever someone drops outside the lists, forcing a hard refresh to recover.
- **Fix ideas:** Guard against `over` (and `active`) being `null` before dereferencing their metadata, and fall back to the cached `lastOverId` when available.

### 2. Collapsed categories cannot be targeted for drops
- **Location:** `app/javascript/components/list/Category.js` and `app/javascript/components/SortableList.js`.
- **What happens:** Collapsing a category hides its item list and removes the visible droppable surface. The container div shrinks to nearly zero height, so `@dnd-kit` never reports pointer intersections when hovering over the collapsed section.
- **User impact:** Items can’t be moved into collapsed categories without first expanding them, which defeats the purpose of collapsing for easier navigation.
- **Fix ideas:** Provide a header-level droppable or keep a slim placeholder hitbox visible when collapsed so users can drop directly onto the category title.

## Working as Intended

- Products/List categories automatically re-sort alphabetically after drops. That behavior is part of the design: only the Shop view's `current-ordered` section supports manual ordering, while all other buckets snap back to name order for consistency.
