const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: [0.01, "Amount must be greater than 0"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: [
        "Food & Dining",
        "Transportation",
        "Shopping",
        "Entertainment",
        "Bills & Utilities",
        "Healthcare",
        "Education",
        "Travel",
        "Groceries",
        "Fuel",
        "Coffee & Tea",
        "Online Services",
        "Gifts & Donations",
        "Fitness",
        "Beauty & Personal Care",
        "Home & Garden",
        "Insurance",
        "Investments",
        "Other",
      ],
    },
    subcategory: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: [200, "Description must be less than 200 characters"],
    },
    paymentMethod: {
      type: String,
      required: [true, "Payment method is required"],
      enum: [
        "Cash",
        "Credit Card",
        "Debit Card",
        "UPI",
        "Net Banking",
        "Wallet",
        "Other",
      ],
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    location: {
      name: String,
      address: String,
      coordinates: {
        latitude: Number,
        longitude: Number,
      },
    },
    receipt: {
      url: String,
      filename: String,
    },
    isRecurring: {
      type: Boolean,
      default: false,
    },
    recurringDetails: {
      frequency: {
        type: String,
        enum: ["daily", "weekly", "monthly", "yearly"],
        required: function () {
          return this.isRecurring;
        },
      },
      nextDate: Date,
      endDate: Date,
    },
    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
      default: null,
    },
    splitDetails: {
      totalParticipants: {
        type: Number,
        default: 1,
      },
      splitType: {
        type: String,
        enum: ["equal", "custom", "percentage"],
        default: "equal",
      },
      participants: [
        {
          user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
          },
          amount: Number,
          paid: {
            type: Boolean,
            default: false,
          },
        },
      ],
    },
    source: {
      type: String,
      enum: ["manual", "sms", "email", "api", "receipt_scan"],
      default: "manual",
    },
    confidence: {
      type: Number,
      min: 0,
      max: 1,
      default: 1, // 1 = manual entry, < 1 = AI detected
    },
    date: {
      type: Date,
      required: [true, "Date is required"],
      default: Date.now,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Virtual for formatted amount
expenseSchema.virtual("formattedAmount").get(function () {
  return `₹${this.amount.toFixed(2)}`;
});

// Virtual for category emoji
expenseSchema.virtual("categoryEmoji").get(function () {
  const emojiMap = {
    "Food & Dining": "🍽️",
    Transportation: "🚗",
    Shopping: "🛍️",
    Entertainment: "🎬",
    "Bills & Utilities": "📱",
    Healthcare: "🏥",
    Education: "📚",
    Travel: "✈️",
    Groceries: "🛒",
    Fuel: "⛽",
    "Coffee & Tea": "☕",
    "Online Services": "💻",
    "Gifts & Donations": "🎁",
    Fitness: "💪",
    "Beauty & Personal Care": "💄",
    "Home & Garden": "🏠",
    Insurance: "🛡️",
    Investments: "📈",
    Other: "💸",
  };
  return emojiMap[this.category] || "💸";
});

// Method to check if expense is recent (within 24 hours)
expenseSchema.methods.isRecent = function () {
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  return this.createdAt > oneDayAgo;
};

// Static method to get expenses by date range
expenseSchema.statics.getByDateRange = function (userId, startDate, endDate) {
  return this.find({
    user: userId,
    date: {
      $gte: startDate,
      $lte: endDate,
    },
    isDeleted: false,
  }).sort({ date: -1 });
};

// Static method to get category-wise totals
expenseSchema.statics.getCategoryTotals = function (
  userId,
  startDate,
  endDate
) {
  return this.aggregate([
    {
      $match: {
        user: mongoose.Types.ObjectId(userId),
        date: { $gte: startDate, $lte: endDate },
        isDeleted: false,
      },
    },
    {
      $group: {
        _id: "$category",
        total: { $sum: "$amount" },
        count: { $sum: 1 },
        avgAmount: { $avg: "$amount" },
      },
    },
    {
      $sort: { total: -1 },
    },
  ]);
};

// Pre-save middleware
expenseSchema.pre("save", function (next) {
  // Auto-assign subcategory based on description
  if (!this.subcategory && this.description) {
    const desc = this.description.toLowerCase();
    if (this.category === "Food & Dining") {
      if (desc.includes("restaurant") || desc.includes("hotel")) {
        this.subcategory = "Restaurants";
      } else if (
        desc.includes("coffee") ||
        desc.includes("chai") ||
        desc.includes("tea")
      ) {
        this.subcategory = "Coffee & Tea";
      } else if (
        desc.includes("fast food") ||
        desc.includes("burger") ||
        desc.includes("pizza")
      ) {
        this.subcategory = "Fast Food";
      }
    }
  }
  next();
});

// Indexes for better performance
expenseSchema.index({ user: 1, date: -1 });
expenseSchema.index({ user: 1, category: 1 });
expenseSchema.index({ user: 1, createdAt: -1 });
expenseSchema.index({ date: -1 });
expenseSchema.index({ group: 1 });

module.exports = mongoose.model("Expense", expenseSchema);
