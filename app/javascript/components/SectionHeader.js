import classNames from 'classnames';

export const SectionHeader = ({ title, collapsed, onToggleCollapse, children }) => {
  const renderCollapse = () => {
    if (!onToggleCollapse) return null;

    const className = classNames('bi', {
      'bi-chevron-down': !collapsed,
      'bi-chevron-right': collapsed,
    });

    return (
      <button type="button" className="btn collapse-button" onClick={onToggleCollapse}>
        <i className={className}></i>
      </button>
    );
  };

  return (
    <div className="section-header d-flex justify-content-between container-fluid">
      <div className="justify-content-start">
        {renderCollapse()}
        <h6 className="display-6">{title}</h6>
      </div>
      {children}
    </div>
  );
};
