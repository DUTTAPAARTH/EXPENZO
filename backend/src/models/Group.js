const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Group name is required"],
      trim: true,
      maxlength: [50, "Group name must be less than 50 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [200, "Description must be less than 200 characters"],
    },
    emoji: {
      type: String,
      default: "👥",
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Group owner is required"],
    },
    members: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        email: String,
        joinedAt: {
          type: Date,
          default: Date.now,
        },
        role: {
          type: String,
          enum: ["admin", "member"],
          default: "member",
        },
        isActive: {
          type: Boolean,
          default: true,
        },
      },
    ],
    expenses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Expense",
      },
    ],
    settings: {
      defaultSplitType: {
        type: String,
        enum: ["equal", "custom", "percentage"],
        default: "equal",
      },
      currency: {
        type: String,
        default: "INR",
      },
      autoReminders: {
        type: Boolean,
        default: true,
      },
    },
    totalExpenses: {
      type: Number,
      default: 0,
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

// Virtual for member count
groupSchema.virtual("memberCount").get(function () {
  return this.members.filter((member) => member.isActive).length;
});

// Virtual for total expenses formatted
groupSchema.virtual("formattedTotal").get(function () {
  return `₹${this.totalExpenses.toFixed(2)}`;
});

// Method to add member to group
groupSchema.methods.addMember = function (
  userId,
  name,
  email,
  role = "member"
) {
  // Check if user is already a member
  const existingMember = this.members.find(
    (member) => member.user.toString() === userId.toString()
  );

  if (existingMember) {
    if (!existingMember.isActive) {
      existingMember.isActive = true;
      existingMember.joinedAt = new Date();
    }
    return this.save();
  }

  this.members.push({
    user: userId,
    name: name,
    email: email,
    role: role,
  });

  return this.save();
};

// Method to remove member from group
groupSchema.methods.removeMember = function (userId) {
  const memberIndex = this.members.findIndex(
    (member) => member.user.toString() === userId.toString()
  );

  if (memberIndex !== -1) {
    this.members[memberIndex].isActive = false;
  }

  return this.save();
};

// Method to calculate settlements for the group
groupSchema.methods.calculateSettlements = function () {
  return mongoose.model("Expense").aggregate([
    {
      $match: {
        group: this._id,
        isDeleted: false,
      },
    },
    {
      $unwind: "$splitDetails.participants",
    },
    {
      $group: {
        _id: "$splitDetails.participants.user",
        totalOwed: {
          $sum: {
            $cond: [
              { $eq: ["$splitDetails.participants.paid", false] },
              "$splitDetails.participants.amount",
              0,
            ],
          },
        },
        totalPaid: {
          $sum: {
            $cond: [
              { $eq: ["$user", "$splitDetails.participants.user"] },
              "$amount",
              0,
            ],
          },
        },
      },
    },
    {
      $addFields: {
        balance: { $subtract: ["$totalPaid", "$totalOwed"] },
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "userInfo",
      },
    },
    {
      $unwind: "$userInfo",
    },
    {
      $project: {
        name: "$userInfo.name",
        avatar: "$userInfo.avatar",
        totalOwed: 1,
        totalPaid: 1,
        balance: 1,
      },
    },
    {
      $sort: { balance: -1 },
    },
  ]);
};

// Static method to get user's groups
groupSchema.statics.getUserGroups = function (userId) {
  return this.find({
    $or: [
      { owner: userId },
      { "members.user": userId, "members.isActive": true },
    ],
    isActive: true,
  })
    .populate("owner", "name avatar")
    .populate("members.user", "name avatar")
    .sort({ updatedAt: -1 });
};

// Pre-save middleware to ensure owner is in members
groupSchema.pre("save", function (next) {
  // Add owner to members if not already present
  const ownerInMembers = this.members.find(
    (member) => member.user && member.user.toString() === this.owner.toString()
  );

  if (!ownerInMembers) {
    this.members.unshift({
      user: this.owner,
      name: "Owner", // This will be updated when populated
      role: "admin",
      joinedAt: this.createdAt || new Date(),
    });
  }

  next();
});

// Indexes for better performance
groupSchema.index({ owner: 1 });
groupSchema.index({ "members.user": 1 });
groupSchema.index({ createdAt: -1 });
groupSchema.index({ isActive: 1 });

module.exports = mongoose.model("Group", groupSchema);
