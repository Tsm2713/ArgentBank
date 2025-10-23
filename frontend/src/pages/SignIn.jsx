import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, fetchProfile, clearError } from '../features/authSlice';
import { useNavigate } from 'react-router-dom';

export default function SignIn() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((s) => s.auth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleEmail = (e) => {
    if (error) dispatch(clearError());
    setEmail(e.target.value);
  };
  const handlePassword = (e) => {
    if (error) dispatch(clearError());
    setPassword(e.target.value);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(loginUser({ email, password })).unwrap();
      await dispatch(fetchProfile()).unwrap();
      navigate('/profile');
    } catch {
    }
  };

  const canSubmit = email.trim() !== '' && password.trim() !== '' && !loading;

  return (
    <main className="main bg-dark profil-size">
      <section className="sign-in-content">
        <i className="fa fa-user-circle sign-in-icon" aria-hidden="true"></i>
        <h1>Sign In</h1>

        <form onSubmit={onSubmit} noValidate>
          <div className="input-wrapper">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              name="username"
              type="email"
              inputMode="email"
              autoComplete="username"
              required
              value={email}
              onChange={handleEmail}
            />
          </div>

          <div className="input-wrapper">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={handlePassword}
            />
          </div>

          <div className="input-remember">
            <input type="checkbox" id="remember-me" />
            <label htmlFor="remember-me">Remember me</label>
          </div>

          {error && (
            <p
              style={{ color: 'crimson', marginTop: 8 }}
              role="alert"
              aria-live="polite"
            >
              {typeof error === 'string' ? error : JSON.stringify(error)}
            </p>
          )}

          <button className="sign-in-button" type="submit" disabled={!canSubmit}>
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
      </section>
    </main>
  );
}
