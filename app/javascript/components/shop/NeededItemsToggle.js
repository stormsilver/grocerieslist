export const NeededItemsToggle = ({ neededItemsOnly, onToggle }) => {
  const buttonText = neededItemsOnly ? 'Show all items' : 'Generate list';
  const variant = neededItemsOnly ? 'secondary' : 'primary';

  return (
    <button className={`btn btn-${variant}`} onClick={onToggle}>
      {buttonText}
    </button>
  );
};