import { NavLink } from 'react-router-dom';
import { useApi } from '../contexts/ApiContext';

const SyncState = () => {
  const { syncState } = useApi();

  let icon = null;
  if (syncState.isSyncing) {
    icon = 'bi-circle-fill text-warning';
  } else if (syncState.isError) {
    icon = 'bi-circle-fill text-danger';
  } else if (syncState.isSuccess) {
    icon = 'bi-circle-fill text-success';
  } else {
    icon = 'bi-circle-fill text-success';
  }

  return (
    <div className="sync-state d-flex justify-content-center">
      <i className={`bi ${icon}`} />
    </div>
  );
};

export const Layout = ({ children }) => {
  return (
    <div>
      <SyncState />
      <nav className="navbar navbar-expand bg-body-tertiary">
        <div className="container-fluid">
          <ul className="navbar-nav text-center d-flex justify-content-center">
            <li className="nav-item">
              <NavLink to="/list" className="nav-link">
                List
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/shop" className="nav-link">
                Shop
              </NavLink>
            </li>
            {/* <li className="nav-item">
              <NavLink to="/setup" className="nav-link">
                Setup
              </NavLink>
            </li> */}
          </ul>
        </div>
      </nav>

      <main>{children}</main>
    </div>
  );
};
