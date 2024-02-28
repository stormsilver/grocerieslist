import React from 'react';
import { CheckCircle } from '../CheckCircle';
import { DragHandle } from '../DragHandle';

export const ShopItem = React.forwardRef(({ item, ...props }, ref) => {
  const onCheckUncheck = (event) => {
    console.log('event.target.checked: ', event.target.checked);
  };

  return (
    <div className="shop-item d-flex justify-content-between" ref={ref} {...props}>
      <div className="justify-content-start">
        <CheckCircle id={`shop-item-${item.id}`} checked={item.needed} onChange={onCheckUncheck} />
        <span className="shop-item-name">{item.name}</span> (id: {item.id}, order: {item.order}, store: {item.store?.id}
        )
      </div>
      <DragHandle />
    </div>
  );
});
