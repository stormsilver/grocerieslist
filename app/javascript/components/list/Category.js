import { AddItemButton } from '../AddItemButton';

export const Category = ({ category, children }) => {
  return (
    <div>
      <div className="list-category d-flex justify-content-between container-fluid">
        <h6 className="display-6">{category.name}</h6>
        <AddItemButton category={category} />
      </div>

      <div className="container-fluid">{children}</div>
    </div>
  );
};
