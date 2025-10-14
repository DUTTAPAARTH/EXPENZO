const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [50, "Name must be less than 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false, // Don't include password in queries by default
    },
    avatar: {
      type: String,
      default: "👤", // Default emoji avatar
    },
    monthlyBudget: {
      type: Number,
      default: 0,
      min: [0, "Budget cannot be negative"],
    },
    spendingGoal: {
      type: Number,
      default: 0,
      min: [0, "Spending goal cannot be negative"],
    },
    currency: {
      type: String,
      default: "INR",
      enum: ["INR", "USD", "EUR", "GBP", "CAD", "AUD"],
    },
    preferences: {
      theme: {
        type: String,
        default: "light",
        enum: ["light", "dark"],
      },
      notifications: {
        type: Boolean,
        default: true,
      },
      autoCategorizaion: {
        type: Boolean,
        default: true,
      },
    },
    lastLogin: {
      type: Date,
      default: Date.now,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified("password")) return next();

  try {
    // Hash password with cost of 12
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error(error);
  }
};

// Get user without sensitive data
userSchema.methods.toJSON = function () {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

// Update last login
userSchema.methods.updateLastLogin = function () {
  this.lastLogin = new Date();
  return this.save();
};

// Virtual for full name display
userSchema.virtual("displayName").get(function () {
  return `${this.avatar} ${this.name}`;
});

// Index for better performance
userSchema.index({ createdAt: -1 });

module.exports = mongoose.model("User", userSchema);
