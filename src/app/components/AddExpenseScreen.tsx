import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import { X, Check, Delete } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useExpense, Expense } from "../context/ExpenseContext";

const categories = [
  { name: "Food", emoji: "🍔", color: "#F97316" },
  { name: "Transport", emoji: "🚗", color: "#3B82F6" },
  { name: "Shopping", emoji: "🛍️", color: "#EC4899" },
  { name: "Bills", emoji: "📄", color: "#8B5CF6" },
  { name: "Entertain", emoji: "🎬", color: "#EF4444" },
  { name: "Healthcare", emoji: "💊", color: "#14B8A6" },
  { name: "Education", emoji: "📚", color: "#F59E0B" },
  { name: "Groceries", emoji: "🥬", color: "#22C55E" },
  { name: "Travel", emoji: "✈️", color: "#06B6D4" },
  { name: "Invest", emoji: "📈", color: "#10B981" },
  { name: "Custom", emoji: "+", color: "transparent", isCustom: true },
];

export function AddExpenseScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const { addExpense, updateExpense } = useExpense();
  const [amount, setAmount] = useState("0");
  const [merchant, setMerchant] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [padInput, setPadInput] = useState("");
  const [editingExpenseId, setEditingExpenseId] = useState<string | null>(null);

  // Load expense data if editing
  useEffect(() => {
    const state = location.state as { editingExpense?: Expense } | null;
    if (state?.editingExpense) {
      const expense = state.editingExpense;
      setEditingExpenseId(expense.id);
      setAmount(expense.amount.toString());
      setMerchant(expense.merchant);
      setSelectedCategory(expense.category);
      setNote(expense.note);
    }
  }, [location.state]);

  const handlePadKey = (key: string) => {
    if (key === "del") {
      setPadInput((prev) => prev.slice(0, -1));
    } else if (key === "." && padInput.includes(".")) {
      return;
    } else if (padInput.length >= 7) {
      return;
    } else {
      setPadInput((prev) => prev + key);
    }
  };

  const confirmAmount = () => {
    const val = parseFloat(padInput);
    if (!isNaN(val) && val > 0) {
      setAmount(val.toString());
    }
    setIsEditing(false);
    setPadInput("");
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setPadInput("");
  };

  const displayValue = padInput === "" ? "0" : padInput;

  const padKeys = [
    ["1", "2", "3"],
    ["4", "5", "6"],
    ["7", "8", "9"],
    [".", "0", "del"],
  ];

  return (
    <div className="flex flex-col h-full" style={{ background: "#0D0D0D", position: "relative" }}>
      {/* Number Pad Modal */}
      <AnimatePresence>
        {isEditing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 50,
              background: "rgba(0,0,0,0.7)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
            }}
            onClick={cancelEdit}
          >
            <motion.div
              initial={{ y: 300 }}
              animate={{ y: 0 }}
              exit={{ y: 300 }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              style={{
                background: "#1C1C1C",
                borderRadius: "24px 24px 0 0",
                padding: "20px 20px 32px",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "13px", fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                  Set Amount
                </p>
                <button onClick={cancelEdit} style={{ background: "rgba(255,255,255,0.08)", border: "none", borderRadius: "50%", width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                  <X size={14} color="rgba(255,255,255,0.6)" />
                </button>
              </div>

              {/* Display */}
              <div style={{ textAlign: "center", marginBottom: 24, padding: "16px 0", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "28px", fontWeight: 700 }}>₹</span>
                <span style={{ color: "#FFFFFF", fontSize: "48px", fontWeight: 800, letterSpacing: "-0.03em", marginLeft: 4 }}>
                  {displayValue}
                </span>
              </div>

              {/* Pad Grid */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 14 }}>
                {padKeys.map((row, ri) =>
                  row.map((key) => (
                    <motion.button
                      key={`${ri}-${key}`}
                      whileTap={{ scale: 0.92 }}
                      onClick={() => handlePadKey(key)}
                      style={{
                        background: key === "del" ? "rgba(239,68,68,0.12)" : "rgba(255,255,255,0.07)",
                        border: "1px solid rgba(255,255,255,0.06)",
                        borderRadius: 14,
                        height: 52,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        color: key === "del" ? "#EF4444" : "#FFFFFF",
                        fontSize: key === "del" ? 14 : 20,
                        fontWeight: 600,
                      }}
                    >
                      {key === "del" ? <Delete size={18} /> : key}
                    </motion.button>
                  ))
                )}
              </div>

              {/* Confirm Button */}
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={confirmAmount}
                style={{
                  width: "100%",
                  background: "#06795a",
                  border: "none",
                  borderRadius: 16,
                  height: 52,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  cursor: "pointer",
                  color: "#FFFFFF",
                  fontSize: "16px",
                  fontWeight: 700,
                }}
              >
                <Check size={18} />
                Confirm Amount
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Header */}
      <div
        className="flex items-center justify-between px-5 pt-4 pb-3"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
      >
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate("/")}
          style={{
            width: 36,
            height: 36,
            borderRadius: 12,
            background: "rgba(255,255,255,0.06)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            border: "none",
          }}
        >
          <X size={18} color="#9CA3AF" />
        </motion.button>
        <h2
          style={{
            color: "#FFFFFF",
            fontSize: "17px",
            fontWeight: 600,
          }}
        >
          {editingExpenseId ? "Edit Expense" : "Add Expense"}
        </h2>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => {
            if (amount !== "0" && selectedCategory) {
              if (editingExpenseId) {
                updateExpense(editingExpenseId, {
                  amount: parseFloat(amount),
                  merchant,
                  category: selectedCategory,
                  note
                });
              } else {
                addExpense({
                  amount: parseFloat(amount),
                  merchant,
                  category: selectedCategory,
                  note
                });
              }
              navigate("/");
            }
          }}
          style={{
            width: 36,
            height: 36,
            borderRadius: 12,
            background: "rgba(6, 121, 90, 0.15)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            border: "none",
            opacity: amount === "0" || !selectedCategory ? 0.5 : 1,
          }}
        >
          <Check size={18} color="#06795a" />
        </motion.button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Amount Display */}
        <div className="text-center py-5 px-5">
          <p style={{ color: "#6B7280", fontSize: "12px", fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 }}>
            Amount
          </p>
          <div
            onClick={() => setIsEditing(true)}
            style={{
              cursor: "pointer",
            }}
          >
            <span
              style={{
                color: amount === "0" ? "#4B5563" : "#FFFFFF",
                fontSize: "42px",
                fontWeight: 800,
                letterSpacing: "-0.02em",
                lineHeight: 1.1,
              }}
            >
              ₹{amount}
            </span>
          </div>
        </div>

        {/* Merchant Input */}
        <div className="px-5 mb-4">
          <input
            type="text"
            value={merchant}
            onChange={(e) => setMerchant(e.target.value)}
            placeholder="Merchant name (e.g., Swiggy)"
            style={{
              width: "100%",
              padding: "14px 18px",
              borderRadius: 16,
              background: "#1C1C1C",
              border: "1px solid rgba(255,255,255,0.06)",
              color: "#FFFFFF",
              fontSize: "14px",
              outline: "none",
            }}
          />
        </div>

        {/* Category Grid */}
        <div className="px-5 mb-4">
          <p style={{ color: "#9CA3AF", fontSize: "12px", fontWeight: 500, marginBottom: 10, letterSpacing: "0.03em" }}>
            Category
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 10,
            }}
          >
            {categories.map((cat) => (
              <motion.button
                key={cat.name}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(cat.name)}
                style={{
                  borderRadius: 16,
                  background:
                    selectedCategory === cat.name
                      ? "rgba(6, 121, 90, 0.12)"
                      : "#1C1C1C",
                  border:
                    cat.isCustom
                      ? "2px dashed rgba(255,255,255,0.15)"
                      : selectedCategory === cat.name
                      ? "1.5px solid rgba(6, 121, 90, 0.5)"
                      : "1px solid rgba(255,255,255,0.05)",
                  padding: "14px 8px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 6,
                  cursor: "pointer",
                }}
              >
                <span style={{ fontSize: cat.isCustom ? "20px" : "22px", lineHeight: 1 }}>
                  {cat.isCustom ? (
                    <span style={{ color: "#6B7280", fontWeight: 300 }}>+</span>
                  ) : (
                    cat.emoji
                  )}
                </span>
                <span
                  style={{
                    color:
                      selectedCategory === cat.name ? "#06795a" : "#9CA3AF",
                    fontSize: "11px",
                    fontWeight: 500,
                  }}
                >
                  {cat.name}
                </span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Note Field */}
        <div className="px-5 mb-4">
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Add a note (optional)"
            style={{
              width: "100%",
              padding: "14px 18px",
              borderRadius: 16,
              background: "#1C1C1C",
              border: "1px solid rgba(255,255,255,0.06)",
              color: "#FFFFFF",
              fontSize: "14px",
              outline: "none",
            }}
          />
        </div>
      </div>
    </div>
  );
}
