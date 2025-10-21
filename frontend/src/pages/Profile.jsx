// src/pages/Profile.jsx
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProfile } from "../features/authSlice";
import Account from "../components/Account";

export default function Profile() {
  const dispatch = useDispatch();
  const { user, loading, error, token } = useSelector((s) => s.auth);

  useEffect(() => {
    if (token && !user) {
      dispatch(fetchProfile());
    }
  }, [dispatch, token, user]);

  const displayName = (user && [user.firstName, user.lastName].filter(Boolean).join(" ")) ||"Tony Stark";

  return (
    <main className="main bg-dark">
      <div className="header">
        <h1> Welcome back <br />{displayName}! </h1>

        <button className="edit-button" disabled={loading}> Edit Name</button>

        {/*retours d'état utiles (facultatifs) */}
        {loading && <p style={{ color: "#fff" }}>Loading profile…</p>}
        {error && (
          <p style={{ color: "salmon" }}>
            Error: {typeof error === "string" ? error : JSON.stringify(error)}
          </p>
        )}
      </div>

      <h2 className="sr-only">Accounts</h2>

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
    </main>
  );
}
