# 🚀 Quick Start: Bank Statement Import

## Step-by-Step Guide

### 1️⃣ Navigate to Expenses Page

- Open your browser: http://localhost:5173
- Go to "Expenses" from the sidebar

### 2️⃣ Click "Import Statement"

- Look for the **gradient purple button** labeled "Import Statement"
- It's located in the top right area, next to "Add Expense"

### 3️⃣ Upload Your CSV

Two ways to upload:

- **Drag & Drop**: Drag your CSV file onto the upload area
- **Click to Browse**: Click the upload area to select file

### 4️⃣ Review Transactions

After upload, you'll see a table with:

- ✅ Checkboxes to select/deselect transactions
- 📝 Edit button to modify details
- ❌ Delete button to remove unwanted rows
- 🏷️ Auto-detected categories
- 💰 Parsed amounts

### 5️⃣ Make Edits (Optional)

Click the **Edit icon** (pencil) to:

- Change description
- Modify amount
- Select different category
- Change date
- Switch between expense/income

### 6️⃣ Import Selected

- Click **"Import X Selected"** button at top
- Wait for success message
- Modal closes automatically
- Your expenses appear in the list!

---

## 📄 Sample CSV File

**Location**: `C:\Users\PAARTH DUTTA\Downloads\EXPENZO\sample_bank_statement.csv`

This file contains 20 sample transactions from December 2024, including:

- Food orders (Swiggy, Zomato, Dominos, Starbucks)
- Shopping (Amazon, Myntra)
- Transport (Uber, Ola, Petrol)
- Subscriptions (Netflix, Prime, Spotify)
- Bills (Electricity, Internet)
- Healthcare (Apollo Pharmacy)
- Groceries (Big Basket)

---

## 🎯 What to Expect

### Auto-categorization:

- "Swiggy Food Order" → Food & Dining 🍔
- "Uber Ride" → Transportation 🚗
- "Amazon Shopping" → Shopping 🛍️
- "Netflix Subscription" → Entertainment 🎬
- "Electricity Bill" → Bills & Utilities 💡
- "Apollo Pharmacy" → Healthcare 💪
- "Big Basket" → Groceries 🥬

### Transaction Counts:

- **20 total transactions** in sample file
- **18 will be imported** (expenses only)
- **2 will be skipped** (income: Salary, Freelance)

### Amount Parsing:

- ₹450.00 → 450.00
- -₹2,150.50 → 2150.50 (absolute value)
- (1,234.56) → 1234.56 (brackets = negative)

---

## 💡 Pro Tips

1. **Select All/Deselect All**: Use the button at top to toggle all checkboxes
2. **Category Detection**: Works best with well-known merchant names
3. **Manual Editing**: Always review and edit before importing
4. **Income Skipped**: Income transactions are automatically filtered out
5. **Bulk Import**: No limit on number of transactions (within 5MB file size)
6. **Try Again**: Upload failed? Check CSV format and try with sample file first

---

## 🔍 Troubleshooting

### "Could not detect required columns"

- Ensure CSV has headers: Date, Description, Amount
- Check for typos in column names
- Make sure first row is header, not data

### "No valid transactions found"

- Check if all amounts are zero
- Ensure date format is recognized (DD/MM/YYYY works best)
- Try sample file first to verify system is working

### "File size must be less than 5MB"

- Your CSV is too large
- Split into multiple files
- Remove unnecessary columns (keep Date, Description, Amount, Type)

---

## ✅ Success Indicators

You'll know it worked when:

1. ✅ Green success toast appears
2. ✅ "X expenses imported successfully!" message
3. ✅ Modal shows import results
4. ✅ Expenses appear in your expense list
5. ✅ Categories are correctly assigned

---

## 🎉 Ready to Go!

**Servers Running:**

- Backend: http://localhost:5000 ✅
- Frontend: http://localhost:5173 ✅

**Test Now:**

1. Open http://localhost:5173
2. Go to Expenses
3. Click "Import Statement"
4. Upload `sample_bank_statement.csv`
5. Watch the magic happen! ✨

---

**Enjoy your new bulk import feature! 🚀**
