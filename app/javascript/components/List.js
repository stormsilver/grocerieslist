import { useEffect, useMemo, useState } from 'react';
import { AddButton } from './AddButton';
import { Search } from './Search';
import { Category } from './list/Category';
import { CategoryItem } from './list/CategoryItem';
import { useApi } from '../contexts/ApiContext';
import { useQuery } from '../hooks/useQuery';
import { SortableLists } from './SortableLists';
import { SortableList } from './SortableList';
import { SortableCategoryItem } from './list/SortableCategoryItem';
import { sortByName } from '../util';

const AllItemsList = ({ itemsByCategory, categories }) => {
  const [sortedItems, setSortedItems] = useState({});

  // sort categories by name
  const sortedCategoryIds = useMemo(() => categories.sort(sortByName).map((category) => category.id), [categories]);

  useEffect(() => {
    // then sort the items in each category by name
    const newSortedItems = {};
    sortedCategoryIds.forEach((categoryId) => {
      newSortedItems[categoryId] = (itemsByCategory[categoryId] || []).sort(sortByName);
    });
    setSortedItems(newSortedItems);
  }, [sortedCategoryIds, itemsByCategory]);

  const allItems = useMemo(() => Object.values(itemsByCategory).flat(), [itemsByCategory]);
  const categorySections = sortedCategoryIds.map((categoryId, i) => {
    const category = categories.find((c) => c.id === categoryId);
    const items = sortedItems[categoryId] || [];
    return (
      <Category key={i} category={category}>
        <SortableList containerId={category.id} items={items} sortableItemComponent={SortableCategoryItem} />
      </Category>
    );
  });

  const onReordering = (d) => {
    // console.log('onReordering: ', d);
    if (d.activeContainerId === d.overContainerId) return;

    const { activeItem, activeContainerId, overContainerId } = d;
    // move item from activeContainerId to overContainerId
    const activeItems = sortedItems[activeContainerId];
    const overItems = sortedItems[overContainerId];
    const newActiveItems = activeItems.filter((item) => item.id !== activeItem.id);
    const newOverItems = [...overItems, activeItem].sort(sortByName);
    setSortedItems({ ...sortedItems, [activeContainerId]: newActiveItems, [overContainerId]: newOverItems });
  };

  const onReordered = (d) => {
    console.log('onReordered: ', d);
  };

  return (
    <SortableLists
      dragOverlayComponent={CategoryItem}
      allItems={allItems}
      onReordering={onReordering}
      onReordered={onReordered}
    >
      {categorySections}
    </SortableLists>
  );
};

export const List = () => {
  const api = useApi();
  const { data: categories } = useQuery(api.getCategories());
  const { data: itemsByCategory } = useQuery(api.getItemsByCategory());
  if (!itemsByCategory || !categories) return null;

  return (
    <div className="list-page">
      <div className="list-searchbar d-flex container-fluid">
        <Search />
        <AddButton />
      </div>

      <AllItemsList categories={categories} itemsByCategory={itemsByCategory} />
    </div>
  );
};
