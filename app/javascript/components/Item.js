import React from 'react';
import classNames from 'classnames';
import { CheckCircle } from './CheckCircle';
import { useApi } from '../contexts/ApiContext';

export const Item = React.forwardRef(({ dragging = false, item, children, ...props }, ref) => {
  const { sync } = useApi();
  const [checked, setChecked] = React.useState(!item.needed);
  const [name, setName] = React.useState(item.name);

  const onCheckUncheck = (event) => {
    item.needed = !event.target.checked;
    setChecked(!item.needed);
    sync();
  };

  const onItemNameChange = (event) => {
    item.name = event.target.value;
    setName(item.name);
    sync();
  };

  const className = classNames('item d-flex justify-content-between', { dragging });

  return (
    <div ref={ref} {...props}>
      <div className={className}>
        <div className="justify-content-start">
          <CheckCircle id={`item-${item.id}`} checked={checked} onChange={onCheckUncheck} />
          <input className="item-name" type="text" value={name} onChange={onItemNameChange} />
          {/* (id: {item.id}, itemId: {item.itemId} order: {item.order}, store: {item.store?.id}, category: {item.categoryId}) */}
        </div>
        {children}
      </div>
    </div>
  );
});
