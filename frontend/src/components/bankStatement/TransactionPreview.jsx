import React, { useState } from "react";
import {
  Check,
  X,
  Edit2,
  TrendingUp,
  TrendingDown,
  Calendar,
  Tag,
  DollarSign,
} from "lucide-react";

const CATEGORIES = [
  "Food & Dining",
  "Transportation",
  "Shopping",
  "Entertainment",
  "Bills & Utilities",
  "Healthcare",
  "Groceries",
  "Transfer",
  "Salary",
  "Others",
];

export default function TransactionPreview({
  transactions,
  onTransactionsUpdate,
  onImport,
  importing,
}) {
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  const selectedTransactions = transactions.filter((t) => t.selected);
  const totalExpenses = selectedTransactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);
  const totalIncome = selectedTransactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const handleToggleSelect = (id) => {
    const updated = transactions.map((t) =>
      t.id === id ? { ...t, selected: !t.selected } : t
    );
    onTransactionsUpdate(updated);
  };

  const handleSelectAll = () => {
    const allSelected = transactions.every((t) => t.selected);
    const updated = transactions.map((t) => ({ ...t, selected: !allSelected }));
    onTransactionsUpdate(updated);
  };

  const handleStartEdit = (transaction) => {
    setEditingId(transaction.id);
    setEditForm({
      description: transaction.description,
      amount: transaction.amount,
      category: transaction.category,
      date: transaction.date,
      type: transaction.type,
    });
  };

  const handleSaveEdit = (id) => {
    const updated = transactions.map((t) =>
      t.id === id ? { ...t, ...editForm } : t
    );
    onTransactionsUpdate(updated);
    setEditingId(null);
    setEditForm({});
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const handleDeleteTransaction = (id) => {
    const updated = transactions.filter((t) => t.id !== id);
    onTransactionsUpdate(updated);
  };

  if (transactions.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {/* Summary Bar */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg p-6 text-white">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-indigo-100 text-sm mb-1">Total Transactions</p>
            <p className="text-3xl font-bold">{selectedTransactions.length}</p>
            <p className="text-indigo-100 text-xs mt-1">
              of {transactions.length} selected
            </p>
          </div>
          <div>
            <p className="text-indigo-100 text-sm mb-1 flex items-center gap-1">
              <TrendingDown className="w-4 h-4" />
              Total Expenses
            </p>
            <p className="text-3xl font-bold">₹{totalExpenses.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-indigo-100 text-sm mb-1 flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              Total Income
            </p>
            <p className="text-3xl font-bold">₹{totalIncome.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* Actions Bar */}
      <div className="flex items-center justify-between bg-white rounded-lg border border-gray-200 p-4">
        <button
          onClick={handleSelectAll}
          className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
        >
          {transactions.every((t) => t.selected)
            ? "Deselect All"
            : "Select All"}
        </button>
        <button
          onClick={onImport}
          disabled={selectedTransactions.length === 0 || importing}
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
        >
          {importing
            ? "Importing..."
            : `Import ${selectedTransactions.length} Selected`}
        </button>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="w-12 px-4 py-3"></th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-600 uppercase">
                  Date
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-600 uppercase">
                  Description
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-600 uppercase">
                  Category
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-600 uppercase">
                  Type
                </th>
                <th className="text-right px-4 py-3 text-xs font-medium text-gray-600 uppercase">
                  Amount
                </th>
                <th className="w-24 px-4 py-3 text-xs font-medium text-gray-600 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {transactions.map((transaction) => (
                <tr
                  key={transaction.id}
                  className={`
                    hover:bg-gray-50 transition-colors
                    ${!transaction.selected ? "opacity-50" : ""}
                  `}
                >
                  {/* Checkbox */}
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={transaction.selected}
                      onChange={() => handleToggleSelect(transaction.id)}
                      className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                    />
                  </td>

                  {/* Date */}
                  <td className="px-4 py-3">
                    {editingId === transaction.id ? (
                      <input
                        type="date"
                        value={editForm.date}
                        onChange={(e) =>
                          setEditForm({ ...editForm, date: e.target.value })
                        }
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                      />
                    ) : (
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        {new Date(transaction.date).toLocaleDateString("en-GB")}
                      </div>
                    )}
                  </td>

                  {/* Description */}
                  <td className="px-4 py-3">
                    {editingId === transaction.id ? (
                      <input
                        type="text"
                        value={editForm.description}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            description: e.target.value,
                          })
                        }
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                      />
                    ) : (
                      <p className="text-sm text-gray-900 max-w-xs truncate">
                        {transaction.description}
                      </p>
                    )}
                  </td>

                  {/* Category */}
                  <td className="px-4 py-3">
                    {editingId === transaction.id ? (
                      <select
                        value={editForm.category}
                        onChange={(e) =>
                          setEditForm({ ...editForm, category: e.target.value })
                        }
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                      >
                        {CATEGORIES.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-700">
                        <Tag className="w-3 h-3" />
                        {transaction.category}
                      </span>
                    )}
                  </td>

                  {/* Type */}
                  <td className="px-4 py-3">
                    {editingId === transaction.id ? (
                      <select
                        value={editForm.type}
                        onChange={(e) =>
                          setEditForm({ ...editForm, type: e.target.value })
                        }
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                      >
                        <option value="expense">Expense</option>
                        <option value="income">Income</option>
                      </select>
                    ) : (
                      <span
                        className={`
                          inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium
                          ${
                            transaction.type === "expense"
                              ? "bg-red-100 text-red-700"
                              : "bg-green-100 text-green-700"
                          }
                        `}
                      >
                        {transaction.type === "expense" ? (
                          <TrendingDown className="w-3 h-3" />
                        ) : (
                          <TrendingUp className="w-3 h-3" />
                        )}
                        {transaction.type}
                      </span>
                    )}
                  </td>

                  {/* Amount */}
                  <td className="px-4 py-3 text-right">
                    {editingId === transaction.id ? (
                      <input
                        type="number"
                        value={editForm.amount}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            amount: parseFloat(e.target.value) || 0,
                          })
                        }
                        className="w-24 px-2 py-1 text-sm border border-gray-300 rounded text-right"
                        step="0.01"
                        min="0"
                      />
                    ) : (
                      <span className="text-sm font-semibold text-gray-900">
                        ₹{transaction.amount.toFixed(2)}
                      </span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3">
                    {editingId === transaction.id ? (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleSaveEdit(transaction.id)}
                          className="p-1 text-green-600 hover:bg-green-50 rounded"
                          title="Save"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="p-1 text-gray-600 hover:bg-gray-50 rounded"
                          title="Cancel"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleStartEdit(transaction)}
                          className="p-1 text-indigo-600 hover:bg-indigo-50 rounded"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() =>
                            handleDeleteTransaction(transaction.id)
                          }
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                          title="Delete"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
