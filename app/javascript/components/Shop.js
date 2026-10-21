import { useQuery } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import { arrayMove } from '@dnd-kit/sortable';
import { PageHeader } from './PageHeader';
import { StoreSelector } from './StoreSelector';
import { ShopItems } from './shop/ShopItems';
import { sortByName } from '../util';
import { useCurrentStore } from '../contexts/CurrentStoreContext';
import { useApi } from '../contexts/ApiContext';
import { Item } from './Item';
import { SortableLists } from './SortableLists';
import { StoreItem } from '../models/StoreItem';
import { NeededItemsToggle } from './shop/NeededItemsToggle';

const compareByOrder = (a, b) => {
  const diff = a.order - b.order;
  return diff === 0 ? sortByName(a, b) : diff;
};

const reorderVisibleItems = (orderedItems, activeItem, overItem) => {
  const activeIndex = orderedItems.findIndex((item) => item.id === activeItem.id);
  const fallbackIndex = Math.max(orderedItems.length - 1, 0);
  const overIndex = overItem ? orderedItems.findIndex((item) => item.id === overItem.id) : fallbackIndex;
  const normalizedActiveIndex = activeIndex === -1 ? fallbackIndex : activeIndex;
  const normalizedOverIndex = overIndex === -1 ? fallbackIndex : overIndex;
  return arrayMove(orderedItems, normalizedActiveIndex, normalizedOverIndex);
};

const assignOrder = (orderedItems) => {
  orderedItems.forEach((item, index) => {
    item.order = index + 1;
  });
};

const insertIntoFullOrder = (fullOrderedItems, visibleOrderedItems, activeItem) => {
  const orderedItems = fullOrderedItems.filter((item) => item.itemId !== activeItem.itemId);
  const activeIndex = visibleOrderedItems.findIndex((item) => item.id === activeItem.id);

  if (activeIndex === -1) {
    return orderedItems;
  }

  const nextVisibleItem = visibleOrderedItems[activeIndex + 1];
  const previousVisibleItem = visibleOrderedItems[activeIndex - 1];
  let insertionIndex = orderedItems.length;

  if (nextVisibleItem) {
    const nextIndex = orderedItems.findIndex((item) => item.itemId === nextVisibleItem.itemId);
    if (nextIndex !== -1) insertionIndex = nextIndex;
  } else if (previousVisibleItem) {
    const previousIndex = orderedItems.findIndex((item) => item.itemId === previousVisibleItem.itemId);
    if (previousIndex !== -1) insertionIndex = previousIndex + 1;
  }

  orderedItems.splice(insertionIndex, 0, activeItem);
  assignOrder(orderedItems);
  return orderedItems;
};

const ShoppingList = ({ currentStore, itemsByStore, generatedItemIds }) => {
  const { sync, api } = useApi();
  const [sortedItems, setSortedItems] = useState({
    'current-ordered': [],
    'current-unordered': [],
    'other-stores': [],
  });

  const allItems = useMemo(() => {
    return Object.entries(itemsByStore).flatMap(([_storeId, storeItems]) => storeItems);
  }, [itemsByStore]);

  useEffect(() => {
    // console.log('recomputing Shop sortedItems');
    const currentStoreKey = String(currentStore.id);
    const filterGeneratedItems = (items) =>
      generatedItemIds === null ? items : items.filter((item) => generatedItemIds.includes(item.itemId));
    const currentStoreItems = filterGeneratedItems(itemsByStore[currentStoreKey] || []);
    const otherStoreItems = filterGeneratedItems(
      Object.entries(itemsByStore).flatMap(([storeId, storeItems]) => (storeId === currentStoreKey ? [] : storeItems))
    );
    setSortedItems({
      'current-ordered': currentStoreItems
        .filter((item) => item.order)
        .sort(compareByOrder),
      'current-unordered': currentStoreItems.filter((item) => !item.order).sort(sortByName),
      'other-stores': otherStoreItems
        .filter((item) => !currentStoreItems.some((currentStoreItem) => currentStoreItem.item.id === item.item.id))
        .filter((item, index, self) => self.findIndex((i) => i.item.id === item.item.id) === index)
        .sort(sortByName),
    });
  }, [currentStore.id, itemsByStore, generatedItemIds]);

  const itemIdsByContainer = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(sortedItems).map(([containerId, items]) => [containerId, items.map((item) => item.id)])
      ),
    [sortedItems]
  );

  const onReordering = (d) => {
    // console.log('onReordering: ', d);
    const isMovingToNewContainer = d.activeContainerId !== d.overContainerId;
    const validMove =
      d.activeContainerId === 'current-ordered' ||
      (isMovingToNewContainer && d.overContainerId === 'current-ordered') ||
      (isMovingToNewContainer && d.overContainerId === 'other-stores');
    if (!validMove) return;

    // update state, but don't save
    setSortedItems((prevSortedItems) => {
      const newItems = {
        ...prevSortedItems,
      };

      if (isMovingToNewContainer) {
        newItems[d.activeContainerId] = prevSortedItems[d.activeContainerId].filter(
          (item) => item.id !== d.activeItem.id
        );
        newItems[d.overContainerId] = [...prevSortedItems[d.overContainerId], d.activeItem];

        switch (d.overContainerId) {
          case 'current-ordered':
            // eslint-disable-next-line no-case-declarations
            const { activeItem } = d;
            if (activeItem.store?.id !== currentStore.id) {
              activeItem.markForNew();
            }
            activeItem.unmarkForDeletion();
            newItems['current-ordered'] = reorderVisibleItems(newItems['current-ordered'], activeItem, d.overItem);
            break;
          case 'current-unordered':
            d.activeItem.unmarkForDeletion();
            break;
          case 'other-stores':
            // remove the store from the item
            d.activeItem.unmarkForNew();
            d.activeItem.markForDeletion();
            break;

          default:
            break;
        }
        return newItems;
      }

      if (d.overContainerId === 'current-ordered') {
        newItems['current-ordered'] = reorderVisibleItems(newItems['current-ordered'], d.activeItem, d.overItem);
        return newItems;
      }

      return prevSortedItems;
    });
  };

  const onReordered = (d) => {
    // console.log('onReordered: ', d);
    const { activeItem } = d;

    const currentStoreKey = String(currentStore.id);
    const fullOrderedItems = (itemsByStore[currentStoreKey] || []).filter((item) => item.order).sort(compareByOrder);

    if (d.overContainerId === 'current-ordered') {
      insertIntoFullOrder(fullOrderedItems, sortedItems['current-ordered'], activeItem);
    } else if (d.activeContainerId === 'current-ordered') {
      const remainingOrderedItems = fullOrderedItems.filter((item) => item.itemId !== activeItem.itemId);
      assignOrder(remainingOrderedItems);
      if (d.overContainerId === 'current-unordered') {
        activeItem.order = null;
      }
    }

    if (activeItem.isMarkedForNew) {
      // create new item
      api.createStoreItem(new StoreItem({ ...d.activeItem, store: currentStore }));
    }

    // save
    sync();
  };

  return (
    <SortableLists
      dragOverlayComponent={Item}
      allItems={allItems}
      itemsByContainer={itemIdsByContainer}
      onReordering={onReordering}
      onReordered={onReordered}
    >
      <ShopItems
        items={sortedItems['current-ordered']}
        containerId="current-ordered"
        neededItemsOnly={false}
        title="In order"
      />

      <ShopItems
        items={sortedItems['current-unordered']}
        containerId="current-unordered"
        neededItemsOnly={false}
        title="Unordered"
      />

      <ShopItems
        items={sortedItems['other-stores']}
        containerId="other-stores"
        neededItemsOnly={false}
        title="Not at this store"
      />
    </SortableLists>
  );
};

const NoStoreSelected = () => {
  return <div className="container-fluid display-6 text-center mt-4">Please select a store</div>;
};

export const Shop = () => {
  const { currentStore } = useCurrentStore();
  const [generatedItemIds, setGeneratedItemIds] = useState(null);
  const { data: itemsByStore } = useQuery(useApi().api.getItemsByStore());

  if (!itemsByStore) {
    return null;
  }

  const onToggleNeededItems = () => {
    setGeneratedItemIds((prev) =>
      prev === null
        ? [...new Set(Object.values(itemsByStore).flat().filter((item) => item.needed).map((item) => item.itemId))]
        : null
    );
  };

  const neededItemsOnly = generatedItemIds !== null;

  return (
    <div className="shop-page">
      <PageHeader>
        <div className="col-8">
          <StoreSelector />
        </div>
        <div className="col-4">
          <NeededItemsToggle neededItemsOnly={neededItemsOnly} onToggle={onToggleNeededItems} />
        </div>
      </PageHeader>

      {currentStore ? (
        <ShoppingList currentStore={currentStore} itemsByStore={itemsByStore} generatedItemIds={generatedItemIds} />
      ) : (
        <NoStoreSelected />
      )}
    </div>
  );
};
