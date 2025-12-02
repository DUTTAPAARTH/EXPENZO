import React, { useState } from "react";
import { Upload, FileText, CheckCircle, AlertCircle } from "lucide-react";
import BankStatementUploader from "./BankStatementUploader";
import TransactionPreview from "./TransactionPreview";
import axios from "axios";
import toast from "react-hot-toast";

export default function BankStatementImport({ onImportComplete }) {
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState(null);
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState(null);

  const handleTransactionsParsed = (result) => {
    setTransactions(result.transactions);
    setSummary(result.summary);
    toast.success(`Found ${result.transactions.length} transactions!`);
  };

  const handleTransactionsUpdate = (updatedTransactions) => {
    setTransactions(updatedTransactions);
  };

  const handleImport = async () => {
    const selectedTransactions = transactions.filter((t) => t.selected);

    if (selectedTransactions.length === 0) {
      toast.error("Please select at least one transaction to import");
      return;
    }

    setImporting(true);

    try {
      // Prepare expenses data for bulk import
      const expensesData = selectedTransactions.map((t) => ({
        amount: t.amount,
        category: t.category,
        description: t.description,
        date: t.date,
        type: t.type,
        paymentMethod: "Bank Transfer",
      }));

      // Call bulk import API
      const response = await axios.post("/api/expenses/bulk", {
        expenses: expensesData,
      });

      if (response.data.success) {
        setImportResult(response.data.data);
        toast.success(response.data.message);

        // Wait a bit then clear and callback
        setTimeout(() => {
          setTransactions([]);
          setSummary(null);
          setImportResult(null);
          if (onImportComplete) {
            onImportComplete();
          }
        }, 3000);
      } else {
        toast.error("Failed to import expenses");
      }
    } catch (error) {
      console.error("Import error:", error);
      toast.error(error.response?.data?.message || "Failed to import expenses");
    } finally {
      setImporting(false);
    }
  };

  const handleReset = () => {
    setTransactions([]);
    setSummary(null);
    setImportResult(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-6 text-white">
        <div className="flex items-center gap-3 mb-2">
          <Upload className="w-8 h-8" />
          <h2 className="text-2xl font-bold">Import Bank Statement</h2>
        </div>
        <p className="text-indigo-100">
          Upload your bank statement CSV file to automatically import expenses
        </p>
      </div>

      {/* Import Result Success Message */}
      {importResult && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <div className="flex items-start gap-4">
            <CheckCircle className="w-8 h-8 text-green-600 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-green-900 mb-2">
                Import Successful!
              </h3>
              <div className="text-sm text-green-800 space-y-1">
                <p>✅ {importResult.imported} expenses imported successfully</p>
                {importResult.errors > 0 && (
                  <p className="text-orange-700">
                    ⚠️ {importResult.errors} transactions skipped (validation
                    errors)
                  </p>
                )}
              </div>
              <button
                onClick={handleReset}
                className="mt-4 text-sm text-green-700 hover:text-green-800 underline font-medium"
              >
                Import another statement
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Area - Show only if no transactions */}
      {transactions.length === 0 && !importResult && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <BankStatementUploader
            onTransactionsParsed={handleTransactionsParsed}
          />
        </div>
      )}

      {/* Transaction Preview - Show if transactions parsed */}
      {transactions.length > 0 && !importResult && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Review Transactions
            </h3>
            <p className="text-sm text-gray-600">
              Review, edit, or remove transactions before importing. Only
              selected transactions will be imported.
            </p>
          </div>

          <TransactionPreview
            transactions={transactions}
            onTransactionsUpdate={handleTransactionsUpdate}
            onImport={handleImport}
            importing={importing}
          />

          <div className="mt-6 flex justify-between">
            <button
              onClick={handleReset}
              className="px-4 py-2 text-gray-600 hover:text-gray-700 font-medium"
            >
              Cancel
            </button>
            <div className="text-sm text-gray-500">
              Tip: Click on the edit icon to modify transaction details
            </div>
          </div>
        </div>
      )}

      {/* Help Section */}
      {transactions.length === 0 && !importResult && (
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            Supported Banks & Formats
          </h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-slate-700">
            <div>
              <h4 className="font-medium text-slate-900 mb-2">✅ Supported</h4>
              <ul className="space-y-1">
                <li>• CSV files from any Indian bank</li>
                <li>• Must contain: Date, Description, Amount</li>
                <li>• Standard date formats (DD/MM/YYYY, etc.)</li>
                <li>• Currency symbols (₹, $, etc.) handled automatically</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-slate-900 mb-2">
                📋 Common Banks
              </h4>
              <ul className="space-y-1">
                <li>• HDFC Bank, ICICI Bank, SBI</li>
                <li>• Axis Bank, Kotak Mahindra</li>
                <li>• And most other banks with CSV export</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
