import { NavLink } from 'react-router-dom';

export const Layout = ({ children }) => {
  return (
    <div>
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
