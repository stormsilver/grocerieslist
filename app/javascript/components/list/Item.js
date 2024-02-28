import { CheckCircle } from '../CheckCircle';

export const Item = ({ item }) => {
  return (
    <div className="list-item justify-content-start">
      <CheckCircle id={`item-${item.id}`} checked={item.needed} />
      {item.name}
    </div>
  );
};
