import { Link, useLocation } from 'react-router-dom';
import logo from '../img/argentBankLogo.png';

function Header() {
  const location = useLocation();
  const isProfilePage = location.pathname === '/profile';

  return (
    <nav className="main-nav">
      <Link className="main-nav-logo" to="/">
        <img
          className="main-nav-logo-image"
          src={logo}
          alt="Argent Bank Logo"
        />
        <h1 className="sr-only">Argent Bank</h1>
      </Link>
      <div>
        {isProfilePage ? (
          <Link className="main-nav-item" to="/">
            <i className="fa fa-sign-out"></i> Sign Out
          </Link>
        ) : (
          <Link className="main-nav-item" to="/sign-in">
            <i className="fa fa-user-circle"></i> Sign In
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Header;
