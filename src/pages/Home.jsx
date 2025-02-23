import React, { useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { User, Trash, Edit, Plus, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "../styles/Home.css";

const Home = () => {
  const navigate = useNavigate(); 
  const [showEditForm, setShowEditForm] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  const [transactions, setTransactions] = useState([
    { id: 1, type: "Expense", amount: 1500, date: "2024-02-20" },
    { id: 2, type: "Income", amount: 3000, date: "2024-02-21" },
    { id: 3, type: "Expense", amount: 500, date: "2024-02-22" },
    { id: 4, type: "Income", amount: 2000, date: "2024-02-23" },
    { id: 5, type: "Expense", amount: 800, date: "2024-02-24" },
  ]);

  const [newTransaction, setNewTransaction] = useState({
    type: "Expense",
    amount: "",
    date: new Date().toISOString().split("T")[0],
  });

  const totalIncome = transactions
    .filter((t) => t.type === "Income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === "Expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalAmount = totalIncome + totalExpense;
  const expensePercentage = totalAmount
    ? ((totalExpense / totalAmount) * 100).toFixed(2)
    : 0;
  const incomePercentage = totalAmount
    ? ((totalIncome / totalAmount) * 100).toFixed(2)
    : 0;

  const pieData = [
    { name: `Income (${incomePercentage}%)`, value: totalIncome, color: "#10B981" },
    { name: `Expense (${expensePercentage}%)`, value: totalExpense, color: "#EF4444" },
  ];

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const handleAddTransaction = () => {
    if (!newTransaction.amount) return alert("Amount cannot be empty!");

    const updatedTransactions = [
      ...transactions,
      {
        id: Date.now(),
        type: newTransaction.type,
        amount: Number(newTransaction.amount),
        date: newTransaction.date,
      },
    ];

    setTransactions(updatedTransactions);
    setShowAddForm(false);
    setNewTransaction({ type: "Expense", amount: "", date: new Date().toISOString().split("T")[0] });
  };

  const handleDeleteTransaction = (id) => {
    setTransactions(transactions.filter((t) => t.id !== id));
  };

  const handleEditTransaction = () => {
    if (!selectedTransaction.amount) return alert("Amount cannot be empty!");

    setTransactions(transactions.map((t) => (t.id === selectedTransaction.id ? selectedTransaction : t)));
    setShowEditForm(false);
  };

  return (
    <div className="home-container">
      {/* Navigation Bar */}
      <nav className="navbar">
        <h1 className="logo">Expense Manager</h1>
        <div className="user-dropdown">
          <div className="dropdown-toggle" onClick={toggleDropdown}>
            <User className="icon" />
            <span>username ▼</span>
          </div>

          {dropdownOpen && (
            <div className="dropdown-menu">
               <button className="dropdown-item" onClick={() => navigate("/profile")}>
              Profile
            </button>
            <button className="dropdown-item" onClick={() => navigate("/Signup")}>
              Sign Out
            </button>
            </div>
          )}
        </div>
      </nav>

      {/* Transactions Table */}
      <div className="transactions-container">
        <h2 className="section-title">Transactions</h2>
        <button className="add-btn" onClick={() => setShowAddForm(true)}>
          <Plus size={16} /> Add Transaction
        </button>
        <div className="table-wrapper">
          <table className="transactions-table">
            <thead>
              <tr>
                <th>Type</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td className={`type-badge ${transaction.type.toLowerCase()}`}>
                    {transaction.type}
                  </td>
                  <td>${transaction.amount.toLocaleString()}</td>
                  <td>{transaction.date}</td>
                  <td>
                    <button className="edit-btn" onClick={() => { setSelectedTransaction(transaction); setShowEditForm(true); }}>
                      <Edit size={16} />
                    </button>
                    <button className="delete-btn" onClick={() => handleDeleteTransaction(transaction.id)}>
                      <Trash size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pie Chart */}
      <div className="chart-container">
        <h2 className="section-title">Expense Overview</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value" label>
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Add Transaction Modal */}
      {showAddForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Add Transaction</h3>
            <select value={newTransaction.type} onChange={(e) => setNewTransaction({ ...newTransaction, type: e.target.value })}>
              <option value="Expense">Expense</option>
              <option value="Income">Income</option>
            </select>
            <input type="number" placeholder="Amount" value={newTransaction.amount} onChange={(e) => setNewTransaction({ ...newTransaction, amount: e.target.value })} />
            <input type="date" value={newTransaction.date} onChange={(e) => setNewTransaction({ ...newTransaction, date: e.target.value })} />
            <button onClick={handleAddTransaction}>Save</button>
            <X className="close-btn" onClick={() => setShowAddForm(false)} />
          </div>
        </div>
      )}

      {/* Edit Transaction Modal */}
      {showEditForm && selectedTransaction && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Edit Transaction</h3>
            <select value={selectedTransaction.type} onChange={(e) => setSelectedTransaction({ ...selectedTransaction, type: e.target.value })}>
              <option value="Expense">Expense</option>
              <option value="Income">Income</option>
            </select>
            <input type="number" value={selectedTransaction.amount} onChange={(e) => setSelectedTransaction({ ...selectedTransaction, amount: e.target.value })} />
            <input type="date" value={selectedTransaction.date} onChange={(e) => setSelectedTransaction({ ...selectedTransaction, date: e.target.value })} />
            <button onClick={handleEditTransaction}>Update</button>
            <X className="close-btn" onClick={() => setShowEditForm(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
