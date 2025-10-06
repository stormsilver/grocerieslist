# Drag-and-drop Bugs

## Resolved

### ✅ Collision detection filtered out whole containers *(resolved October 6, 2025)*
- **Location:** `app/javascript/components/SortableLists.js` around the collision detection strategy.
- **What happened:** The strategy treated `allItems` like a dictionary keyed by container id, so any id that happened to match an array index caused entire containers to disappear from hit tests.
- **Outcome:** Replaced the lookup with explicit `itemsByContainer` metadata, allowing all containers to remain visible to the collision algorithm.

## Open

### 1. `recentlyMovedToNewContainer` never resets
- **Location:** `app/javascript/components/SortableLists.js` lines 53-55 and 123-127.
- **What happens:** The flag is set to `true` once an item crosses containers but it only resets in a `useEffect` tied to the `allItems` prop. Reordering does not touch `allItems`, so the effect never reruns.
- **User impact:** With the flag stuck, the fallback path writes `lastOverId.current = activeId` every time the pointer leaves a droppable, biasing hit tests toward the origin container and making drops appear to snap back.
- **Fix ideas:** Reset the flag inside `handleDragEnd` or via a `requestAnimationFrame` callback with an empty dependency array.

### 2. List view re-sorts alphabetically after every drop
- **Location:** `app/javascript/components/List.js` lines 30-47.
- **What happens:** Both the initial `useEffect` and the `onReordering` handler call `.sort(sortByName)` on the category arrays, so the destination bucket snaps back to alphabetical order right after the drop.
- **User impact:** Items ignore the drop target the user chose and pop to unrelated positions, making the reorder feel random.
- **Fix ideas:** Use the index supplied by `@dnd-kit` (`over`) to place `activeItem` and reserve alphabetical sorting for read-only views.

### 3. Dropping in the Shop view always sends the item to the top when `overItem` is missing
- **Location:** `app/javascript/components/Shop.js` lines 15-22.
- **What happens:** `updateOrderedItems` falls back to `overIndex = 0` whenever `overItem` is undefined, which happens when the user drops below the final row or into an empty container.
- **User impact:** Items jump to the top of the "In order" list even if the user dropped them at the bottom, so the list appears to reorder itself.
- **Fix ideas:** When `overItem` is missing, append (`orderedItems.length`) or reuse the cached `lastOverId` so the item lands where it was dropped.

### 4. Empty categories do not accept drops
- **Location:** `app/javascript/components/SortableList.js` and `.sortable-list` styles in `app/assets/stylesheets/application.bootstrap.scss`.
- **What happens:** When a category has no items, the `SortableList` renders an empty `<div>` as the droppable surface. The element collapses to zero height, so `pointerWithin`/`rectIntersection` never register a collision and `onDragOver`/`onDragEnd` receive `over = null`.
- **User impact:** Users cannot drag items into empty categories in the Products tab; the item simply snaps back to its origin container.
- **Fix ideas:** Give the empty droppable a minimum height (e.g. via an `::after` placeholder) or render a dedicated placeholder item so the container always exposes a hit box.
