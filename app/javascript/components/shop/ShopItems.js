import { SortableList } from '../SortableList';
import { SortableItem } from '../SortableItem';

export const ShopItems = ({ containerId, items }) => {
  return (
    <div className="shop-items container-fluid">
      <SortableList containerId={containerId} items={items} sortableItemComponent={SortableItem} />
    </div>
  );
};
