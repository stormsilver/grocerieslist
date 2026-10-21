# Checkbox state diverges between users or refreshes

## Possible bug reports

- “I KNOW I checked that item, why is it unchecked?”
- The reverse: an item appears checked on one screen but unchecked on another, or its value changes after navigation/reload.

## Possible causes

- A stale client overwrites a newer value or presents an optimistic value after its write failed.
- Invalidation refetches do not refresh all cached model records consistently.
- A checkbox update races with another edit because the whole item record participates in a bulk PATCH.

## Investigation

- Item `needed` is stored on the shared `Item` model, but Shop renders `StoreItem` wrappers that proxy `needed` to the linked item (`app/javascript/models/StoreItem.js`). The Products and Shop views consequently share mutable model instances inside the singleton `Api`.
- `f216c4c` added optimistic locking and lock-version validation to the controllers. This should prevent stale overwrites at the database layer, but the client does not handle the returned conflict payload by reconciling the changed record. `BagOfHolding.save()` throws `SaveError`; the UI only gets generic mutation error state.
- The Action Cable message includes `updates` and `deletes`, but the client callback uses only `message.type` to invalidate queries. It discards the update records and their new lock versions.
- Query refresh behavior is asymmetric: item/category/store bags use `fetchAllIfEmpty()`, which can return existing in-memory instances without a network fetch, while store items use `fetchAll()` on every Shop query. Thus one query may combine cached item values with freshly fetched store-item records.
- There is no dedicated per-record cache reconciliation or evidence yet that this asymmetry alone causes the reported divergence. Backend conflict behavior and real request traces should be checked before attributing the report to it.

## Suggestions

- Treat broadcast payloads as authoritative updates: reconcile records and lock versions into the model cache, then invalidate affected query projections as needed.
- On stale-lock conflicts, refresh the affected record and present a clear choice or reapply the user's latest edit against the refreshed version.
- Ensure every refetch path has consistent semantics: either fetch authoritative records together or deliberately retain dirty local records while reconciling clean ones.
- Add a reproducible two-client scenario that edits the same item's `needed` flag in both orders and verifies the displayed value after save, conflict, broadcast, navigation, and reload.
