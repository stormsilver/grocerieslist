import { SortableList } from '../SortableList';
import { SortableShopItem } from './SortableShopItem';

export const ShopItems = ({ containerId, items }) => {
  return (
    <div className="shop-items container-fluid">
      <SortableList containerId={containerId} items={items} sortableItemComponent={SortableShopItem} />
    </div>
  );
};
