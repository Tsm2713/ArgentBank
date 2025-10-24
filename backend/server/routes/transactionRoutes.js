const express = require('express');
const router = express.Router();
const tokenValidation = require('../middleware/tokenValidation');
const transactionController = require('../controllers/transactionController');

router.get(
  '/user/:accountId/transactions',
  tokenValidation.validateToken,
  transactionController.getTransactionsByAccount
);

router.get(
  '/user/transactions/:transactionId',
  tokenValidation.validateToken,
  transactionController.getTransactionById
);

router.post(
  '/user/transactions/:transactionId/note',
  tokenValidation.validateToken,
  transactionController.addNote
);
router.put(
  '/user/transactions/:transactionId/note',
  tokenValidation.validateToken,
  transactionController.updateNote
);
router.delete(
  '/user/transactions/:transactionId/note',
  tokenValidation.validateToken,
  transactionController.deleteNote
);

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

module.exports = router;
