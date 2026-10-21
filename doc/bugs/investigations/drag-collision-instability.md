# Drag interactions produce unexpected moves

## Possible bug reports

- Dragged items land in unexpected containers or positions, or appear to reorder themselves during a drag.
- Drag behavior is less predictable after the October 2025 drag-and-drop changes.

## Possible causes

- Custom collision fallback retains a stale `lastOverId` across drag sessions.
- `onDragOver` applies mutations repeatedly as the collision target changes, while the helper keeps referencing mutable item objects.
- The October auto-scroll implementation and collision remeasurement interact in ways not covered by the existing tests.

## Investigation

- `SortableLists.js` stores `lastOverId` in a ref and updates it on collision, but does not clear it in `handleDragStart`, `handleDragEnd`, or `handleDragCancel`. When no current intersection is found, collision detection returns that old id. This is a concrete stale-target risk across separate drags.
- On each `onDragOver`, `SortableLists` resolves active/over items from the `allItems` prop and invokes `onReordering`. Shop can then mutate `order` and category/store associations directly on those shared objects.
- Commit `8237046` (Oct 7, 2025) introduced custom edge auto-scroll and collision handling changes. Commit `4b3c081` changed cross-container state updates and added drag-monitor coordination. These are plausible contributors to general drag instability, but no reproduction has been tied to either change.
- The February `f216c4c` change adds cross-user invalidation, which can cause query refreshes around edits, but does not modify `SortableLists` drag collision logic.
- The existing `doc/bugs/drag-and-drop.md` has two entries under “Open” that describe null event dereferences; the current `reorderPropsFromDragEvent` already guards null `active`/`over`. Those entries appear stale. This catalog entry is the current investigation record for unexpected movement.

## Suggestions

- Reset `lastOverId` at drag start and on terminal drag handlers, then verify empty-container and pointer-outside behavior explicitly.
- Make drag-over calculations pure and avoid mutating shared model instances until drag end; keep a drag-local projection for preview.
- Reproduce with pointer traces for same-container reorder, cross-container move, empty targets, rapid consecutive drags, and edge auto-scroll. Record active id, over id, container ids, and item order at each drag event.
- Add focused tests for collision fallback across consecutive drags and for `onDragOver` events where the active item has already been moved in the preview state.
