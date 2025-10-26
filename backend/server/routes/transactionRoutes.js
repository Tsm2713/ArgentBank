const express = require('express');
const router = express.Router();

const tokenValidation = require('../middleware/tokenValidation');
const transactionController = require('../controllers/transactionController');

// Liste
router.get(
  '/user/:accountId/transactions',
  tokenValidation.validateToken,
  transactionController.getAccountTransactions
);

// Détail
router.get(
  '/user/transactions/:transactionId',
  tokenValidation.validateToken,
  transactionController.getTransactionById
);

// NOTE
router.post(
  '/user/transactions/:transactionId/note',
  tokenValidation.validateToken,
  transactionController.addNote
);

//MODIFIER
router.put(
  '/user/transactions/:transactionId/note',
  tokenValidation.validateToken,
  transactionController.updateNote
);

//DELETE
router.delete(
  '/user/transactions/:transactionId/note',
  tokenValidation.validateToken,
  transactionController.deleteNote
);

// CATEGORY
router.post(
  '/user/transactions/:transactionId/category',
  tokenValidation.validateToken,
  transactionController.addCategory
);
router.put(
  '/user/transactions/:transactionId/category',
  tokenValidation.validateToken,
  transactionController.updateCategory
);
router.delete(
  '/user/transactions/:transactionId/category',
  tokenValidation.validateToken,
  transactionController.deleteCategory
);

// TYPE (documenté, UI non utilisée)
router.post(
  '/user/transactions/:transactionId/type',
  tokenValidation.validateToken,
  transactionController.addType
);

router.delete(
  '/user/transactions/:transactionId/type',
  tokenValidation.validateToken,
  transactionController.deleteType
);

module.exports = router;
