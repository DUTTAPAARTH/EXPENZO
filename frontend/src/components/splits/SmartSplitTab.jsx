import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { RefreshCw } from "lucide-react";
import { computeRemainingAmount } from "../../utils/splits";

const TabButton = ({ children, active, onClick }) => (
  <button
    onClick={onClick}
    className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
      active ? "bg-primary-500 text-white" : "bg-slate-800 text-slate-300"
    }`}
  >
    {children}
  </button>
);

const SplitCard = ({ split, onMarkPaid, onToggleRead }) => {
  const remaining = computeRemainingAmount(split);
  return (
    <div className="p-4 bg-slate-900 border border-slate-800 rounded-lg">
      <div className="flex justify-between items-start">
        <div>
          <h4 className="text-lg font-semibold text-white">{split.title}</h4>
          <p className="text-sm text-slate-400">Total: ₹{split.totalAmount}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-slate-400">Remaining</p>
          <p className="font-bold text-white">₹{remaining}</p>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-2">
        {split.participants.map((p) => (
          <div key={p.id} className="p-2 bg-slate-800 rounded-md">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-sm text-slate-300 font-medium">
                  {p.name}
                </div>
                <div className="text-xs text-slate-400">
                  Share: ₹{p.shareAmount}
                </div>
                <div className="text-xs text-slate-400">
                  Paid: ₹{p.paidAmount || 0}
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <button
                  onClick={() => onMarkPaid(split.id, p.id)}
                  className="px-2 py-1 bg-green-600 hover:bg-green-700 text-white rounded-md text-xs"
                >
                  Mark as Paid
                </button>
                <button
                  onClick={() => onToggleRead(split.id, !split.read)}
                  className={`px-2 py-1 rounded-md text-xs ${
                    split.read
                      ? "bg-slate-700 text-white"
                      : "bg-slate-600 text-slate-200"
                  }`}
                >
                  {split.read ? "Read" : "Mark Read"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function SmartSplitTab() {
  const [tab, setTab] = useState("overview");
  const [splits, setSplits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const fetchSplits = async (status = "open", q = "") => {
    setLoading(true);
    try {
      const res = await axios.get("/api/splits", {
        params: { status, search: q },
      });
      setSplits(res.data.data.splits || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load splits");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // default to overview (open)
    fetchSplits("open", "");
  }, []);

  // Auto-refresh when page becomes visible (e.g., after creating split in another tab/modal)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        const status =
          tab === "overview" ? "open" : tab === "history" ? "settled" : "all";
        fetchSplits(status, search);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [tab, search]);

  useEffect(() => {
    const status =
      tab === "overview" ? "open" : tab === "history" ? "settled" : "all";
    fetchSplits(status, search);
  }, [tab, search]);

  // Auto-refresh every 30 seconds to catch new splits
  useEffect(() => {
    const interval = setInterval(() => {
      const status =
        tab === "overview" ? "open" : tab === "history" ? "settled" : "all";
      fetchSplits(status, search);
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [tab, search]);

  const handleMarkPaid = async (splitId, participantId) => {
    // optimistic update
    const prev = JSON.parse(JSON.stringify(splits));
    setSplits((s) =>
      s.map((sp) => {
        if (sp.id !== splitId) return sp;
        return {
          ...sp,
          participants: sp.participants.map((p) =>
            p.id === participantId
              ? {
                  ...p,
                  paidAmount: p.shareAmount,
                  status: "paid",
                  paidAt: new Date().toISOString(),
                }
              : p
          ),
        };
      })
    );

    try {
      await axios.put(`/api/splits/${splitId}/pay`, { participantId });
      toast.success("Marked as paid");
    } catch (err) {
      console.error(err);
      toast.error("Failed to mark paid");
      setSplits(prev); // revert
    }
  };

  const handleToggleRead = async (splitId, read) => {
    const prev = JSON.parse(JSON.stringify(splits));
    setSplits((s) => s.map((sp) => (sp.id === splitId ? { ...sp, read } : sp)));
    try {
      await axios.put(`/api/splits/${splitId}/read`, { read });
    } catch (err) {
      console.error(err);
      toast.error("Failed to update read status");
      setSplits(prev);
    }
  };

  const totalOutstanding = splits.reduce(
    (acc, s) => acc + computeRemainingAmount(s),
    0
  );
  const pendingShares = splits.reduce(
    (acc, s) => acc + s.participants.filter((p) => p.status !== "paid").length,
    0
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <TabButton
            active={tab === "overview"}
            onClick={() => setTab("overview")}
          >
            Overview
          </TabButton>
          <TabButton
            active={tab === "history"}
            onClick={() => setTab("history")}
          >
            History
          </TabButton>
          <TabButton active={tab === "all"} onClick={() => setTab("all")}>
            All
          </TabButton>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              const status =
                tab === "overview"
                  ? "open"
                  : tab === "history"
                  ? "settled"
                  : "all";
              fetchSplits(status, search);
              toast.success("Refreshed!");
            }}
            className="px-3 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg flex items-center gap-2 transition-colors"
            title="Refresh splits"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by participant or title"
            className="px-3 py-2 rounded-lg bg-slate-800 text-white"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-lg">
          <p className="text-sm text-slate-400">Total Outstanding</p>
          <p className="text-xl font-bold text-white">₹{totalOutstanding}</p>
        </div>
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-lg">
          <p className="text-sm text-slate-400">Pending Shares</p>
          <p className="text-xl font-bold text-white">{pendingShares}</p>
        </div>
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-lg">
          <p className="text-sm text-slate-400">Splits</p>
          <p className="text-xl font-bold text-white">{splits.length}</p>
        </div>
      </div>

      {loading ? (
        <div className="text-slate-400">Loading...</div>
      ) : (
        <div className="space-y-3">
          {splits.map((s) => (
            <SplitCard
              key={s.id}
              split={s}
              onMarkPaid={handleMarkPaid}
              onToggleRead={handleToggleRead}
            />
          ))}
          {splits.length === 0 && (
            <div className="text-slate-400">No splits found.</div>
          )}
        </div>
      )}
    </div>
  );
}
