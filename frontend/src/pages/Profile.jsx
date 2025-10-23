import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateUserName } from '../features/authSlice';
import Account from '../components/Account';

export default function Profile() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [isEditing, setIsEditing] = useState(false);
  const [pseudo, setPseudo] = useState(user?.userName || '');

  const displayName =
    [user?.firstName, user?.lastName].filter(Boolean).join(' ') || 'Tony Stark';

  const onCancel = () => {
    setPseudo(user?.userName || '');
    setIsEditing(false);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const trimmed = pseudo.trim();
    if (!trimmed || trimmed === user?.userName) return;
    dispatch(updateUserName(trimmed));
    setIsEditing(false);
  };

  return (
    <main className="main bg-dark">
      <header className="header">
        {!isEditing ? (
          <>
            <h1>
              Welcome back
              <br />
              {displayName}!
            </h1>
            <button
              className="edit-button"
              type="button"
              onClick={() => setIsEditing(true)}
            >
              Edit Name
            </button>
          </>
        ) : (
          <section className="profile-card" aria-label="Edit username">
            <h2 className="sr-only">Edit username</h2>

            <form onSubmit={onSubmit}>
              <div className="profile-grid">
                <div className="input-wrapper">
                  <label htmlFor="username">Username</label>
                  <input
                    id="username"
                    type="text"
                    value={pseudo}
                    onChange={(e) => setPseudo(e.target.value)}
                    placeholder="Enter your username"
                  />
                </div>
              </div>

              <div className="profile-actions">
                <button
                  className="edit-button"
                  type="submit"
                  disabled={!pseudo.trim() || pseudo.trim() === (user?.userName || '')}
                >
                  Save
                </button>
                <button
                  className="cancel-button"
                  type="button"
                  onClick={onCancel}
                >
                  Cancel
                </button>
              </div>
            </form>
          </section>
        )}
      </header>

      <h2 className="sr-only">Accounts</h2>
      <section className="container">
        <Account
          title="Argent Bank Checking (x8349)"
          amount="$2,082.79"
          description="Available Balance"
        />
        <Account
          title="Argent Bank Savings (x6712)"
          amount="$10,928.42"
          description="Available Balance"
        />
        <Account
          title="Argent Bank Credit Card (x8349)"
          amount="$184.30"
          description="Current Balance"
        />
      </section>
    </main>
  );
}
