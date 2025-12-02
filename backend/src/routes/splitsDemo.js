const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");

// In-memory storage for demo
let splits = [
  {
    id: "split_1",
    title: "Dinner with friends",
    totalAmount: 1200,
    createdAt: new Date().toISOString(),
    read: false,
    participants: [
      {
        id: "p1",
        name: "Alex",
        shareAmount: 400,
        paidAmount: 0,
        role: "payer",
        status: "pending",
        paidAt: null,
      },
      {
        id: "p2",
        name: "Sam",
        shareAmount: 400,
        paidAmount: 0,
        role: "participant",
        status: "pending",
        paidAt: null,
      },
      {
        id: "p3",
        name: "Jordan",
        shareAmount: 400,
        paidAmount: 0,
        role: "participant",
        status: "pending",
        paidAt: null,
      },
    ],
  },
  {
    id: "split_2",
    title: "Taxi ride",
    totalAmount: 300,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    read: true,
    participants: [
      {
        id: "p4",
        name: "Priya",
        shareAmount: 150,
        paidAmount: 150,
        role: "payer",
        status: "paid",
        paidAt: new Date().toISOString(),
      },
      {
        id: "p5",
        name: "Ravi",
        shareAmount: 150,
        paidAmount: 0,
        role: "participant",
        status: "pending",
        paidAt: null,
      },
    ],
  },
];

// Helpers
const computeRemainingAmount = (split) => {
  const paid = split.participants.reduce((s, p) => s + (p.paidAmount || 0), 0);
  return Math.max(0, split.totalAmount - paid);
};

// GET /api/splits - list splits. Query: status=open|settled|all, search=name
router.get("/", (req, res) => {
  try {
    const { status = "open", search = "" } = req.query;
    let items = [...splits];

    if (status === "open") {
      items = items.filter((s) => computeRemainingAmount(s) > 0);
    } else if (status === "settled") {
      items = items.filter((s) => computeRemainingAmount(s) === 0);
    }

    if (search) {
      const q = search.toLowerCase();
      items = items.filter(
        (s) =>
          s.participants.some((p) => p.name.toLowerCase().includes(q)) ||
          s.title.toLowerCase().includes(q)
      );
    }

    res.json({ success: true, data: { splits: items } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to list splits" });
  }
});

// POST /api/splits - create new split
router.post("/", (req, res) => {
  try {
    const { title, totalAmount, participants = [] } = req.body;

    if (!title || !totalAmount || participants.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: title, totalAmount, participants",
      });
    }

    const newSplit = {
      id: `split_${uuidv4()}`,
      title,
      totalAmount: parseFloat(totalAmount),
      createdAt: new Date().toISOString(),
      read: false,
      participants: participants.map((p) => ({
        id: p.id || `p_${uuidv4()}`,
        name: p.name,
        shareAmount: parseFloat(p.shareAmount),
        paidAmount: parseFloat(p.paidAmount || 0),
        role: p.role || "participant",
        status: p.status || "pending",
        paidAt: p.paidAt || null,
      })),
    };

    splits.push(newSplit);

    res.status(201).json({
      success: true,
      data: { split: newSplit },
      message: "Split created successfully",
    });
  } catch (err) {
    console.error("Error creating split:", err);
    res.status(500).json({ success: false, message: "Failed to create split" });
  }
});

// GET /api/splits/:id
router.get("/:id", (req, res) => {
  const split = splits.find((s) => s.id === req.params.id);
  if (!split)
    return res.status(404).json({ success: false, message: "Split not found" });
  res.json({ success: true, data: { split } });
});

// PUT /api/splits/:id/pay  body: { participantId, amount? }
router.put("/:id/pay", (req, res) => {
  try {
    const { participantId, amount } = req.body;
    const split = splits.find((s) => s.id === req.params.id);
    if (!split)
      return res
        .status(404)
        .json({ success: false, message: "Split not found" });

    const participant = split.participants.find((p) => p.id === participantId);
    if (!participant)
      return res
        .status(404)
        .json({ success: false, message: "Participant not found" });

    // Default: mark full share as paid
    const payAmount =
      typeof amount === "number"
        ? amount
        : participant.shareAmount - (participant.paidAmount || 0);
    participant.paidAmount = Number((participant.paidAmount || 0) + payAmount);
    participant.paidAmount = Math.min(
      participant.paidAmount,
      participant.shareAmount
    );
    participant.status =
      participant.paidAmount >= participant.shareAmount ? "paid" : "partial";
    participant.paidAt = new Date().toISOString();

    // If all participants have paid their share, mark settled at split level
    const remaining = computeRemainingAmount(split);

    res.json({ success: true, data: { split, remaining } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to mark paid" });
  }
});

// PUT /api/splits/:id/read  body: { read: true/false }
router.put("/:id/read", (req, res) => {
  try {
    const { read } = req.body;
    const split = splits.find((s) => s.id === req.params.id);
    if (!split)
      return res
        .status(404)
        .json({ success: false, message: "Split not found" });

    split.read = !!read;
    res.json({ success: true, data: { split } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to mark read" });
  }
});

module.exports = router;
