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

const updateOrderedItems = (orderedItems, activeItem, overItem) => {
  const activeIndex = orderedItems.findIndex((item) => item.id === activeItem.id);
  const overIndex = overItem ? orderedItems.findIndex((item) => item.id === overItem.id) : 0;
  const newItems = arrayMove(orderedItems, activeIndex, overIndex);
  newItems.forEach((item, index) => {
    item.order = index + 1;
  });
  return newItems;
};

const ShoppingList = ({ currentStore, itemsByStore, neededItemsOnly }) => {
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
    console.log('recomputing Shop sortedItems');
    const currentStoreItems = itemsByStore[currentStore.id];
    const otherStoreItems = Object.entries(itemsByStore).flatMap(([storeId, storeItems]) =>
      storeId === currentStore.id ? [] : storeItems
    );
    setSortedItems({
      'current-ordered': currentStoreItems
        .filter((item) => item.order)
        .sort((a, b) => {
          const diff = a.order - b.order;
          if (diff === 0) {
            return sortByName(a, b);
          }
          return diff;
        }),
      'current-unordered': currentStoreItems.filter((item) => !item.order).sort(sortByName),
      'other-stores': otherStoreItems
        .filter((item) => !currentStoreItems.some((currentStoreItem) => currentStoreItem.item.id === item.item.id))
        .filter((item, index, self) => self.findIndex((i) => i.item.id === item.item.id) === index)
        .sort(sortByName),
    });
  }, [currentStore.id, itemsByStore]);

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
            newItems['current-ordered'] = updateOrderedItems(newItems['current-ordered'], activeItem, d.overItem);
            break;
          case 'current-unordered':
            // remove the order from the item
            d.activeItem.order = null;
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
        newItems['current-ordered'] = updateOrderedItems(newItems['current-ordered'], d.activeItem, d.overItem);
        return newItems;
      }

      return prevSortedItems;
    });
  };

  const onReordered = (d) => {
    console.log('onReordered: ', d);
    const { activeItem } = d;

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
      onReordering={onReordering}
      onReordered={onReordered}
    >
      <ShopItems
        items={sortedItems['current-ordered']}
        containerId="current-ordered"
        neededItemsOnly={neededItemsOnly}
        title="In order"
      />

      <ShopItems
        items={sortedItems['current-unordered']}
        containerId="current-unordered"
        neededItemsOnly={neededItemsOnly}
        title="Unordered"
      />

      <ShopItems
        items={sortedItems['other-stores']}
        containerId="other-stores"
        neededItemsOnly={neededItemsOnly}
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
  const [neededItemsOnly, setNeededItemsOnly] = useState(false);
  const { data: itemsByStore } = useQuery(useApi().api.getItemsByStore());

  if (!itemsByStore) {
    return null;
  }

  const onToggleNeededItems = () => {
    setNeededItemsOnly((prevNeededItemsOnly) => {
      const newNeededItemsOnly = !prevNeededItemsOnly;

      Object.entries(itemsByStore).forEach(([_storeId, storeItems]) => {
        storeItems.forEach((item) => {
          item.hidden = newNeededItemsOnly && !item.needed;
        });
      });

      return newNeededItemsOnly;
    });
  };

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
        <ShoppingList currentStore={currentStore} itemsByStore={itemsByStore} neededItemsOnly={neededItemsOnly} />
      ) : (
        <NoStoreSelected />
      )}
    </div>
  );
};
