// Utility helpers for split expenses
export const computeRemainingAmount = (split) => {
  if (!split) return 0;
  const paid = (split.participants || []).reduce(
    (s, p) => s + (Number(p.paidAmount) || 0),
    0
  );
  return Math.max(0, Number(split.totalAmount || 0) - paid);
};

export default { computeRemainingAmount };
