import React from "react";
import SmartSplitTab from "../components/splits/SmartSplitTab";

const SplitsPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Split Expenses</h1>
        <p className="text-slate-400">
          Manage shared expenses and track who owes what.
        </p>
      </div>

      <SmartSplitTab />
    </div>
  );
};

export default SplitsPage;
