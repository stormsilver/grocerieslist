import classNames from 'classnames';

export const NeededItemsToggle = ({ neededItemsOnly, onToggle }) => {
  const buttonText = neededItemsOnly ? 'Show all' : 'Generate list';

  const className = classNames('needed-items-toggle', 'btn', {
    'btn-primary': !neededItemsOnly,
    'btn-info': neededItemsOnly,
  });

  return (
    <button className={className} onClick={onToggle}>
      {buttonText}
    </button>
  );
};
