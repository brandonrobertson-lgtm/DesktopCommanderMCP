import { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'

interface Budget {
  id: string
  name: string
  amount: number
  spent: number
  category: string
}

interface Transaction {
  id: string
  amount: number
  description: string
  category: string
  date: string
  type: string
}

interface Bill {
  id: string
  name: string
  amount: number
  dueDate: string
  isPaid: boolean
  payee: string
}

function App() {
  const [health, setHealth] = useState<any>(null)
  const [budgets, setBudgets] = useState<Budget[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [bills, setBills] = useState<Bill[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('dashboard')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [healthRes, budgetsRes, transactionsRes, billsRes] = await Promise.all([
        axios.get('/health'),
        axios.get('/api/budget'),
        axios.get('/api/budget/transactions'),
        axios.get('/api/budget/bills')
      ])

      setHealth(healthRes.data)
      setBudgets(budgetsRes.data.data)
      setTransactions(transactionsRes.data.data)
      setBills(billsRes.data.data)
      setLoading(false)
    } catch (err) {
      console.error('Error loading data:', err)
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    })
  }

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0)

  const upcomingBills = bills.filter(b => !b.isPaid)

  return (
    <div className="app">
      {/* Navigation Sidebar */}
      <nav className="sidebar">
        <div className="sidebar-header">
          <h1 className="logo">🏠 FamilyOrg</h1>
        </div>

        <div className="nav-menu">
          <button
            className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <span className="nav-icon">📊</span>
            Dashboard
          </button>
          <button
            className={`nav-item ${activeTab === 'budget' ? 'active' : ''}`}
            onClick={() => setActiveTab('budget')}
          >
            <span className="nav-icon">💰</span>
            Budget
          </button>
          <button
            className={`nav-item ${activeTab === 'todos' ? 'active' : ''}`}
            onClick={() => setActiveTab('todos')}
          >
            <span className="nav-icon">✓</span>
            To-Do Lists
          </button>
          <button
            className={`nav-item ${activeTab === 'vehicles' ? 'active' : ''}`}
            onClick={() => setActiveTab('vehicles')}
          >
            <span className="nav-icon">🚗</span>
            Vehicles
          </button>
          <button
            className={`nav-item ${activeTab === 'meals' ? 'active' : ''}`}
            onClick={() => setActiveTab('meals')}
          >
            <span className="nav-icon">🍽️</span>
            Meals
          </button>
          <button
            className={`nav-item ${activeTab === 'medications' ? 'active' : ''}`}
            onClick={() => setActiveTab('medications')}
          >
            <span className="nav-icon">💊</span>
            Medications
          </button>
          <button
            className={`nav-item ${activeTab === 'passwords' ? 'active' : ''}`}
            onClick={() => setActiveTab('passwords')}
          >
            <span className="nav-icon">🔐</span>
            Passwords
          </button>
          <button
            className={`nav-item ${activeTab === 'documents' ? 'active' : ''}`}
            onClick={() => setActiveTab('documents')}
          >
            <span className="nav-icon">📄</span>
            Documents
          </button>
        </div>

        <div className="sidebar-footer">
          <div className="connection-status">
            {health ? (
              <><span className="status-dot success"></span> Connected</>
            ) : (
              <><span className="status-dot error"></span> Offline</>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="main-content">
        <header className="top-bar">
          <h2 className="page-title">
            {activeTab === 'dashboard' && '📊 Dashboard'}
            {activeTab === 'budget' && '💰 Budget & Finance'}
            {activeTab === 'todos' && '✓ To-Do Lists'}
            {activeTab === 'vehicles' && '🚗 Vehicles'}
            {activeTab === 'meals' && '🍽️ Meals & Nutrition'}
            {activeTab === 'medications' && '💊 Medications'}
            {activeTab === 'passwords' && '🔐 Password Manager'}
            {activeTab === 'documents' && '📄 Documents'}
          </h2>
          <div className="user-menu">
            <span className="user-avatar">DU</span>
            <span className="user-name">Demo User</span>
          </div>
        </header>

        <div className="content-area">
          {loading ? (
            <div className="loading">
              <div className="spinner"></div>
              <p>Loading your data...</p>
            </div>
          ) : activeTab === 'dashboard' ? (
            <>
              {/* Stats Cards */}
              <div className="stats-grid">
                <div className="stat-card income">
                  <div className="stat-icon">💵</div>
                  <div className="stat-content">
                    <p className="stat-label">Total Income</p>
                    <h3 className="stat-value">{formatCurrency(totalIncome)}</h3>
                    <p className="stat-subtitle">This month</p>
                  </div>
                </div>

                <div className="stat-card expense">
                  <div className="stat-icon">💸</div>
                  <div className="stat-content">
                    <p className="stat-label">Total Expenses</p>
                    <h3 className="stat-value">{formatCurrency(totalExpenses)}</h3>
                    <p className="stat-subtitle">This month</p>
                  </div>
                </div>

                <div className="stat-card balance">
                  <div className="stat-icon">💰</div>
                  <div className="stat-content">
                    <p className="stat-label">Balance</p>
                    <h3 className="stat-value">{formatCurrency(totalIncome - totalExpenses)}</h3>
                    <p className="stat-subtitle">Remaining</p>
                  </div>
                </div>

                <div className="stat-card bills">
                  <div className="stat-icon">📝</div>
                  <div className="stat-content">
                    <p className="stat-label">Upcoming Bills</p>
                    <h3 className="stat-value">{upcomingBills.length}</h3>
                    <p className="stat-subtitle">Need attention</p>
                  </div>
                </div>
              </div>

              {/* Main Dashboard Grid */}
              <div className="dashboard-grid">
                {/* Budgets */}
                <div className="card">
                  <div className="card-header">
                    <h3>💰 Budget Overview</h3>
                    <button className="btn-small">View All</button>
                  </div>
                  <div className="card-body">
                    {budgets.map(budget => (
                      <div key={budget.id} className="budget-item">
                        <div className="budget-info">
                          <p className="budget-name">{budget.name}</p>
                          <p className="budget-category">{budget.category}</p>
                        </div>
                        <div className="budget-progress">
                          <div className="budget-bar">
                            <div
                              className="budget-fill"
                              style={{
                                width: `${Math.min((budget.spent / budget.amount) * 100, 100)}%`,
                                background: budget.spent > budget.amount ? '#ef4444' : '#10b981'
                              }}
                            ></div>
                          </div>
                          <p className="budget-text">
                            {formatCurrency(budget.spent)} of {formatCurrency(budget.amount)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Transactions */}
                <div className="card">
                  <div className="card-header">
                    <h3>💳 Recent Transactions</h3>
                    <button className="btn-small">View All</button>
                  </div>
                  <div className="card-body">
                    {transactions.slice(0, 5).map(transaction => (
                      <div key={transaction.id} className="transaction-item">
                        <div className="transaction-icon">
                          {transaction.type === 'income' ? '💰' : '💸'}
                        </div>
                        <div className="transaction-info">
                          <p className="transaction-desc">{transaction.description}</p>
                          <p className="transaction-date">{formatDate(transaction.date)}</p>
                        </div>
                        <div className={`transaction-amount ${transaction.type}`}>
                          {transaction.type === 'income' ? '+' : ''}{formatCurrency(transaction.amount)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Upcoming Bills */}
                <div className="card">
                  <div className="card-header">
                    <h3>📝 Upcoming Bills</h3>
                    <button className="btn-small">View All</button>
                  </div>
                  <div className="card-body">
                    {upcomingBills.map(bill => (
                      <div key={bill.id} className="bill-item">
                        <div className="bill-info">
                          <p className="bill-name">{bill.name}</p>
                          <p className="bill-payee">{bill.payee}</p>
                        </div>
                        <div className="bill-details">
                          <p className="bill-amount">{formatCurrency(bill.amount)}</p>
                          <p className="bill-date">Due {formatDate(bill.dueDate)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="card">
                  <div className="card-header">
                    <h3>⚡ Quick Actions</h3>
                  </div>
                  <div className="card-body">
                    <div className="quick-actions">
                      <button className="action-btn">
                        <span className="action-icon">➕</span>
                        Add Transaction
                      </button>
                      <button className="action-btn">
                        <span className="action-icon">📝</span>
                        New To-Do
                      </button>
                      <button className="action-btn">
                        <span className="action-icon">🍽️</span>
                        Plan Meal
                      </button>
                      <button className="action-btn">
                        <span className="action-icon">🛒</span>
                        Add to Grocery
                      </button>
                      <button className="action-btn">
                        <span className="action-icon">💊</span>
                        Log Medication
                      </button>
                      <button className="action-btn">
                        <span className="action-icon">📄</span>
                        Upload Document
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="coming-soon">
              <div className="coming-soon-icon">🚀</div>
              <h2>Coming Soon!</h2>
              <p>The {activeTab} module is under development.</p>
              <p className="feature-note">
                This feature includes full functionality for managing your family's {activeTab}.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default App
