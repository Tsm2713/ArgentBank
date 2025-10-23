import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { request } from '../api/client';

export default function Transactions() {
  const { accountId } = useParams(); 
  const token = useSelector((state) => state.auth.token);
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editType, setEditType] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editNote, setEditNote] = useState('');

  const typeOptions = ['DÉBIT', 'CRÉDIT'];
  const categoryOptions = ['Alimentation', 'Loisirs', 'Factures', 'Salaire', 'Autre'];

  useEffect(() => {
  
    async function fetchTransactions() {
      try {
        const data = await request(`accounts/${accountId}/transactions`, { token });
        setTransactions(data.transactions || []);
      } catch (error) {
        console.error('Erreur chargement transactions:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchTransactions();
  }, [accountId, token]);

  const handleEdit = (tx) => {
    setEditingId(tx.id);
    setEditType(tx.type || '');
    setEditCategory(tx.category || '');
    setEditNote(tx.note || '');
  };

  const handleSave = async (txId) => {
    try {
      await request(`transactions/${txId}`, {
        method: 'PUT',
        token,
        body: { type: editType, category: editCategory, note: editNote },
      });
      setTransactions((prev) =>
        prev.map((tx) =>
          tx.id === txId
            ? { ...tx, type: editType, category: editCategory, note: editNote }
            : tx
        )
      );
      setEditingId(null);
    } catch (error) {
      console.error('Erreur sauvegarde:', error);
    }
  };

  if (isLoading) {
    return (
      <main className="main bg-dark">
        <p>Chargement des transactions...</p>
      </main>
    );
  }

  return (
    <main className="main bg-dark">
      <h1 className="sr-only">Transactions du compte</h1>
      <section>
        <h2>Détails du compte</h2>
        <div className="account">
          <h3>Argent Bank Checking (x{accountId})</h3>
          <p>Solde disponible</p>
        </div>
      </section>
      <section>
        <h2>Transactions</h2>
        <table className="transactions-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Description</th>
              <th>Type</th>
              <th>Catégorie</th>
              <th>Note</th>
              <th>Montant</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr key={tx.id}>
                <td>{tx.date}</td>
                <td>{tx.description}</td>
                <td>
                  {editingId === tx.id ? (
                    <select value={editType} onChange={(e) => setEditType(e.target.value)}>
                      {typeOptions.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  ) : (
                    tx.type
                  )}
                </td>
                <td>
                  {editingId === tx.id ? (
                    <select value={editCategory} onChange={(e) => setEditCategory(e.target.value)}>
                      {categoryOptions.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  ) : (
                    tx.category
                  )}
                </td>
                <td>
                  {editingId === tx.id ? (
                    <input
                      type="text"
                      value={editNote}
                      onChange={(e) => setEditNote(e.target.value)}
                    />
                  ) : (
                    tx.note
                  )}
                </td>
                <td>{tx.amount} €</td>
                <td>
                  {editingId === tx.id ? (
                    <>
                      <button onClick={() => handleSave(tx.id)}>Enregistrer</button>
                      <button onClick={() => setEditingId(null)}>Annuler</button>
                    </>
                  ) : (
                    <button onClick={() => handleEdit(tx)}>✏️ Modifier</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
}
