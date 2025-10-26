import { useNavigate } from 'react-router-dom';

export default function Account({ title, amount, description }) {
  const navigate = useNavigate();

  const handleViewTransactions = () => {
    const match = title.match(/\(x(\d+)\)/);
    const accountId = match ? match[1] : null;
    if (accountId) {
      navigate(`/transaction?accountId=${accountId}`);
    } else {
      navigate('/transaction');
    }
  };

  return (
    <section className="account">
      <div className="account-content-wrapper">
        <h3 className="account-title">{title}</h3>
        <p className="account-amount">{amount}</p>
        <p className="account-amount-description">{description}</p>
      </div>
      <div className="account-content-wrapper cta">
        <button
          className="transaction-button"
          onClick={handleViewTransactions}
        >
          Voir les transactions
        </button>
      </div>
    </section>
  );
}
