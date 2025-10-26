import { useLocation } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';

const BASE_URL =
  import.meta.env.VITE_API_URL?.replace(/\/+$/, '') || 'http://localhost:3001/api/v1';

const CATEGORIES = ['Food', 'Transport', 'Shopping', 'Revenus', 'Logement', 'Autre'];

const BALANCES_BY_ACCOUNT = {
  '8349': 2082.79,
  '6712': 10928.42,
};

const formatUSD = (n) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);

export default function Transaction() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const accountId = params.get('accountId');

  const token = useSelector((state) => state.auth.token);

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editingId, setEditingId] = useState(null);
  const [noteDraft, setNoteDraft] = useState('');
  const [categoryDraft, setCategoryDraft] = useState('');

  const headersAuth = useMemo(
    () => ({ Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }),
    [token]
  );

  const navBalance = location.state?.balance;
  const accountBalance = useMemo(() => {
    if (typeof navBalance === 'number') return navBalance;
    if (!accountId) return null;
    return BALANCES_BY_ACCOUNT[accountId] ?? null;
  }, [navBalance, accountId]);

  useEffect(() => {
    if (!accountId || !token) return;

    const fetchTransactions = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${BASE_URL}/user/${accountId}/transactions`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          const raw = await res.text();
          console.error('Erreur backend:', res.status, raw);
          throw new Error('Erreur de récupération');
        }
        const data = await res.json();
        setTransactions(data.body || []);
      } catch (e) {
        console.error('fetchTransactions error:', e);
        setTransactions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [accountId, token]);

  const startEdit = (txn) => {
    setEditingId(txn.id);
    setNoteDraft(txn.note || '');
    setCategoryDraft(txn.category || '');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setNoteDraft('');
    setCategoryDraft('');
  };

  const saveNote = async (txnId) => {
    const current = transactions.find((t) => t.id === txnId)?.note || '';
    const method = current ? 'PUT' : 'POST';
    const res = await fetch(`${BASE_URL}/user/transactions/${txnId}/note`, {
      method,
      headers: headersAuth,
      body: JSON.stringify({ note: noteDraft }),
    });
    if (!res.ok) throw new Error('Erreur sauvegarde note');
    const { body: updated } = await res.json();
    setTransactions((prev) => prev.map((t) => (t.id === txnId ? updated : t)));
  };

  const saveCategory = async (txnId) => {
    const current = transactions.find((t) => t.id === txnId)?.category || '';
    const method = current ? 'PUT' : 'POST';
    const res = await fetch(`${BASE_URL}/user/transactions/${txnId}/category`, {
      method,
      headers: headersAuth,
      body: JSON.stringify({ category: categoryDraft }),
    });
    if (!res.ok) throw new Error('Erreur sauvegarde catégorie');
    const { body: updated } = await res.json();
    setTransactions((prev) => prev.map((t) => (t.id === txnId ? updated : t)));
  };

  const saveAll = async (txnId) => {
    try {
      await saveNote(txnId);
      await saveCategory(txnId);
      cancelEdit();
    } catch (e) {
      console.error(e);
      alert("Impossible d'enregistrer les modifications.");
    }
  };

  if (loading) {
    return (
      <main className="main bg-dark">
        <p>Chargement des transactions...</p>
      </main>
    );
  }

  return (
    <main className="main bg-dark transac">
      <h1 className="sr-only">Transactions du compte</h1>

      <section>
        <div className="account">
          <h3>Argent Bank Checking (x{accountId})</h3>
          <p>{accountBalance != null ? formatUSD(accountBalance) : 'Solde disponible'}</p>
        </div>
        <h2 className="h2-transac">Détails du compte</h2>
      </section>

      <section>
        <table className="transactions-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>Date</th>
              <th>Description</th>
              <th>Type</th>
              <th>Catégorie</th>
              <th>Note</th>
              <th style={{ textAlign: 'right' }}>Montant</th>
              <th style={{ width: 120 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length === 0 ? (
              <tr>
                <td colSpan="7">Aucune transaction trouvée.</td>
              </tr>
            ) : (
              transactions.map((txn) => {
                const isEditing = editingId === txn.id;
                return (
                  <tr key={txn.id}>
                    <td>{new Date(txn.date).toLocaleDateString()}</td>
                    <td>{txn.description}</td>
                    <td>{txn.type}</td>
                    <td>
                      {isEditing ? (
                        <select
                          value={categoryDraft}
                          onChange={(e) => setCategoryDraft(e.target.value)}
                        >
                          <option value="">—</option>
                          {CATEGORIES.map((c) => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <>
                          {txn.category || '—'}{' '}
                          <button
                            onClick={() => startEdit(txn)}
                            title="Modifier"
                            aria-label="Modifier la transaction"
                            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                          >
                            ✎
                          </button>
                        </>
                      )}
                    </td>
                    <td>
                      {isEditing ? (
                        <input
                          type="text"
                          value={noteDraft}
                          onChange={(e) => setNoteDraft(e.target.value)}
                          placeholder="Ajouter une note"
                          style={{ width: '100%' }}
                        />
                      ) : (
                        <>
                          {txn.note || '—'}{' '}
                          <button
                            onClick={() => startEdit(txn)}
                            title="Modifier"
                            aria-label="Modifier la transaction"
                            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                          >
                            ✎
                          </button>
                        </>
                      )}
                    </td>
                    <td style={{ textAlign: 'right' }}>{txn.amount.toFixed(2)} €</td>
                    <td>
                      {isEditing ? (
                        <>
                          <button onClick={() => saveAll(txn.id)}>Enregistrer</button>{' '}
                          <button onClick={cancelEdit}>Annuler</button>
                        </>
                      ) : (
                        <button onClick={() => startEdit(txn)}>Modifier</button>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </section>
    </main>
  );
}
