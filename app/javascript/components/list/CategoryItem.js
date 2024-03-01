import React from 'react';
import { CheckCircle } from '../CheckCircle';
import { DragHandle } from '../DragHandle';

export const CategoryItem = React.forwardRef(({ item, ...props }, ref) => {
  const onCheckUncheck = (event) => {
    console.log('event.target.checked: ', event.target.checked);
  };

  return (
    <div className="list-item d-flex justify-content-between" ref={ref} {...props}>
      <div className="justify-content-start">
        <CheckCircle id={`item-${item.id}`} checked={item.needed} onChange={onCheckUncheck} />
        {item.name} (id: {item.id}, category: {item.categoryId})
      </div>
      <DragHandle />
    </div>
  );
});
