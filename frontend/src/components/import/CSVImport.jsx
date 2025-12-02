import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Upload,
  X,
  Check,
  AlertCircle,
  Download,
  FileText,
} from "lucide-react";
import * as XLSX from "xlsx";
import toast from "react-hot-toast";

const CSVImport = ({ onImport, onClose }) => {
  const [file, setFile] = useState(null);
  const [parsedData, setParsedData] = useState([]);
  const [mappings, setMappings] = useState({
    date: "",
    description: "",
    amount: "",
    category: "",
  });
  const [recurringDetected, setRecurringDetected] = useState([]);
  const [step, setStep] = useState(1); // 1: upload, 2: map columns, 3: review

  const handleFileUpload = (e) => {
    const uploadedFile = e.target.files[0];
    if (!uploadedFile) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const data = evt.target.result;
        const workbook = XLSX.read(data, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet);

        setParsedData(jsonData);
        setFile(uploadedFile);
        setStep(2);

        // Auto-detect common column names
        if (jsonData.length > 0) {
          const columns = Object.keys(jsonData[0]);
          const autoMappings = {
            date: columns.find((c) => /date/i.test(c)) || "",
            description:
              columns.find((c) => /desc|name|payee|vendor/i.test(c)) || "",
            amount: columns.find((c) => /amount|value|price/i.test(c)) || "",
            category: columns.find((c) => /category|type/i.test(c)) || "",
          };
          setMappings(autoMappings);
        }

        toast.success(`Loaded ${jsonData.length} transactions`);
      } catch (error) {
        toast.error("Failed to parse file");
        console.error(error);
      }
    };
    reader.readAsBinaryString(uploadedFile);
  };

  const detectRecurring = () => {
    const transactions = parsedData.map((row) => ({
      date: row[mappings.date],
      description: row[mappings.description],
      amount: parseFloat(row[mappings.amount]),
    }));

    // Group by description and amount
    const groups = {};
    transactions.forEach((t) => {
      const key = `${t.description}-${t.amount}`;
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(t);
    });

    // Find patterns (3+ occurrences)
    const recurring = [];
    Object.entries(groups).forEach(([key, items]) => {
      if (items.length >= 3) {
        // Calculate average days between occurrences
        const dates = items.map((i) => new Date(i.date)).sort((a, b) => a - b);

        const intervals = [];
        for (let i = 1; i < dates.length; i++) {
          const days = Math.round(
            (dates[i] - dates[i - 1]) / (1000 * 60 * 60 * 24)
          );
          intervals.push(days);
        }

        const avgInterval = Math.round(
          intervals.reduce((a, b) => a + b, 0) / intervals.length
        );

        let period = "monthly";
        if (avgInterval <= 10) period = "weekly";
        else if (avgInterval >= 350) period = "yearly";

        recurring.push({
          description: items[0].description,
          amount: items[0].amount,
          occurrences: items.length,
          period,
          avgInterval,
        });
      }
    });

    setRecurringDetected(recurring);
    return recurring;
  };

  const handleNext = () => {
    if (step === 2) {
      // Validate mappings
      if (!mappings.date || !mappings.description || !mappings.amount) {
        toast.error("Please map all required fields");
        return;
      }
      detectRecurring();
      setStep(3);
    }
  };

  const handleImport = () => {
    const expenses = parsedData.map((row) => ({
      date: row[mappings.date],
      description: row[mappings.description],
      amount: parseFloat(row[mappings.amount]),
      category: row[mappings.category] || "📦 Others",
      paymentMethod: "Cash",
    }));

    onImport(expenses, recurringDetected);
  };

  const downloadTemplate = () => {
    const template = [
      {
        Date: "2024-01-01",
        Description: "Grocery Shopping",
        Amount: 2500,
        Category: "🍔 Food & Dining",
      },
      {
        Date: "2024-01-02",
        Description: "Uber Ride",
        Amount: 250,
        Category: "🚗 Transportation",
      },
    ];

    const ws = XLSX.utils.json_to_sheet(template);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Expenses");
    XLSX.writeFile(wb, "expenzo_template.xlsx");
    toast.success("Template downloaded!");
  };

  const columns = parsedData.length > 0 ? Object.keys(parsedData[0]) : [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-slate-900 border border-slate-800 rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800 sticky top-0 bg-slate-900 z-10">
          <div>
            <h2 className="text-2xl font-bold text-white">Import Expenses</h2>
            <p className="text-sm text-slate-400 mt-1">
              Step {step} of 3:{" "}
              {step === 1 ? "Upload" : step === 2 ? "Map Columns" : "Review"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-800 rounded-lg"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <div className="p-6">
          {/* Step 1: Upload */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center">
                <button
                  onClick={downloadTemplate}
                  className="inline-flex items-center gap-2 text-sm text-primary-400 hover:text-primary-300 mb-4"
                >
                  <Download className="w-4 h-4" />
                  Download Template
                </button>
              </div>

              <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-slate-700 rounded-xl cursor-pointer hover:border-primary-500 transition-colors group">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-12 h-12 text-slate-600 group-hover:text-primary-500 mb-4" />
                  <p className="mb-2 text-sm text-slate-400">
                    <span className="font-semibold">Click to upload</span> or
                    drag and drop
                  </p>
                  <p className="text-xs text-slate-500">
                    CSV, XLSX (MAX. 10MB)
                  </p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept=".csv,.xlsx,.xls"
                  onChange={handleFileUpload}
                />
              </label>

              {file && (
                <div className="flex items-center gap-3 p-4 bg-slate-800 rounded-lg">
                  <FileText className="w-5 h-5 text-primary-400" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-white">
                      {file.name}
                    </p>
                    <p className="text-xs text-slate-400">
                      {parsedData.length} transactions found
                    </p>
                  </div>
                  <Check className="w-5 h-5 text-green-400" />
                </div>
              )}
            </div>
          )}

          {/* Step 2: Map Columns */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
                <p className="text-sm text-slate-300 mb-3">
                  Map your CSV columns to Expenzo fields:
                </p>

                {Object.keys(mappings).map((field) => (
                  <div key={field} className="mb-4 last:mb-0">
                    <label className="block text-sm font-semibold text-slate-300 mb-2 capitalize">
                      {field} {field !== "category" && "*"}
                    </label>
                    <select
                      value={mappings[field]}
                      onChange={(e) =>
                        setMappings({ ...mappings, [field]: e.target.value })
                      }
                      className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
                    >
                      <option value="">-- Select Column --</option>
                      {columns.map((col) => (
                        <option key={col} value={col}>
                          {col}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>

              {/* Preview */}
              <div>
                <h4 className="text-sm font-semibold text-slate-300 mb-3">
                  Preview (first 3 rows):
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-800">
                        <th className="text-left py-2 px-3 text-slate-400">
                          Date
                        </th>
                        <th className="text-left py-2 px-3 text-slate-400">
                          Description
                        </th>
                        <th className="text-right py-2 px-3 text-slate-400">
                          Amount
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {parsedData.slice(0, 3).map((row, i) => (
                        <tr key={i} className="border-b border-slate-800">
                          <td className="py-2 px-3 text-slate-300">
                            {row[mappings.date]}
                          </td>
                          <td className="py-2 px-3 text-slate-300">
                            {row[mappings.description]}
                          </td>
                          <td className="py-2 px-3 text-right text-slate-300">
                            {row[mappings.amount]}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <button
                onClick={handleNext}
                className="w-full py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-semibold rounded-lg"
              >
                Next: Review
              </button>
            </div>
          )}

          {/* Step 3: Review & Recurring Detection */}
          {step === 3 && (
            <div className="space-y-6">
              {recurringDetected.length > 0 && (
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-blue-400 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-blue-400 mb-2">
                        🔁 Recurring Transactions Detected
                      </h4>
                      <p className="text-sm text-slate-300 mb-3">
                        We found {recurringDetected.length} potential recurring
                        transactions:
                      </p>
                      <div className="space-y-2">
                        {recurringDetected.map((item, i) => (
                          <div
                            key={i}
                            className="bg-slate-800 rounded p-3 text-xs"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-semibold text-white">
                                {item.description}
                              </span>
                              <span className="text-slate-400">
                                ₹{item.amount}
                              </span>
                            </div>
                            <p className="text-slate-400 mt-1">
                              {item.occurrences} occurrences • Appears{" "}
                              {item.period} (~{item.avgInterval} days)
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <h4 className="text-sm font-semibold text-slate-300 mb-3">
                  Ready to import {parsedData.length} transactions
                </h4>
                <button
                  onClick={handleImport}
                  className="w-full py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white font-semibold rounded-lg"
                >
                  Import All Expenses
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default CSVImport;
