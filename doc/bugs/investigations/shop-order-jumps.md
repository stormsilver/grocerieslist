# Shop item order jumps after dragging

Status: resolved October 21, 2026.

## Possible bug reports

- Ordered items move to unexpected positions after dragging.
- Showing all items after reordering a generated-list subset changes the relative placement of items.
- A change in which rows are visible when entering or leaving Generate list mode is mistaken for a saved reorder.

## Possible causes

- Dragging while “Generate list” is active can renumber only the snapshot subset, leaving items outside the snapshot with their previous order values and creating ties.
- The Shop comparator breaks tied order values alphabetically, which can make an item appear to jump away from its drop position.

## Investigation

- Generate list is a snapshot: `Shop.js` captures the IDs of items marked needed when the mode is entered and uses those IDs to build all three sections. Checking an item or receiving refreshed query data does not remove that ID from the snapshot. Exiting and re-entering creates a new snapshot.
- `ShopItems` receives `neededItemsOnly={false}` in the current implementation, so checked rows in the snapshot are not hidden by `Item`. The earlier claim that checking an item itself changes the visible subset is no longer accurate.
- Before resolution, `updateOrderedItems` assigned consecutive order values only to the ordered items currently in `sortedItems['current-ordered']`. In Generate list mode that was only the snapshot subset. Items outside it retained their former order values.
- When **Show all** restored the full set, those untouched items could share an order value with a reordered visible item. The alphabetical tie-break could then put an item somewhere other than its drop position. Example: visible A(order 1) and C(order 3), hidden B(order 2); moving C before A assigned C=1 and A=2 while B remained 2.
- `Shop.js` sorts arrays returned by `.filter()`, so those sorts do not reorder the source `itemsByStore` arrays. `updateOrderedItems` does mutate shared StoreItem objects' `order` values, which is directly relevant to persistence, but sorting in the effect is not itself mutating the source arrays.
- `b6658ad` introduced filtering by current `needed` values. The follow-up changed this to a stable product-ID snapshot, preserving the clarified visibility behavior.
- The fix now reorders the visible subset for the drag preview, then inserts the dropped item into the full ordered sequence immediately before its next visible neighbor. At the end of the visible list it inserts immediately after the previous visible neighbor. It then renumbers the full sequence, including snapshot-hidden items, so ties are not introduced.
- The Shop regression test covers checking/refetching snapshot membership and dragging a visible item around a hidden ordered item while keeping all order values unique.

## Suggestions

- Continue to keep snapshot membership separate from order persistence. Add coverage for dropping at the end of the visible list and for moving items into or out of **In order** while a snapshot is active.
