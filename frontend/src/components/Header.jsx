import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { signOut } from '../features/authSlice';
import logo from '../img/argentBankLogo.png';

export default function Header() {
  const { user, token } = useSelector((s) => s.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onLogout = () => {
    dispatch(signOut());
    navigate('/');
  };

  const linkClass = ({ isActive }) =>
    `main-nav-item ${isActive ? 'router-link-exact-active' : ''}`;

  const displayName =
    (user?.userName && user.userName.trim()) ||
    (user?.firstName && user.firstName.trim()) ||
    'User';

  return (
    <nav className="main-nav">
      <Link className="main-nav-logo" to="/" aria-label="Go to home">
        <img className="main-nav-logo-image" src={logo} alt="Argent Bank Logo" />
        <h1 className="sr-only">Argent Bank</h1>
      </Link>

      <div className="right">
        {token ? (
          <>
            <NavLink className={linkClass} to="/profile" aria-label="Profile">
              <i className="fa fa-user-circle" /> {displayName}
            </NavLink>

            <button
              type="button"
              className="main-nav-item button"
              onClick={onLogout}
              aria-label="Sign out"
            >
              <i className="fa fa-sign-out" /> Sign Out
            </button>
          </>
        ) : (
          <NavLink className={linkClass} to="/sign-in" aria-label="Sign in">
            <i className="fa fa-user-circle" /> Sign In
          </NavLink>
        )}
      </div>
    </nav>
  );
}
