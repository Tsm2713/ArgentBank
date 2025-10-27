const transactionsDB = new Map([
  [
    "8349",
    [
      {
        id: 1,
        accountId: "8349",
        date: "2025-10-01",
        description: "Restaurant",
        type: "debit",
        category: "Food",
        note: "Déjeuner avec client",
        amount: 32.5,
      },
      {
        id: 2,
        accountId: "8349",
        date: "2025-10-02",
        description: "Salaire Octobre",
        type: "credit",
        category: "Revenus",
        note: "",
        amount: 2500.0,
      },
    ],
  ],
  [
    "6712",
    [
      {
        id: 3,
        accountId: "6712",
        date: "2025-09-28",
        description: "Supermarché",
        type: "debit",
        category: "Shopping",
        note: "Courses semaine",
        amount: 54.2,
      },
      {
        id: 4,
        accountId: "6712",
        date: "2025-09-30",
        description: "Loyer",
        type: "debit",
        category: "Logement",
        note: "Octobre",
        amount: 1200.0,
      },
    ],
  ],
]);

function ok(res, body) {
  return res.json({ status: 200, message: "OK", body });
}

function notFound(res, msg = "Not Found") {
  return res.status(404).json({ status: 404, message: msg });
}

function findTransactionById(transactionId) {
  const idNum = Number(transactionId);
  for (const arr of transactionsDB.values()) {
    const found = arr.find((t) => Number(t.id) === idNum);
    if (found) return found;
  }
  return null;
}

// GET transactions
function getAccountTransactions(req, res) {
  const accountId = String(req.params.accountId);
  const list = transactionsDB.get(accountId) || [];
  return ok(res, list);
}

// GET transactionId
function getTransactionById(req, res) {
  const { transactionId } = req.params;
  const txn = findTransactionById(transactionId);
  if (!txn) return notFound(res, "Transaction not found");
  return ok(res, txn);
}

// NOTE
// POST 
function addNote(req, res) {
  const { transactionId } = req.params;
  const { note } = req.body || {};
  const txn = findTransactionById(transactionId);
  if (!txn) return notFound(res, "Transaction not found");
  txn.note = note ?? "";
  return ok(res, txn);
}

// PUT
function updateNote(req, res) {
  const { transactionId } = req.params;
  const { note } = req.body || {};
  const txn = findTransactionById(transactionId);
  if (!txn) return notFound(res, "Transaction not found");
  txn.note = note ?? "";
  return ok(res, txn);
}

// DELETE
function deleteNote(req, res) {
  const { transactionId } = req.params;
  const txn = findTransactionById(transactionId);
  if (!txn) return notFound(res, "Transaction not found");
  txn.note = "";
  return ok(res, txn);
}

// CATEGORY
// POST
function addCategory(req, res) {
  const { transactionId } = req.params;
  const { category } = req.body || {};
  const txn = findTransactionById(transactionId);
  if (!txn) return notFound(res, "Transaction not found");
  txn.category = category ?? "";
  return ok(res, txn);
}

// PUT 
function updateCategory(req, res) {
  const { transactionId } = req.params;
  const { category } = req.body || {};
  const txn = findTransactionById(transactionId);
  if (!txn) return notFound(res, "Transaction not found");
  txn.category = category ?? "";
  return ok(res, txn);
}

// DELETE
function deleteCategory(req, res) {
  const { transactionId } = req.params;
  const txn = findTransactionById(transactionId);
  if (!txn) return notFound(res, "Transaction not found");
  txn.category = "";
  return ok(res, txn);
}

// TYPE // POST
function addType(req, res) {
  const { transactionId } = req.params;
  const { type } = req.body || {};
  const txn = findTransactionById(transactionId);
  if (!txn) return notFound(res, "Transaction not found");
  txn.type = type ?? txn.type;
  return ok(res, txn);
}

// PUT 
function updateType(req, res) {
  const { transactionId } = req.params;
  const { type } = req.body || {};
  const txn = findTransactionById(transactionId);
  if (!txn) return notFound(res, "Transaction not found");
  txn.type = type ?? txn.type;
  return ok(res, txn);
}

// DELETE
function deleteType(req, res) {
  const { transactionId } = req.params;
  const txn = findTransactionById(transactionId);
  if (!txn) return notFound(res, "Transaction not found");
  txn.type = "";
  return ok(res, txn);
}

module.exports = {
  getAccountTransactions,
  getTransactionById,
  addNote,
  updateNote,
  deleteNote,
  addCategory,
  updateCategory,
  deleteCategory,
  addType,
  updateType,
  deleteType,
};
