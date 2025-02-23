import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Calendar, User, LogOut, X } from 'lucide-react';

const s = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [transactions, setTransactions] = useState([
    { id: 1, type: 'Expense', amount: 1500, date: '2024-02-20' },
    { id: 2, type: 'Income', amount: 3000, date: '2024-02-21' },
    { id: 3, type: 'Expense', amount: 500, date: '2024-02-22' }
  ]);

  const [newTransaction, setNewTransaction] = useState({
    type: 'Expense',
    amount: '',
    date: new Date().toISOString().split('T')[0]
  });

  const totalIncome = transactions
    .filter(t => t.type === 'Income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter(t => t.type === 'Expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const pieData = [
    { name: 'Income', value: totalIncome, color: '#10B981' },
    { name: 'Expense', value: totalExpense, color: '#EF4444' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    const transaction = {
      id: Date.now(),
      ...newTransaction
    };
    setTransactions([...transactions, transaction]);
    setNewTransaction({
      type: 'Expense',
      amount: '',
      date: new Date().toISOString().split('T')[0]
    });
    setShowAddForm(false);
  };

  const handleEdit = (transaction) => {
    setSelectedTransaction(transaction);
    setShowEditForm(true);
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    setTransactions(transactions.map(t => 
      t.id === selectedTransaction.id ? selectedTransaction : t
    ));
    setShowEditForm(false);
  };

  const handleDelete = (id) => {
    setTransactions(transactions.filter(t => t.id !== id));
  };

  return (
    <div className="min-h-screen bg-blue-800">
      {/* Navigation Bar */}
      <nav className="bg-blue-900 px-8 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-red-500">Expense Manager</h1>
        <div className="relative group">
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 text-white">
            <User className="h-5 w-5" />
            <span>username ▼</span>
          </button>
          <div className="hidden group-hover:block absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg">
            <a href="#" className="flex items-center gap-2 px-4 py-3 text-gray-700 hover:bg-gray-50">
              <User className="h-4 w-4" />
              <span>My Profile</span>
            </a>
            <a href="#" className="flex items-center gap-2 px-4 py-3 text-red-500 hover:bg-gray-50">
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
            </a>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-8 py-6">
        {/* Filter Section */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg">
            <Calendar className="h-5 w-5 text-gray-500" />
            <select className="border-none bg-transparent text-gray-700">
              <option>This Month</option>
              <option>Last Month</option>
              <option>Last 3 Months</option>
              <option>This Year</option>
            </select>
          </div>
          <button 
            className="bg-emerald-500 text-white px-6 py-2 rounded-lg hover:bg-emerald-600 transition-colors"
            onClick={() => setShowAddForm(true)}
          >
            + Add Transaction
          </button>
        </div>

        {/* Statistics Section */}
        <div className="bg-white rounded-2xl p-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-emerald-500 text-white p-6 rounded-xl">
              <h3 className="text-sm mb-2">Total Income</h3>
              <p className="text-2xl font-bold">${totalIncome.toLocaleString()}</p>
            </div>
            <div className="bg-red-500 text-white p-6 rounded-xl">
              <h3 className="text-sm mb-2">Total Expense</h3>
              <p className="text-2xl font-bold">${totalExpense.toLocaleString()}</p>
            </div>
            <div className="bg-indigo-500 text-white p-6 rounded-xl">
              <h3 className="text-sm mb-2">Balance</h3>
              <p className="text-2xl font-bold">${(totalIncome - totalExpense).toLocaleString()}</p>
            </div>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="w-full h-64">
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex gap-8 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                <span className="text-gray-600">Income</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span className="text-gray-600">Expense</span>
              </div>
            </div>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="bg-white rounded-2xl p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-left py-4 px-6 text-gray-500 font-medium">Type</th>
                  <th className="text-left py-4 px-6 text-gray-500 font-medium">Amount</th>
                  <th className="text-left py-4 px-6 text-gray-500 font-medium">Date</th>
                  <th className="text-left py-4 px-6 text-gray-500 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map(transaction => (
                  <tr key={transaction.id} className="border-t border-gray-100">
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        transaction.type === 'Income' 
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {transaction.type}
                      </span>
                    </td>
                    <td className="py-4 px-6">${transaction.amount.toLocaleString()}</td>
                    <td className="py-4 px-6">{transaction.date}</td>
                    <td className="py-4 px-6">
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleEdit(transaction)}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          ✏️
                        </button>
                        <button 
                          onClick={() => handleDelete(transaction.id)}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal Overlay */}
        {(showAddForm || showEditForm) && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">
                  {showAddForm ? 'Add Transaction' : 'Edit Transaction'}
                </h2>
                <button 
                  onClick={() => showAddForm ? setShowAddForm(false) : setShowEditForm(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <form onSubmit={showAddForm ? handleSubmit : handleUpdate}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                    <select
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      value={showAddForm ? newTransaction.type : selectedTransaction?.type}
                      onChange={(e) => showAddForm 
                        ? setNewTransaction({...newTransaction, type: e.target.value})
                        : setSelectedTransaction({...selectedTransaction, type: e.target.value})
                      }
                    >
                      <option>Expense</option>
                      <option>Income</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                    <input
                      type="number"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      value={showAddForm ? newTransaction.amount : selectedTransaction?.amount}
                      onChange={(e) => showAddForm
                        ? setNewTransaction({...newTransaction, amount: Number(e.target.value)})
                        : setSelectedTransaction({...selectedTransaction, amount: Number(e.target.value)})
                      }
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                    <input
                      type="date"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      value={showAddForm ? newTransaction.date : selectedTransaction?.date}
                      onChange={(e) => showAddForm
                        ? setNewTransaction({...newTransaction, date: e.target.value})
                        : setSelectedTransaction({...selectedTransaction, date: e.target.value})
                      }
                      required
                    />
                  </div>
                </div>
                <button 
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg mt-6 hover:bg-blue-700 transition-colors"
                >
                  {showAddForm ? 'Add Transaction' : 'Update Transaction'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default s;