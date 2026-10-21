# Checkbox state rubber-bands after edits

## Possible bug reports

- “I uncheck an item, and in half a second it checks itself again.”
- A checkbox briefly reflects the click, then returns to its previous state.

## Possible causes

- A save/refetch replaces the optimistically mutated model with a stale server response.
- A stale write is rejected by optimistic locking, but the UI does not surface or reconcile the conflict, leaving local and server state different.
- Multiple queued debounced saves or overlapping syncs complete out of order and the later response/refetch reflects an older value.

## Investigation

- `Item.onCheckUncheck` mutates `item.needed` and local `checked` state immediately, then schedules `sync()` (`app/javascript/components/Item.js`). The debounce delay is one second (`app/javascript/contexts/ApiContext.js`), so the reported half-second timing does not exactly match the scheduled request; a refetch/broadcast or other pending mutation may be involved.
- `f216c4c` introduced Action Cable invalidation. Its `received` callback invalidates item queries for every broadcast of `items` or `store_items`, including broadcasts caused by this same browser's successful save. That can trigger refetches while local edits and saves are in flight.
- The same commit added `lock_version` checks. `BagOfHolding.save()` throws on a non-OK response, and the mutation exposes an error state, but there is no conflict-specific UI reconciliation in `ApiContext`. A rejected stale write can therefore leave the optimistic checkbox showing a value that is not persisted.
- `b6658ad` added an effect in `Item` that copies `item.needed` into `checked` whenever the model value changes. This is sensible for external updates, but it makes model replacement/refetch directly capable of overwriting the optimistic local state.
- No controlled reproduction or network trace has been collected. The precise trigger and request ordering remain unverified.

## Suggestions

- Reproduce while recording PATCH requests, response statuses, Action Cable messages, and the model's `needed`/`lockVersion` values. Confirm whether the snap-back follows a 409, a broadcast-triggered refetch, or an overlapping save.
- Serialize sync mutations so there is only one in-flight write per client, and coalesce subsequent edits until it completes.
- On conflict, fetch the authoritative record and either apply it with a visible conflict indication or retry the user's latest intent against the new lock version; do not silently leave optimistic state divergent.
- Avoid invalidating/refetching data in response to the current client's own broadcast, or attach an origin/mutation identifier so only other clients reconcile it.
- Consider representing checkbox state as a single source of truth rather than duplicating the model value into component state, while preserving an explicit optimistic-update path.
