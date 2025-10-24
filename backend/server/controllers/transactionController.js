let fakeTransactions = [
  {
    id: 1,
    accountId: 8349,
    date: '2025-10-01',
    description: 'Restaurant',
    type: 'debit',
    amount: 32.5,
    category: 'Food',
    note: 'Déjeuner avec client',
  },
  {
    id: 2,
    accountId: 8349,
    date: '2025-10-02',
    description: 'Salaire Octobre',
    type: 'credit',
    amount: 2500.0,
    category: 'Revenus',
    note: '',
  },
];

const findTxn = (transactionId) =>
  fakeTransactions.find((t) => t.id === Number(transactionId));

exports.getTransactionsByAccount = (req, res) => {
  const { accountId } = req.params;
  const list = fakeTransactions.filter(
    (t) => String(t.accountId) === String(accountId)
  );
  return res.status(200).json({ body: list });
};

exports.getTransactionById = (req, res) => {
  const txn = findTxn(req.params.transactionId);
  if (!txn) return res.status(404).json({ message: 'Transaction not found' });
  return res.status(200).json({ body: txn });
};

exports.addNote = (req, res) => {
  const txn = findTxn(req.params.transactionId);
  if (!txn) return res.status(404).json({ message: 'Transaction not found' });

  const { note } = req.body || {};
  if (typeof note !== 'string')
    return res.status(400).json({ message: 'Invalid note' });

  txn.note = note;
  return res.status(200).json({ body: txn });
};

exports.updateNote = (req, res) => {
  const txn = findTxn(req.params.transactionId);
  if (!txn) return res.status(404).json({ message: 'Transaction not found' });

  const { note } = req.body || {};
  if (typeof note !== 'string')
    return res.status(400).json({ message: 'Invalid note' });

  txn.note = note;
  return res.status(200).json({ body: txn });
};

exports.deleteNote = (req, res) => {
  const txn = findTxn(req.params.transactionId);
  if (!txn) return res.status(404).json({ message: 'Transaction not found' });

  txn.note = '';
  return res.status(200).json({ body: txn });
};


exports.addCategory = (req, res) => {
  const txn = findTxn(req.params.transactionId);
  if (!txn) return res.status(404).json({ message: 'Transaction not found' });

  const { category } = req.body || {};
  if (typeof category !== 'string' || !category.trim())
    return res.status(400).json({ message: 'Invalid category' });

  txn.category = category.trim();
  return res.status(200).json({ body: txn });
};

exports.updateCategory = (req, res) => {
  const txn = findTxn(req.params.transactionId);
  if (!txn) return res.status(404).json({ message: 'Transaction not found' });

  const { category } = req.body || {};
  if (typeof category !== 'string' || !category.trim())
    return res.status(400).json({ message: 'Invalid category' });

  txn.category = category.trim();
  return res.status(200).json({ body: txn });
};

exports.deleteCategory = (req, res) => {
  const txn = findTxn(req.params.transactionId);
  if (!txn) return res.status(404).json({ message: 'Transaction not found' });

  txn.category = '';
  return res.status(200).json({ body: txn });
};
