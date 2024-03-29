import { useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
// import { AddItemButton } from './AddItemButton';
import { Search } from './Search';
import { Category } from './list/Category';
import { Item } from './Item';
import { useApi } from '../contexts/ApiContext';
import { SortableLists } from './SortableLists';
import { sortByName } from '../util';
import { UNCATEGORIZED_CATEGORY_ID } from '../api/Api';
import { PageHeader } from './PageHeader';
import { AddCategoryButton } from './AddCategoryButton';

const AllItemsList = ({ itemsByCategory, categories, collapsedCategories, setCollapsedCategories }) => {
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

  const onReordered = (d) => {
    // console.log('onReordered: ', d);
    setCollapsedCategories((prev) => {
      const newCollapsedCategories = { ...prev };
      delete newCollapsedCategories[d.overContainerId];
      return newCollapsedCategories;
    });

    sync();
  };

  const onToggleCollapse = (categoryId) => {
    setCollapsedCategories({ ...collapsedCategories, [categoryId]: !collapsedCategories[categoryId] });
  };

  const categorySections = sortedCategoryIds.map((categoryId, i) => {
    const category = categories.find((c) => c.id === categoryId);
    const items = sortedItems[categoryId] || [];
    return (
      <Category
        key={i}
        category={category}
        items={items}
        collapsed={collapsedCategories[category.id]}
        onToggleCollapse={onToggleCollapse}
      />
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
  const [collapsedCategories, setCollapsedCategories] = useState({});

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

  useEffect(() => {
    if (!categories) return;

    setCollapsedCategories((prev) => {
      const allCollapsed = Object.fromEntries((categories || []).map((c) => [c.id, true]));
      return { ...allCollapsed, ...prev };
    });
  }, [categories]);

  if (!itemsByCategory || !categories) return null;

  const onSearch = (newSearchTerm) => {
    // console.log('searching for: ', newSearchTerm);
    setSearchTerm(newSearchTerm);
  };

  const expandAllCategories = () => {
    setCollapsedCategories({});
  };

  return (
    <div className="list-page">
      <PageHeader>
        <div className="col-11">
          <Search onSearch={onSearch} searchTerm={searchTerm} />
        </div>
        <div className="col-1">
          {/* <button type="button" className="btn" onClick={expandAllCategories}>
            <i className="bi bi-chevron-bar-down"></i>
          </button> */}
          <AddCategoryButton />
        </div>
      </PageHeader>

      <AllItemsList
        categories={categories}
        itemsByCategory={filteredItemsByCategory}
        collapsedCategories={collapsedCategories}
        setCollapsedCategories={setCollapsedCategories}
      />
    </div>
  );
};
