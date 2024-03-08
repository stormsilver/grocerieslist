import { AddItemButton } from '../AddItemButton';
import { SectionHeader } from '../SectionHeader';

export const Category = ({ category, children }) => {
  return (
    <div>
      <SectionHeader title={category.name}>
        <AddItemButton category={category} />
      </SectionHeader>

      <div className="container-fluid">{children}</div>
    </div>
  );
};
