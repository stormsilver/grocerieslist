import { useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
// import { AddItemButton } from './AddItemButton';
import { Search } from './Search';
import { Category } from './list/Category';
import { Item } from './Item';
import { useApi } from '../contexts/ApiContext';
import { SortableLists } from './SortableLists';
import { SortableList } from './SortableList';
import { SortableItem } from './SortableItem';
import { sortByName } from '../util';
import { UNCATEGORIZED_CATEGORY_ID } from '../api/Api';
import { PageHeader } from './PageHeader';

const AllItemsList = ({ itemsByCategory, categories }) => {
  const { sync } = useApi();
  const [sortedItems, setSortedItems] = useState({});

  // sort categories by name
  const sortedCategoryIds = useMemo(() => categories.sort(sortByName).map((category) => category.id), [categories]);
  const allItems = useMemo(() => Object.values(itemsByCategory).flat(), [itemsByCategory]);

  useEffect(() => {
    // console.log('recomputing List sortedItems');
    // then sort the items in each category by name
    const newSortedItems = {};
    sortedCategoryIds.forEach((categoryId) => {
      newSortedItems[categoryId] = (itemsByCategory[categoryId] || []).sort(sortByName);
    });
    setSortedItems(newSortedItems);
  }, [sortedCategoryIds, itemsByCategory]);

  const onReordering = (d) => {
    // console.log('onReordering: ', d);
    if (d.activeContainerId === d.overContainerId) return;

    const { activeItem, activeContainerId, overContainerId } = d;
    // move item from activeContainerId to overContainerId
    const activeItems = sortedItems[activeContainerId] || [];
    const overItems = sortedItems[overContainerId] || [];
    const newActiveItems = activeItems.filter((item) => item.id !== activeItem.id);
    const newOverItems = [...overItems, activeItem].sort(sortByName);
    // set the new category
    activeItem.categoryId = overContainerId === UNCATEGORIZED_CATEGORY_ID ? null : overContainerId;
    setSortedItems({ ...sortedItems, [activeContainerId]: newActiveItems, [overContainerId]: newOverItems });
  };

  const onReordered = () => {
    // console.log('onReordered: ', d);
    sync();
  };

  const categorySections = sortedCategoryIds.map((categoryId, i) => {
    const category = categories.find((c) => c.id === categoryId);
    const items = sortedItems[categoryId] || [];
    return (
      <Category key={i} category={category}>
        <SortableList containerId={category.id} items={items} sortableItemComponent={SortableItem} />
      </Category>
    );
  });

  return (
    <SortableLists
      dragOverlayComponent={Item}
      allItems={allItems}
      onReordering={onReordering}
      onReordered={onReordered}
    >
      {categorySections}
    </SortableLists>
  );
};

export const List = () => {
  const [filteredItemsByCategory, setFilteredItemsByCategory] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const { api } = useApi();
  const { data: categories } = useQuery(api.getCategories());
  const { data: itemsByCategory } = useQuery(api.getItemsByCategory());

  useEffect(() => {
    if (!itemsByCategory) return;

    if (searchTerm.length === 0) {
      setFilteredItemsByCategory(itemsByCategory);
      return;
    }

    // do the search by filtering itemsByCategory
    const filteredEntries = Object.entries(itemsByCategory).map(([categoryId, items]) => {
      return [categoryId, items.filter((item) => item.name.toLowerCase().includes(searchTerm.toLowerCase()))];
    });

    setFilteredItemsByCategory(Object.fromEntries(filteredEntries));
  }, [itemsByCategory, searchTerm]);

  if (!itemsByCategory || !categories) return null;

  const onSearch = (newSearchTerm) => {
    // console.log('searching for: ', newSearchTerm);
    setSearchTerm(newSearchTerm);
  };

  return (
    <div className="list-page">
      <PageHeader>
        {/* <div className="col-10"> */}
        <Search onSearch={onSearch} searchTerm={searchTerm} />
        {/* </div>
        <div className="col-2">
          <AddItemButton />
        </div> */}
      </PageHeader>

      <AllItemsList categories={categories} itemsByCategory={filteredItemsByCategory} />
    </div>
  );
};
