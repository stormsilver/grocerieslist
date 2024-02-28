import { AddButton } from './AddButton';
import { Search } from './Search';
import { Category } from './list/Category';
import { Item } from './list/Item';
import { useApi } from '../contexts/ApiContext';
import { useQuery } from '../hooks/useQuery';

export const List = () => {
  const { data: itemsByCategory } = useQuery(useApi().getItemsByCategory());
  const categories = itemsByCategory.map((category, i) => {
    const items = category.items.map((item, j) => {
      return <Item key={j} item={item} />;
    });

    return (
      <Category key={i} category={category}>
        {items}
      </Category>
    );
  });

  return (
    <div className="list-page">
      <div className="list-searchbar d-flex container-fluid">
        <Search />
        <AddButton />
      </div>

      {categories}
    </div>
  );
};
