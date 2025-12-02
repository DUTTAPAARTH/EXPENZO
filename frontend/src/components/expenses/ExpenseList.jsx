import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import ExpenseItem from "./ExpenseItem";
import { Inbox } from "lucide-react";

const ExpenseList = ({ expenses, onEdit, onDelete, loading }) => {
  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="bg-slate-900 border border-slate-800 rounded-xl p-4 animate-pulse"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="h-6 bg-slate-800 rounded w-32 mb-3" />
                <div className="h-4 bg-slate-800 rounded w-full mb-2" />
                <div className="h-3 bg-slate-800 rounded w-48" />
              </div>
              <div className="h-8 bg-slate-800 rounded w-24" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!expenses || expenses.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center"
      >
        <div className="inline-flex items-center justify-center w-20 h-20 bg-slate-800 rounded-full mb-4">
          <Inbox className="w-10 h-10 text-slate-600" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">No expenses found</h3>
        <p className="text-slate-400 mb-6">
          Start tracking your expenses by adding your first transaction
        </p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-4">
      <AnimatePresence mode="popLayout">
        {expenses.map((expense) => (
          <ExpenseItem
            key={expense.id || expense._id}
            expense={expense}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ExpenseList;
