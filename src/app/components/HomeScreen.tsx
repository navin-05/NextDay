import { useNavigate, useLocation } from "react-router";
import { TrendingUp, Calculator, ChevronRight, ChevronLeft, Calendar, Plus, Pencil, Check, X, Delete, Lock, Trash2, Edit2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";
import { useUser } from "../context/UserContext";
import { useExpense } from "../context/ExpenseContext";

const categoryEmojis: { [key: string]: string } = {
  Food: "🍔",
  Transport: "🚗",
  Shopping: "🛍️",
  Bills: "📄",
  Entertain: "🎬",
  Healthcare: "💊",
  Education: "📚",
  Groceries: "🥬",
  Travel: "✈️",
  Invest: "📈",
  Custom: "+",
};

// Helper function to convert date object to YYYY-MM-DD string
const getDateString = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export function HomeScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const { displayName, dailyBudget } = useUser();
  const { expenses, deleteExpense, getExpensesByDate } = useExpense();
  const [budget, setBudget] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [padInput, setPadInput] = useState("");
  const [showCalendar, setShowCalendar] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(new Date().getMonth());
  const [calendarYear, setCalendarYear] = useState(new Date().getFullYear());
  const [selectedDate, setSelectedDate] = useState<string>(getDateString(new Date()));

  // Initialize budget with daily budget from context
  useEffect(() => {
    setBudget(dailyBudget);
  }, [dailyBudget]);

  // Restore selected date when returning from add-expense (stay on the date user was viewing)
  useEffect(() => {
    const state = location.state as { selectedDate?: string } | null;
    if (state?.selectedDate) {
      setSelectedDate(state.selectedDate);
    }
  }, [location.state]);

  // Get current date formatted
  const getCurrentDateString = () => {
    const date = new Date(selectedDate);
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const dayName = days[date.getDay()];
    const dateNum = date.getDate();
    const monthName = months[date.getMonth()];
    const year = date.getFullYear();

    return `${dayName}, ${dateNum} ${monthName} ${year}`;
  };

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

  const confirmBudget = () => {
    const val = parseFloat(padInput);
    if (!isNaN(val) && val > 0) setBudget(val);
    setIsEditing(false);
    setPadInput("");
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setPadInput("");
  };

  // Get calendar days for a given month/year
  const getCalendarDays = (month: number, year: number) => {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days = [];
    
    // Add empty slots for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    
    return days;
  };

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const dayNames = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
  const today = new Date();
  const calendarDays = getCalendarDays(calendarMonth, calendarYear);

  // Get expenses for the selected date
  const filteredExpenses = getExpensesByDate(selectedDate);

  // Calculate total spent and available budget for selected date
  const totalSpent = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const availableBudget = budget - totalSpent;

  // Card color based on spending: 30% spent → yellow, 60% spent → red
  const percentSpent = budget > 0 ? (totalSpent / budget) * 100 : 0;
  const budgetCardTheme =
    percentSpent >= 60
      ? {
          background: "linear-gradient(135deg, #991B1B 0%, #B91C1C 60%, #DC2626 100%)",
          boxShadow: "0 8px 32px rgba(185, 28, 28, 0.25), 0 2px 8px rgba(0,0,0,0.3)",
        }
      : percentSpent >= 30
        ? {
            background: "linear-gradient(135deg, #B45309 0%, #D97706 60%, #F59E0B 100%)",
            boxShadow: "0 8px 32px rgba(217, 119, 6, 0.25), 0 2px 8px rgba(0,0,0,0.3)",
          }
        : {
            background: "linear-gradient(135deg, #15803D 0%, #16A34A 60%, #22C55E 100%)",
            boxShadow: "0 8px 32px rgba(22, 163, 74, 0.25), 0 2px 8px rgba(0,0,0,0.3)",
          };

  const displayValue = padInput === "" ? "0" : padInput;

  const padKeys = [
    ["1", "2", "3"],
    ["4", "5", "6"],
    ["7", "8", "9"],
    [".", "0", "del"],
  ];

  return (
    <div className="relative flex flex-col h-full" style={{ background: "#0D0D0D", willChange: "transform", transform: "translateZ(0)", WebkitTransform: "translateZ(0)" }}>
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
                  Set Daily Budget
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
                onClick={confirmBudget}
                style={{
                  width: "100%",
                  background: "#2ECC71",
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
                Confirm Budget
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Calendar Modal */}
      <AnimatePresence>
        {showCalendar && (
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
              alignItems: "center",
              justifyContent: "center",
            }}
            onClick={() => setShowCalendar(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              style={{
                background: "#1C1C1C",
                borderRadius: "24px",
                padding: "20px",
                border: "1px solid rgba(255,255,255,0.08)",
                minWidth: 320,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Calendar Header */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => {
                    if (calendarMonth === 0) {
                      setCalendarMonth(11);
                      setCalendarYear(calendarYear - 1);
                    } else {
                      setCalendarMonth(calendarMonth - 1);
                    }
                  }}
                  style={{
                    background: "rgba(255,255,255,0.08)",
                    border: "none",
                    borderRadius: "8px",
                    width: 32,
                    height: 32,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                  }}
                >
                  <ChevronLeft size={18} color="#FFFFFF" />
                </motion.button>
                <p style={{ color: "#FFFFFF", fontSize: "16px", fontWeight: 600 }}>
                  {monthNames[calendarMonth]} {calendarYear}
                </p>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => {
                    if (calendarMonth === 11) {
                      setCalendarMonth(0);
                      setCalendarYear(calendarYear + 1);
                    } else {
                      setCalendarMonth(calendarMonth + 1);
                    }
                  }}
                  style={{
                    background: "rgba(255,255,255,0.08)",
                    border: "none",
                    borderRadius: "8px",
                    width: 32,
                    height: 32,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                  }}
                >
                  <ChevronRight size={18} color="#FFFFFF" />
                </motion.button>
              </div>

              {/* Day names */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 8, marginBottom: 12 }}>
                {dayNames.map((day) => (
                  <div key={day} style={{ textAlign: "center", color: "#9CA3AF", fontSize: "12px", fontWeight: 500 }}>
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Days */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 8 }}>
                {calendarDays.map((day, idx) => (
                  <motion.div
                    key={idx}
                    whileTap={day ? { scale: 0.9 } : {}}
                    onClick={() => {
                      if (day) {
                        const selectedDateString = getDateString(new Date(calendarYear, calendarMonth, day));
                        setSelectedDate(selectedDateString);
                        setShowCalendar(false);
                      }
                    }}
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 8,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor:
                        day &&
                        day === today.getDate() &&
                        calendarMonth === today.getMonth() &&
                        calendarYear === today.getFullYear()
                          ? "#06795a"
                          : getDateString(new Date(calendarYear, calendarMonth, day || 1)) === selectedDate && day
                          ? "rgba(6, 121, 90, 0.5)"
                          : "transparent",
                      color:
                        day &&
                        day === today.getDate() &&
                        calendarMonth === today.getMonth() &&
                        calendarYear === today.getFullYear()
                          ? "#FFFFFF"
                          : day
                          ? "#FFFFFF"
                          : "transparent",
                      fontSize: "14px",
                      fontWeight: 500,
                      cursor: day ? "pointer" : "default",
                    }}
                  >
                    {day}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-5 pt-6" style={{ WebkitBackfaceVisibility: "hidden", backfaceVisibility: "hidden", transform: "translateZ(0)", WebkitTransform: "translateZ(0)" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, gap: 16 }}>
          <div style={{ flex: 1 }}>
            <p style={{ color: "#9CA3AF", fontSize: "13px", letterSpacing: "0.01em", margin: 0, marginBottom: 8 }}>
              Good morning, {displayName}
            </p>
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowCalendar(true)}
              style={{
                background: "none",
                border: "none",
                padding: 0,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <Calendar size={18} color="#06795a" strokeWidth={2} />
              <span
                style={{
                  color: "#FFFFFF",
                  fontSize: "16px",
                  fontWeight: 700,
                  lineHeight: 1.2,
                  margin: 0,
                }}
              >
                {getCurrentDateString()}
              </span>
            </motion.button>
          </div>
          <motion.div
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/settings")}
            className="cursor-pointer"
            style={{
              width: 44,
              height: 44,
              borderRadius: "50%",
              background: "#06795a",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 14px rgba(6, 121, 90, 0.35)",
              flexShrink: 0,
            }}
          >
            <span style={{ color: "#fff", fontSize: "18px", fontWeight: 700 }}>
              {displayName.charAt(0).toUpperCase()}
            </span>
          </motion.div>
        </div>

        {/* Budget Card */}
        <div
          style={{
            borderRadius: 24,
            background: budgetCardTheme.background,
            padding: "24px",
            boxShadow: budgetCardTheme.boxShadow,
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Decorative circles */}
          <div
            style={{
              position: "absolute",
              top: -30,
              right: -30,
              width: 120,
              height: 120,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.08)",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: -20,
              left: -20,
              width: 80,
              height: 80,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.05)",
            }}
          />

          <p
            style={{
              color: "rgba(255,255,255,0.8)",
              fontSize: "13px",
              fontWeight: 500,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              marginBottom: 8,
            }}
          >
            Available Budget
          </p>
          <h2
            onClick={() => setIsEditing(true)}
            style={{
              color: "#FFFFFF",
              fontSize: "40px",
              fontWeight: 800,
              lineHeight: 1.1,
              marginBottom: 24,
              letterSpacing: "-0.02em",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            ₹{availableBudget.toFixed(2)}
            <span style={{ opacity: 0.45, fontSize: "18px", fontWeight: 400, marginTop: 4 }}>
              
            </span>
          </h2>

          {/* Stats Row */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 12,
              borderTop: "1px solid rgba(255,255,255,0.15)",
              paddingTop: 16,
            }}
          >
            {[
              { label: "Spent This Day", value: `₹${totalSpent.toFixed(2)}` },
              { label: "Carry Forward", value: `₹${Math.max(0, availableBudget).toFixed(2)}` },
              { label: "Daily Base", value: `₹${dailyBudget}` },
            ].map((item) => (
              <div key={item.label} style={{ textAlign: "center" }}>
                <p
                  style={{
                    color: "rgba(255,255,255,0.6)",
                    fontSize: "11px",
                    fontWeight: 500,
                    marginBottom: 4,
                  }}
                >
                  {item.label}
                </p>
                <p
                  style={{
                    color: "#FFFFFF",
                    fontSize: "18px",
                    fontWeight: 700,
                  }}
                >
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <h3
              style={{
                color: "#FFFFFF",
                fontSize: "16px",
                fontWeight: 600,
              }}
            >
              Recent Transactions
            </h3>
          </div>

          {filteredExpenses.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.4 }}
              style={{
                borderRadius: 20,
                background: "#1C1C1C",
                border: "1px solid rgba(255,255,255,0.05)",
                padding: "32px 20px",
                textAlign: "center",
                boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
              }}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 16,
                  background: "rgba(107, 114, 128, 0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 12px",
                }}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#4B5563"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="2" y="5" width="20" height="14" rx="2" />
                  <line x1="2" y1="10" x2="22" y2="10" />
                </svg>
              </div>
              <p
                style={{
                  color: "#6B7280",
                  fontSize: "13px",
                  lineHeight: 1.6,
                  maxWidth: 220,
                  margin: "0 auto",
                }}
              >
                No transactions yet. Tap{" "}
                <span style={{ color: "#2ECC71", fontWeight: 600 }}>+</span> to add your first
                expense.
              </p>
            </motion.div>
          ) : (
            <div style={{ borderRadius: 20, background: "#1C1C1C", border: "1px solid rgba(255,255,255,0.05)", overflow: "hidden" }}>
              {filteredExpenses.map((expense, idx) => (
                <motion.div
                  key={expense.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + idx * 0.05 }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "16px 20px",
                    borderBottom: idx !== filteredExpenses.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1 }}>
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 12,
                        background: "rgba(6, 121, 90, 0.12)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "20px",
                      }}
                    >
                      {categoryEmojis[expense.category] || "💰"}
                    </div>
                    <div>
                      <p style={{ color: "#FFFFFF", fontSize: "14px", fontWeight: 500, margin: 0 }}>
                        {((expense.merchant || expense.category).charAt(0).toUpperCase() + (expense.merchant || expense.category).slice(1))}
                      </p>
                      <p style={{ color: "#9CA3AF", fontSize: "11px", margin: "2px 0 0 0" }}>
                        {expense.category}
                      </p>
                    </div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
                    <p style={{ color: "#EF4444", fontSize: "14px", fontWeight: 600, margin: 0 }}>
                      -{expense.amount.toFixed(2)}
                    </p>
                    <div style={{ display: "flex", gap: 8 }}>
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => navigate("/add-expense", { state: { editingExpense: expense } })}
                        style={{
                          background: "rgba(6, 121, 90, 0.15)",
                          border: "none",
                          borderRadius: 8,
                          width: 24,
                          height: 24,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                        }}
                      >
                        <Edit2 size={12} color="#06795a" />
                      </motion.button>
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => deleteExpense(expense.id)}
                        style={{
                          background: "rgba(239, 68, 68, 0.1)",
                          border: "none",
                          borderRadius: 8,
                          width: 24,
                          height: 24,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                        }}
                      >
                        <Trash2 size={12} color="#EF4444" />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Menu Buttons */}
        <div className="flex flex-col gap-3 mt-5">
          {[
            { icon: TrendingUp, label: "Insights", subtitle: "Track your spending patterns", locked: true },
            { icon: Calculator, label: "Daily Tally", subtitle: "End-of-day summary", locked: true },
          ].map((item, idx) => (
            <motion.button
              key={item.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + idx * 0.1, duration: 0.4 }}
              whileTap={{ scale: 0.98 }}
              disabled={item.locked}
              style={{
                borderRadius: 20,
                background: "#1C1C1C",
                border: "1px solid rgba(255,255,255,0.05)",
                padding: "16px 18px",
                display: "flex",
                alignItems: "center",
                gap: 14,
                width: "100%",
                textAlign: "left",
                cursor: item.locked ? "not-allowed" : "pointer",
                boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 14,
                  background: "rgba(46, 204, 113, 0.12)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <item.icon size={20} color="#2ECC71" strokeWidth={2.2} />
              </div>
              <div className="flex-1">
                <p style={{ color: "#FFFFFF", fontSize: "15px", fontWeight: 600 }}>
                  {item.label}
                </p>
                <p style={{ color: "#6B7280", fontSize: "12px", marginTop: 1 }}>
                  {item.subtitle}
                </p>
              </div>
              {!item.locked && <ChevronRight size={18} color="#4B5563" />}

              {item.locked && (
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "rgba(0, 0, 0, 0.5)",
                    backdropFilter: "blur(2px)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 20,
                  }}
                >
                  <Lock size={24} color="#06795a" strokeWidth={2} />
                </div>
              )}
            </motion.button>
          ))}
        </div>
      </div>

      {/* FAB */}
      <motion.button
        onClick={() => navigate("/add-expense", { state: { date: selectedDate } })}
        whileTap={{ scale: 0.9 }}
        whileHover={{ scale: 1.05 }}
        style={{
          position: "absolute",
          bottom: 24,
          right: 20,
          width: 56,
          height: 56,
          borderRadius: "50%",
          background: "#16A34A",
          border: "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          boxShadow: "0 6px 20px rgba(22, 163, 74, 0.4), 0 2px 6px rgba(0,0,0,0.3)",
          zIndex: 10,
        }}
      >
        <Plus size={26} color="#FFFFFF" strokeWidth={2.5} />
      </motion.button>
    </div>
  );
}