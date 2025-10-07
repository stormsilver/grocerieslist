import { forwardRef } from 'react';
import classNames from 'classnames';

export const SectionHeader = forwardRef(
  ({ title, collapsed, onToggleCollapse, children, dragOver = false }, ref) => {
    const handleHeaderClick = (event) => {
      if (!onToggleCollapse) return;
      if (event.target.closest('button, a, input, select, textarea')) return;
      onToggleCollapse();
    };

    const handleHeaderKeyDown = (event) => {
      if (!onToggleCollapse) return;
      if (event.target !== event.currentTarget) return;
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        onToggleCollapse();
      }
    };

    const renderCollapse = () => {
      if (!onToggleCollapse) return null;

      const iconClassName = classNames('bi', {
        'bi-chevron-down': !collapsed,
        'bi-chevron-right': collapsed,
      });

      const handleButtonClick = (event) => {
        event.stopPropagation();
        onToggleCollapse();
      };

      return (
        <button type="button" className="btn collapse-button" onClick={handleButtonClick}>
          <i className={iconClassName}></i>
        </button>
      );
    };

    const containerClassName = classNames('section-header d-flex justify-content-between container-fluid', {
      'section-header--clickable': !!onToggleCollapse,
      'section-header--drag-over': dragOver,
    });

    const containerProps = onToggleCollapse
      ? {
          role: 'button',
          tabIndex: 0,
          onClick: handleHeaderClick,
          onKeyDown: handleHeaderKeyDown,
        }
      : {};

    return (
      <div className={containerClassName} ref={ref} {...containerProps}>
        <div className="justify-content-start">
          {renderCollapse()}
          <h6 className="display-6">{title}</h6>
        </div>
        {children}
      </div>
    );
  }
);

SectionHeader.displayName = 'SectionHeader';
