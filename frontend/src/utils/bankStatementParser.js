/**
 * Bank Statement CSV Parser
 * Supports common bank CSV formats and auto-detects columns
 */

/**
 * Parses CSV text into array of rows
 */
function parseCSV(csvText) {
  const lines = csvText.split("\n").filter((line) => line.trim());
  const rows = lines.map((line) => {
    // Handle quoted fields with commas
    const fields = [];
    let currentField = "";
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];

      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === "," && !inQuotes) {
        fields.push(currentField.trim());
        currentField = "";
      } else {
        currentField += char;
      }
    }
    fields.push(currentField.trim());

    return fields;
  });

  return rows;
}

/**
 * Detects column indices from header row
 */
function detectColumns(headers) {
  const normalized = headers.map((h) =>
    h.toLowerCase().replace(/[^a-z0-9]/g, "")
  );

  const columnMap = {
    date: -1,
    description: -1,
    amount: -1,
    type: -1,
    balance: -1,
  };

  normalized.forEach((header, index) => {
    // Date column
    if (
      header.includes("date") ||
      header.includes("transactiondate") ||
      header.includes("valuedate")
    ) {
      columnMap.date = index;
    }
    // Description column
    else if (
      header.includes("description") ||
      header.includes("narration") ||
      header.includes("particulars") ||
      header.includes("details")
    ) {
      columnMap.description = index;
    }
    // Amount column (withdrawal/debit)
    else if (
      header.includes("withdrawal") ||
      header.includes("debit") ||
      header.includes("paid")
    ) {
      if (columnMap.amount === -1) columnMap.amount = index;
    }
    // Amount column (deposit/credit) - secondary
    else if (
      header.includes("deposit") ||
      header.includes("credit") ||
      header.includes("received")
    ) {
      if (columnMap.amount === -1) columnMap.amount = index;
    }
    // Amount column (generic)
    else if (header.includes("amount") && columnMap.amount === -1) {
      columnMap.amount = index;
    }
    // Type column
    else if (header.includes("type") || header.includes("transactiontype")) {
      columnMap.type = index;
    }
    // Balance column
    else if (header.includes("balance") || header.includes("closingbalance")) {
      columnMap.balance = index;
    }
  });

  return columnMap;
}

/**
 * Parses a date string to ISO format
 */
function parseDate(dateStr) {
  if (!dateStr) return null;

  // Try different date formats
  const formats = [
    // DD/MM/YYYY
    /^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/,
    // DD-MMM-YYYY (e.g., 15-Jan-2024)
    /^(\d{1,2})-([A-Za-z]{3})-(\d{4})$/,
    // YYYY-MM-DD
    /^(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})$/,
  ];

  const monthMap = {
    jan: 1,
    feb: 2,
    mar: 3,
    apr: 4,
    may: 5,
    jun: 6,
    jul: 7,
    aug: 8,
    sep: 9,
    oct: 10,
    nov: 11,
    dec: 12,
  };

  for (const format of formats) {
    const match = dateStr.match(format);
    if (match) {
      let day, month, year;

      if (format === formats[0]) {
        // DD/MM/YYYY
        [, day, month, year] = match;
      } else if (format === formats[1]) {
        // DD-MMM-YYYY
        [, day, month, year] = match;
        month = monthMap[month.toLowerCase()];
      } else if (format === formats[2]) {
        // YYYY-MM-DD
        [, year, month, day] = match;
      }

      const date = new Date(year, month - 1, day);
      if (!isNaN(date.getTime())) {
        return date.toISOString().split("T")[0];
      }
    }
  }

  return null;
}

/**
 * Parses amount string to number
 */
function parseAmount(amountStr) {
  if (!amountStr) return 0;

  // Remove currency symbols, commas, spaces
  const cleaned = amountStr.replace(/[₹$€£,\s]/g, "");

  // Handle negative amounts in brackets (1,234.56) or with minus sign
  const isNegative = cleaned.includes("(") || cleaned.startsWith("-");
  const number = parseFloat(cleaned.replace(/[()]/g, "").replace(/-/g, ""));

  return isNaN(number) ? 0 : isNegative ? -number : number;
}

/**
 * Detects category from transaction description
 */
function detectCategory(description) {
  const desc = description.toLowerCase();

  const categoryKeywords = {
    "Food & Dining": [
      "restaurant",
      "cafe",
      "food",
      "swiggy",
      "zomato",
      "dominos",
      "pizza",
      "mcdonalds",
      "burger",
      "starbucks",
    ],
    Transportation: [
      "uber",
      "ola",
      "rapido",
      "petrol",
      "fuel",
      "gas",
      "metro",
      "taxi",
      "parking",
    ],
    Shopping: [
      "amazon",
      "flipkart",
      "myntra",
      "ajio",
      "mall",
      "store",
      "shopping",
      "nike",
      "adidas",
    ],
    Entertainment: [
      "netflix",
      "prime",
      "spotify",
      "movie",
      "cinema",
      "theatre",
      "hotstar",
      "disney",
    ],
    "Bills & Utilities": [
      "electricity",
      "water",
      "gas",
      "internet",
      "broadband",
      "phone",
      "mobile",
      "recharge",
      "bill",
    ],
    Healthcare: [
      "hospital",
      "clinic",
      "pharmacy",
      "medicine",
      "doctor",
      "medical",
      "apollo",
      "practo",
    ],
    Groceries: [
      "grocery",
      "supermarket",
      "bigbasket",
      "blinkit",
      "zepto",
      "dunzo",
      "vegetables",
      "milk",
    ],
    Transfer: ["transfer", "upi", "imps", "neft", "rtgs"],
    ATM: ["atm", "withdrawal", "cash"],
    Salary: ["salary", "wages", "payroll", "income"],
  };

  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    if (keywords.some((keyword) => desc.includes(keyword))) {
      return category;
    }
  }

  return "Others";
}

/**
 * Main function to parse bank statement CSV
 */
export function parseBankStatement(csvText) {
  try {
    const rows = parseCSV(csvText);

    if (rows.length < 2) {
      throw new Error(
        "CSV file must contain at least a header row and one data row"
      );
    }

    const headers = rows[0];
    const columns = detectColumns(headers);

    // Validate required columns
    if (
      columns.date === -1 ||
      columns.description === -1 ||
      columns.amount === -1
    ) {
      throw new Error(
        "Could not detect required columns (Date, Description, Amount). Please check your CSV format."
      );
    }

    const transactions = [];

    // Parse data rows (skip header)
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];

      // Skip empty rows
      if (row.every((cell) => !cell.trim())) continue;

      const date = parseDate(row[columns.date]);
      const description =
        row[columns.description]?.trim() || "Unknown Transaction";
      const amount = Math.abs(parseAmount(row[columns.amount])); // Always positive

      // Skip zero amount transactions
      if (amount === 0) continue;

      // Detect if it's income or expense
      const type =
        columns.type !== -1
          ? row[columns.type]?.toLowerCase().includes("credit") ||
            row[columns.type]?.toLowerCase().includes("deposit")
            ? "income"
            : "expense"
          : parseAmount(row[columns.amount]) > 0
          ? "income"
          : "expense";

      const category = detectCategory(description);

      transactions.push({
        id: `temp_${Date.now()}_${i}`, // Temporary ID
        date: date || new Date().toISOString().split("T")[0],
        description,
        amount,
        category,
        type,
        selected: true, // Selected by default for import
        originalRow: row,
      });
    }

    return {
      success: true,
      transactions,
      summary: {
        total: transactions.length,
        totalAmount: transactions.reduce(
          (sum, t) => sum + (t.type === "expense" ? t.amount : 0),
          0
        ),
        totalIncome: transactions.reduce(
          (sum, t) => sum + (t.type === "income" ? t.amount : 0),
          0
        ),
        categories: [...new Set(transactions.map((t) => t.category))],
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      transactions: [],
    };
  }
}

/**
 * Sample CSV format generator (for help/documentation)
 */
export function getSampleCSVFormat() {
  return `Date,Description,Amount,Type
01/12/2024,Swiggy Food Order,-450,Debit
02/12/2024,Amazon Shopping,-1200,Debit
03/12/2024,Salary Credit,50000,Credit
04/12/2024,Netflix Subscription,-799,Debit
05/12/2024,Uber Ride,-250,Debit`;
}

/**
 * Validates if a file is a valid CSV
 */
export function isValidCSV(file) {
  if (!file) return false;

  const validTypes = ["text/csv", "application/vnd.ms-excel", "text/plain"];
  const validExtensions = [".csv"];

  const hasValidType = validTypes.includes(file.type) || file.type === "";
  const hasValidExtension = validExtensions.some((ext) =>
    file.name.toLowerCase().endsWith(ext)
  );

  return hasValidType || hasValidExtension;
}
