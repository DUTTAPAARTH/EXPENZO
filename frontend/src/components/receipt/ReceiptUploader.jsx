import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  Camera,
  X,
  FileText,
  Loader,
  CheckCircle,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import toast from "react-hot-toast";
import Tesseract from "tesseract.js";

const ReceiptUploader = ({ onExtractedData, onClose }) => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [extractedData, setExtractedData] = useState(null);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  // Real OCR using Tesseract.js
  const extractDataFromImage = async (imageFile) => {
    setProcessing(true);
    setError(null);

    try {
      // Use Tesseract.js for OCR
      const result = await Tesseract.recognize(imageFile, "eng", {
        logger: (m) => {
          // Optional: Log progress
          if (m.status === "recognizing text") {
            console.log(`OCR Progress: ${Math.round(m.progress * 100)}%`);
          }
        },
      });

      const text = result.data.text;
      console.log("Extracted text:", text);

      // Parse the extracted text to find key information
      const extractedInfo = parseReceiptText(text);

      setExtractedData(extractedInfo);
      toast.success("Receipt processed successfully!");
    } catch (err) {
      console.error("OCR Error:", err);
      setError("Failed to process receipt. Please try again.");
      toast.error("OCR processing failed");
    } finally {
      setProcessing(false);
    }
  };

  // Parse receipt text to extract merchant, amount, date, etc.
  const parseReceiptText = (text) => {
    const lines = text.split("\n").filter((line) => line.trim());

    // Extract amount (look for currency symbols and numbers)
    let amount = null;
    const amountPatterns = [
      /(?:Rs\.?|₹|INR)\s*(\d+(?:\.\d{2})?)/i,
      /(?:total|amount|paid)[\s:]*(?:Rs\.?|₹|INR)?\s*(\d+(?:\.\d{2})?)/i,
      /(\d+\.\d{2})/,
    ];

    for (const pattern of amountPatterns) {
      const match = text.match(pattern);
      if (match) {
        amount = parseFloat(match[1] || match[0]);
        break;
      }
    }

    // Extract date (look for date patterns)
    let date = new Date().toISOString().split("T")[0];
    const datePatterns = [
      /(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})/,
      /(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})/,
    ];

    for (const pattern of datePatterns) {
      const match = text.match(pattern);
      if (match) {
        // Try to parse the date
        try {
          const dateStr = match[0];
          const parsedDate = new Date(dateStr);
          if (!isNaN(parsedDate.getTime())) {
            date = parsedDate.toISOString().split("T")[0];
            break;
          }
        } catch (e) {
          // Keep default date
        }
      }
    }

    // Extract merchant (usually the first few lines or lines with company indicators)
    let merchant = "Unknown Merchant";
    if (lines.length > 0) {
      // Try to find merchant name (usually in first 3 lines)
      for (let i = 0; i < Math.min(3, lines.length); i++) {
        const line = lines[i].trim();
        if (line.length > 3 && line.length < 50 && !line.match(/^\d+$/)) {
          merchant = line;
          break;
        }
      }
    }

    // Detect category based on merchant keywords
    const category = detectCategory(merchant, text);

    return {
      merchant: merchant,
      amount: amount || 0,
      date: date,
      category: category,
      description: `Receipt from ${merchant}`,
      rawText: text.substring(0, 200), // Store first 200 chars for reference
    };
  };

  // Detect category based on keywords
  const detectCategory = (merchant, text) => {
    const lowerText = (merchant + " " + text).toLowerCase();

    if (
      lowerText.match(/restaurant|cafe|coffee|food|pizza|burger|dining|meal/i)
    ) {
      return "🍽️ Food & Dining";
    }
    if (lowerText.match(/uber|ola|taxi|transport|petrol|fuel|parking/i)) {
      return "🚗 Transportation";
    }
    if (lowerText.match(/grocery|supermarket|walmart|target|store/i)) {
      return "🛒 Groceries";
    }
    if (lowerText.match(/movie|cinema|entertainment|theater|netflix/i)) {
      return "🎬 Entertainment";
    }
    if (lowerText.match(/hospital|clinic|pharmacy|medical|health/i)) {
      return "🏥 Healthcare";
    }
    if (lowerText.match(/amazon|shopping|mall|retail/i)) {
      return "🛍️ Shopping";
    }
    if (lowerText.match(/bill|utility|electricity|water|internet/i)) {
      return "💡 Utilities";
    }

    return "🛍️ Shopping"; // Default category
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload an image file");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        return;
      }

      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect({ target: { files: [file] } });
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleProcess = () => {
    if (image) {
      extractDataFromImage(image);
    }
  };

  const handleUseData = () => {
    if (extractedData) {
      onExtractedData(extractedData);
      onClose();
    }
  };

  const handleReset = () => {
    setImage(null);
    setPreview(null);
    setExtractedData(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-500/10 rounded-lg">
              <Camera className="w-6 h-6 text-primary-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Upload Receipt</h3>
              <p className="text-sm text-slate-400">
                Scan receipt to auto-fill expense details
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-400"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Upload Area */}
          {!preview ? (
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-700 rounded-xl p-12 text-center cursor-pointer hover:border-primary-500/50 hover:bg-slate-800/50 transition-all"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
              <Upload className="w-12 h-12 text-slate-500 mx-auto mb-4" />
              <p className="text-white font-semibold mb-2">
                Drop receipt image here or click to upload
              </p>
              <p className="text-sm text-slate-400">
                Supports JPG, PNG, HEIC (Max 5MB)
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Preview */}
              <div className="relative rounded-xl overflow-hidden border border-slate-800">
                <img
                  src={preview}
                  alt="Receipt preview"
                  className="w-full h-64 object-contain bg-slate-800"
                />
                {!extractedData && !processing && (
                  <button
                    onClick={handleReset}
                    className="absolute top-2 right-2 p-2 bg-slate-900/90 hover:bg-slate-800 rounded-lg transition-colors text-slate-300"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Processing State */}
              {processing && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-center gap-3 p-4 bg-primary-500/10 border border-primary-500/30 rounded-lg"
                >
                  <Loader className="w-5 h-5 text-primary-400 animate-spin" />
                  <span className="text-primary-400 font-medium">
                    Scanning receipt with AI...
                  </span>
                </motion.div>
              )}

              {/* Error State */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-lg"
                >
                  <AlertCircle className="w-5 h-5 text-red-400" />
                  <span className="text-red-400">{error}</span>
                </motion.div>
              )}

              {/* Extracted Data */}
              {extractedData && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <div className="flex items-center gap-2 text-green-400">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-semibold">Data Extracted</span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                    <div>
                      <p className="text-xs text-slate-400 mb-1">Merchant</p>
                      <p className="text-white font-semibold">
                        {extractedData.merchant}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 mb-1">Amount</p>
                      <p className="text-white font-semibold">
                        ₹{extractedData.amount}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 mb-1">Date</p>
                      <p className="text-white font-semibold">
                        {new Date(extractedData.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 mb-1">Category</p>
                      <p className="text-white font-semibold">
                        {extractedData.category}
                      </p>
                    </div>
                  </div>

                  <div className="p-3 bg-primary-500/10 border border-primary-500/30 rounded-lg">
                    <div className="flex items-start gap-2">
                      <Sparkles className="w-4 h-4 text-primary-400 mt-0.5 flex-shrink-0" />
                      <p className="text-xs text-slate-300">
                        <span className="font-semibold text-primary-400">
                          AI Tip:
                        </span>{" "}
                        Data extracted from receipt. You can edit details before
                        creating the expense.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Actions */}
              <div className="flex gap-3">
                {!extractedData && !processing && (
                  <>
                    <button
                      onClick={handleReset}
                      className="flex-1 px-4 py-3 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-lg transition-colors"
                    >
                      Choose Different Image
                    </button>
                    <button
                      onClick={handleProcess}
                      className="flex-1 px-4 py-3 bg-primary-500 hover:bg-primary-600 text-black font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      <Sparkles className="w-4 h-4" />
                      Scan Receipt
                    </button>
                  </>
                )}

                {extractedData && (
                  <>
                    <button
                      onClick={handleReset}
                      className="flex-1 px-4 py-3 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-lg transition-colors"
                    >
                      Try Another
                    </button>
                    <button
                      onClick={handleUseData}
                      className="flex-1 px-4 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      <FileText className="w-4 h-4" />
                      Use This Data
                    </button>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Info */}
          <div className="p-4 bg-slate-800/30 rounded-lg border border-slate-800">
            <p className="text-xs text-slate-400 leading-relaxed">
              <span className="font-semibold text-slate-300">💡 Tips:</span> For
              best results, ensure the receipt is well-lit, in focus, and the
              text is clearly visible. Currently using demo OCR - in production,
              this would use Tesseract.js or a cloud OCR API.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ReceiptUploader;
