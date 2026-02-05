import { Request, Response } from 'express';
import { mockStore, generateId } from '../data/mockStore';

export class BudgetController {
  async getBudgets(req: Request, res: Response) {
    try {
      res.json({ success: true, data: mockStore.budgets });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  async getBudget(req: Request, res: Response) {
    try {
      const budget = mockStore.budgets.find(b => b.id === req.params.id);
      if (!budget) {
        return res.status(404).json({ success: false, error: 'Budget not found' });
      }
      res.json({ success: true, data: budget });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  async createBudget(req: Request, res: Response) {
    try {
      const newBudget = {
        id: generateId(),
        familyId: '1',
        ...req.body,
        spent: 0,
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      };
      mockStore.budgets.push(newBudget);
      res.json({ success: true, data: newBudget });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  async updateBudget(req: Request, res: Response) {
    try {
      const index = mockStore.budgets.findIndex(b => b.id === req.params.id);
      if (index === -1) {
        return res.status(404).json({ success: false, error: 'Budget not found' });
      }
      mockStore.budgets[index] = { ...mockStore.budgets[index], ...req.body };
      res.json({ success: true, data: mockStore.budgets[index] });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  async deleteBudget(req: Request, res: Response) {
    try {
      const index = mockStore.budgets.findIndex(b => b.id === req.params.id);
      if (index === -1) {
        return res.status(404).json({ success: false, error: 'Budget not found' });
      }
      mockStore.budgets.splice(index, 1);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  async getTransactions(req: Request, res: Response) {
    try {
      res.json({ success: true, data: mockStore.transactions });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  async getTransaction(req: Request, res: Response) {
    try {
      const transaction = mockStore.transactions.find(t => t.id === req.params.id);
      if (!transaction) {
        return res.status(404).json({ success: false, error: 'Transaction not found' });
      }
      res.json({ success: true, data: transaction });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  async createTransaction(req: Request, res: Response) {
    try {
      const newTransaction = {
        id: generateId(),
        familyId: '1',
        ...req.body,
        date: new Date()
      };
      mockStore.transactions.push(newTransaction);
      res.json({ success: true, data: newTransaction });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  async updateTransaction(req: Request, res: Response) {
    try {
      const index = mockStore.transactions.findIndex(t => t.id === req.params.id);
      if (index === -1) {
        return res.status(404).json({ success: false, error: 'Transaction not found' });
      }
      mockStore.transactions[index] = { ...mockStore.transactions[index], ...req.body };
      res.json({ success: true, data: mockStore.transactions[index] });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  async deleteTransaction(req: Request, res: Response) {
    try {
      const index = mockStore.transactions.findIndex(t => t.id === req.params.id);
      if (index === -1) {
        return res.status(404).json({ success: false, error: 'Transaction not found' });
      }
      mockStore.transactions.splice(index, 1);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  async getBills(req: Request, res: Response) {
    try {
      res.json({ success: true, data: mockStore.bills });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  async getBill(req: Request, res: Response) {
    try {
      const bill = mockStore.bills.find(b => b.id === req.params.id);
      if (!bill) {
        return res.status(404).json({ success: false, error: 'Bill not found' });
      }
      res.json({ success: true, data: bill });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  async createBill(req: Request, res: Response) {
    try {
      const newBill = {
        id: generateId(),
        familyId: '1',
        ...req.body,
        isPaid: false
      };
      mockStore.bills.push(newBill);
      res.json({ success: true, data: newBill });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  async updateBill(req: Request, res: Response) {
    try {
      const index = mockStore.bills.findIndex(b => b.id === req.params.id);
      if (index === -1) {
        return res.status(404).json({ success: false, error: 'Bill not found' });
      }
      mockStore.bills[index] = { ...mockStore.bills[index], ...req.body };
      res.json({ success: true, data: mockStore.bills[index] });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  async deleteBill(req: Request, res: Response) {
    try {
      const index = mockStore.bills.findIndex(b => b.id === req.params.id);
      if (index === -1) {
        return res.status(404).json({ success: false, error: 'Bill not found' });
      }
      mockStore.bills.splice(index, 1);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  async markBillPaid(req: Request, res: Response) {
    try {
      const index = mockStore.bills.findIndex(b => b.id === req.params.id);
      if (index === -1) {
        return res.status(404).json({ success: false, error: 'Bill not found' });
      }
      mockStore.bills[index].isPaid = true;
      mockStore.bills[index].paidDate = new Date();
      res.json({ success: true, data: mockStore.bills[index] });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  async connectWealthsimple(req: Request, res: Response) { res.json({ success: true }); }
  async getWealthsimpleAccounts(req: Request, res: Response) { res.json({ success: true, data: [] }); }
  async syncWealthsimple(req: Request, res: Response) { res.json({ success: true }); }
  async connectYNAB(req: Request, res: Response) { res.json({ success: true }); }
  async getYNABBudgets(req: Request, res: Response) { res.json({ success: true, data: [] }); }
  async syncYNAB(req: Request, res: Response) { res.json({ success: true }); }

  async getSpendingReport(req: Request, res: Response) {
    try {
      const expenses = mockStore.transactions.filter(t => t.type === 'expense');
      const totalSpent = expenses.reduce((sum: number, t: any) => sum + Math.abs(t.amount), 0);
      res.json({ success: true, data: { totalSpent, transactions: expenses.length }});
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  async getIncomeReport(req: Request, res: Response) {
    try {
      const income = mockStore.transactions.filter(t => t.type === 'income');
      const totalIncome = income.reduce((sum: number, t: any) => sum + t.amount, 0);
      res.json({ success: true, data: { totalIncome }});
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  async getTrends(req: Request, res: Response) {
    res.json({ success: true, data: { monthlySpending: [] }});
  }
}
