import React, { useState, useRef } from "react";
import { Upload, FileText, AlertCircle, CheckCircle, Info } from "lucide-react";
import {
  parseBankStatement,
  isValidCSV,
  getSampleCSVFormat,
} from "../../utils/bankStatementParser";

export default function BankStatementUploader({ onTransactionsParsed }) {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState(null);
  const [parsing, setParsing] = useState(false);
  const [error, setError] = useState("");
  const [showSample, setShowSample] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files[0];
    handleFileSelection(droppedFile);
  };

  const handleFileSelection = async (selectedFile) => {
    if (!selectedFile) return;

    setError("");

    // Validate file type
    if (!isValidCSV(selectedFile)) {
      setError("Please upload a valid CSV file");
      return;
    }

    // Validate file size (max 5MB)
    if (selectedFile.size > 5 * 1024 * 1024) {
      setError("File size must be less than 5MB");
      return;
    }

    setFile(selectedFile);
    setParsing(true);

    try {
      // Read file content
      const text = await selectedFile.text();

      // Parse CSV
      const result = parseBankStatement(text);

      if (!result.success) {
        setError(result.error);
        setParsing(false);
        return;
      }

      if (result.transactions.length === 0) {
        setError("No valid transactions found in the CSV file");
        setParsing(false);
        return;
      }

      // Success - pass transactions to parent
      onTransactionsParsed(result);
      setParsing(false);
    } catch (err) {
      setError(
        "Failed to read or parse the CSV file. Please check the format."
      );
      setParsing(false);
    }
  };

  const handleFileInputChange = (e) => {
    const selectedFile = e.target.files[0];
    handleFileSelection(selectedFile);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const resetUpload = () => {
    setFile(null);
    setError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-4">
      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-900">
            <p className="font-medium mb-1">
              How to import your bank statement:
            </p>
            <ol className="list-decimal list-inside space-y-1 text-blue-800">
              <li>Download your bank statement in CSV format</li>
              <li>Upload the CSV file below</li>
              <li>Review and edit the detected transactions</li>
              <li>Click "Import Selected" to add expenses</li>
            </ol>
            <button
              onClick={() => setShowSample(!showSample)}
              className="text-blue-600 hover:text-blue-700 underline mt-2 text-xs"
            >
              {showSample ? "Hide" : "Show"} sample CSV format
            </button>
          </div>
        </div>
      </div>

      {/* Sample CSV Format */}
      {showSample && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <p className="text-sm font-medium text-gray-700 mb-2">
            Sample CSV Format:
          </p>
          <pre className="text-xs bg-white p-3 rounded border border-gray-200 overflow-x-auto">
            {getSampleCSVFormat()}
          </pre>
          <p className="text-xs text-gray-600 mt-2">
            ℹ️ Your CSV should have columns like: Date, Description, Amount,
            Type (optional)
          </p>
        </div>
      )}

      {/* Upload Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
          transition-all duration-200
          ${
            isDragging
              ? "border-indigo-500 bg-indigo-50"
              : "border-gray-300 hover:border-indigo-400 hover:bg-gray-50"
          }
          ${file ? "bg-green-50 border-green-300" : ""}
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,text/csv,application/vnd.ms-excel"
          onChange={handleFileInputChange}
          className="hidden"
        />

        {!file && !parsing && (
          <div className="flex flex-col items-center gap-3">
            <Upload className="w-12 h-12 text-gray-400" />
            <div>
              <p className="text-lg font-medium text-gray-700">
                Drop your CSV file here
              </p>
              <p className="text-sm text-gray-500 mt-1">or click to browse</p>
            </div>
            <p className="text-xs text-gray-400">
              Supports CSV format (max 5MB)
            </p>
          </div>
        )}

        {parsing && (
          <div className="flex flex-col items-center gap-3">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            <p className="text-lg font-medium text-gray-700">
              Parsing your bank statement...
            </p>
          </div>
        )}

        {file && !parsing && !error && (
          <div className="flex flex-col items-center gap-3">
            <CheckCircle className="w-12 h-12 text-green-600" />
            <div>
              <p className="text-lg font-medium text-gray-700 flex items-center gap-2 justify-center">
                <FileText className="w-5 h-5" />
                {file.name}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {(file.size / 1024).toFixed(1)} KB
              </p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                resetUpload();
              }}
              className="text-sm text-indigo-600 hover:text-indigo-700 underline"
            >
              Upload different file
            </button>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-red-900">Error</p>
              <p className="text-sm text-red-700 mt-1">{error}</p>
              <button
                onClick={resetUpload}
                className="text-sm text-red-600 hover:text-red-700 underline mt-2"
              >
                Try again
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
