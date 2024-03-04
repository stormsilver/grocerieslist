import { useQuery } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import { arrayMove } from '@dnd-kit/sortable';
import { AddButton } from './AddButton';
import { StoreSelector } from './StoreSelector';
import { ShopItems } from './shop/ShopItems';
import { sortByName } from '../util';
import { useCurrentStore } from '../contexts/CurrentStoreContext';
import { useApi } from '../contexts/ApiContext';
import { Item } from './Item';
import { SortableLists } from './SortableLists';
import { StoreItem } from '../models/StoreItem';

const updateOrderedItems = (orderedItems, activeItem, overItem) => {
  const activeIndex = orderedItems.findIndex((item) => item.id === activeItem.id);
  const overIndex = orderedItems.findIndex((item) => item.id === overItem.id);
  const newItems = arrayMove(orderedItems, activeIndex, overIndex);
  newItems.forEach((item, index) => {
    item.order = index + 1;
  });
  return newItems;
};

const ShoppingList = ({ currentStore, itemsByStore }) => {
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
            // d.activeItem.store = null;
            // d.activeItem.delete();
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
      // activeItem = ;
      // replace item with new item
      // const index = newItems['current-ordered'].findIndex((item) => item.id === d.activeItem.id);
      // if (index !== -1) newItems['current-ordered'][index] = activeItem;
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
      <div className="shop-list-ordered">
        <ShopItems items={sortedItems['current-ordered']} containerId="current-ordered" />
      </div>
      <div className="shop-list-unordered">
        <div className="container-fluid d-flex justify-content-between">
          <h6 className="display-6">Unordered</h6>
          <AddButton />
        </div>
        <ShopItems items={sortedItems['current-unordered']} containerId="current-unordered" />
      </div>
      <div className="shop-other-stores">
        <div className="container-fluid">
          <h6 className="display-6">Not at this store</h6>
        </div>
        <ShopItems items={sortedItems['other-stores']} containerId="other-stores" />
      </div>
    </SortableLists>
  );
};

const NoStoreSelected = () => {
  return <div className="container-fluid display-6 text-center mt-4">Please select a store</div>;
};

export const Shop = () => {
  const { currentStore } = useCurrentStore();
  const { data: itemsByStore } = useQuery(useApi().api.getItemsByStore());

  if (!itemsByStore) {
    return null;
  }

  return (
    <div className="shop-page">
      <div className="shop-store-selector container-fluid">
        <StoreSelector />
      </div>

      {currentStore ? <ShoppingList currentStore={currentStore} itemsByStore={itemsByStore} /> : <NoStoreSelected />}
    </div>
  );
};
