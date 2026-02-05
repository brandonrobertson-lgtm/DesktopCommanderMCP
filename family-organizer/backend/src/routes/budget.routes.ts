import { Router } from 'express';
import { BudgetController } from '../controllers/budgetController';
import { authenticate } from '../middleware/auth';

const router = Router();
const controller = new BudgetController();

// All routes require authentication
router.use(authenticate);

// Budgets
router.get('/', controller.getBudgets);
router.get('/:id', controller.getBudget);
router.post('/', controller.createBudget);
router.patch('/:id', controller.updateBudget);
router.delete('/:id', controller.deleteBudget);

// Transactions
router.get('/transactions', controller.getTransactions);
router.get('/transactions/:id', controller.getTransaction);
router.post('/transactions', controller.createTransaction);
router.patch('/transactions/:id', controller.updateTransaction);
router.delete('/transactions/:id', controller.deleteTransaction);

// Bills
router.get('/bills', controller.getBills);
router.get('/bills/:id', controller.getBill);
router.post('/bills', controller.createBill);
router.patch('/bills/:id', controller.updateBill);
router.delete('/bills/:id', controller.deleteBill);
router.post('/bills/:id/pay', controller.markBillPaid);

// Wealthsimple integration
router.post('/wealthsimple/connect', controller.connectWealthsimple);
router.get('/wealthsimple/accounts', controller.getWealthsimpleAccounts);
router.post('/wealthsimple/sync', controller.syncWealthsimple);

// YNAB integration
router.post('/ynab/connect', controller.connectYNAB);
router.get('/ynab/budgets', controller.getYNABBudgets);
router.post('/ynab/sync', controller.syncYNAB);

// Reports
router.get('/reports/spending', controller.getSpendingReport);
router.get('/reports/income', controller.getIncomeReport);
router.get('/reports/trends', controller.getTrends);

export default router;
