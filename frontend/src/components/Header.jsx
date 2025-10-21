import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../features/authSlice';
import logo from '../img/argentBankLogo.png';

export default function Header() {
  const { user, token } = useSelector((s) => s.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <nav className="main-nav">
      <Link className="main-nav-logo" to="/">
        <img className="main-nav-logo-image" src={logo} alt="Argent Bank Logo" />
        <h1 className="sr-only">Argent Bank</h1>
      </Link>
      <div>
        {token ? (
          <>
            <span className="main-nav-item">
              <i className="fa fa-user-circle" /> {user?.firstName || 'User'}
            </span>
            <button
              className="main-nav-item"
              onClick={onLogout}
              style={{ background: 'none', border: 'none', cursor: 'pointer' }}
            >
              <i className="fa fa-sign-out" /> Sign Out
            </button>
          </>
        ) : (
          <Link className="main-nav-item" to="/sign-in">
            <i className="fa fa-user-circle" /> Sign In
          </Link>
        )}
      </div>
    </nav>
  );
}
