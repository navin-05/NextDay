import { useNavigate } from "react-router";
import { ArrowLeft, Camera, Info } from "lucide-react";
import { motion } from "motion/react";
import { useUser } from "../context/UserContext";

export function SettingsScreen() {
  const navigate = useNavigate();
  const { displayName, setDisplayName, dailyBudget, setDailyBudget } = useUser();

  return (
    <div className="flex flex-col h-full" style={{ background: "#0D0D0D" }}>
      {/* Header */}
      <div className="flex items-center gap-3 px-5 pt-4 pb-3"
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
          <ArrowLeft size={18} color="#9CA3AF" />
        </motion.button>
        <h2
          style={{
            color: "#FFFFFF",
            fontSize: "17px",
            fontWeight: 600,
          }}
        >
          Settings
        </h2>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-5 pt-6 pb-8">
        {/* Profile Section */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col items-center mb-8"
        >
          <div style={{ position: "relative", marginBottom: 12 }}>
            <div
              style={{
                width: 88,
                height: 88,
                borderRadius: "50%",
                background: "#2ECC71",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 6px 24px rgba(46, 204, 113, 0.3)",
              }}
            >
              <span style={{ color: "#FFFFFF", fontSize: "36px", fontWeight: 700 }}>
                {displayName.charAt(0).toUpperCase()}
              </span>
            </div>
            {/* Camera icon overlay */}
            <div
              style={{
                position: "absolute",
                bottom: 0,
                right: 0,
                width: 30,
                height: 30,
                borderRadius: "50%",
                background: "#1C1C1C",
                border: "3px solid #0D0D0D",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Camera size={13} color="#9CA3AF" />
            </div>
          </div>
          <p style={{ color: "#6B7280", fontSize: "13px" }}>Tap to change photo</p>
        </motion.div>

        {/* Fields */}
        <div className="flex flex-col gap-4 mb-6">
          <motion.div
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15, duration: 0.4 }}
            style={{
              borderRadius: 20,
              background: "#1C1C1C",
              border: "1px solid rgba(255,255,255,0.05)",
              padding: "16px 18px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            }}
          >
            <label
              style={{
                color: "#6B7280",
                fontSize: "12px",
                fontWeight: 500,
                letterSpacing: "0.04em",
                display: "block",
                marginBottom: 6,
              }}
            >
              Display Name
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              style={{
                width: "100%",
                background: "transparent",
                border: "none",
                color: "#FFFFFF",
                fontSize: "16px",
                fontWeight: 600,
                outline: "none",
                padding: 0,
              }}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25, duration: 0.4 }}
            style={{
              borderRadius: 20,
              background: "#1C1C1C",
              border: "1px solid rgba(255,255,255,0.05)",
              padding: "16px 18px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            }}
          >
            <label
              style={{
                color: "#6B7280",
                fontSize: "12px",
                fontWeight: 500,
                letterSpacing: "0.04em",
                display: "block",
                marginBottom: 6,
              }}
            >
              Daily Budget
            </label>
            <div className="flex items-center gap-1">
              <span style={{ color: "#06795a", fontSize: "16px", fontWeight: 600 }}>₹</span>
              <input
                type="text"
                value={dailyBudget}
                onChange={(e) => {
                  const value = parseInt(e.target.value || "0", 10);
                  if (!isNaN(value)) setDailyBudget(value);
                }}
                style={{
                  width: "100%",
                  background: "transparent",
                  border: "none",
                  color: "#FFFFFF",
                  fontSize: "16px",
                  fontWeight: 600,
                  outline: "none",
                  padding: 0,
                }}
              />
            </div>
          </motion.div>
        </div>

        {/* Carry Forward Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.4 }}
            style={{
              borderRadius: 20,
              background: "linear-gradient(135deg, rgba(6, 121, 90, 0.10), rgba(6, 121, 90, 0.06))",
              border: "1px solid rgba(6, 121, 90, 0.2)",
              padding: "18px",
              display: "flex",
              gap: 14,
              alignItems: "flex-start",
              marginBottom: 32,
            }}
          >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 12,
              background: "rgba(6, 121, 90, 0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              marginTop: 1,
            }}
          >
            <Info size={17} color="#06795a" />
          </div>
          <div>
            <p style={{ color: "#06795a", fontSize: "13px", fontWeight: 600, marginBottom: 6 }}>
              Carry Forward
            </p>
            <p style={{ color: "#9CA3AF", fontSize: "12px", lineHeight: 1.7 }}>
              Any unspent budget from today carries forward to the next day. If you spend less
              than your daily base of ₹{dailyBudget}, the remaining amount adds to tomorrow's available
              budget automatically.
            </p>
          </div>
        </motion.div>

        {/* Danger Zone - Reset */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.4 }}
          className="mb-8"
        >
          <p style={{ color: "#6B7280", fontSize: "12px", fontWeight: 500, letterSpacing: "0.04em", marginBottom: 12 }}>
            Data
          </p>
          <button
            style={{
              width: "100%",
              borderRadius: 20,
              background: "rgba(239, 68, 68, 0.06)",
              border: "1px solid rgba(239, 68, 68, 0.15)",
              padding: "16px 18px",
              color: "#EF4444",
              fontSize: "14px",
              fontWeight: 600,
              cursor: "pointer",
              textAlign: "left",
            }}
          >
            Reset All Data
          </button>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="text-center pb-4"
        >
          <p style={{ color: "#4B5563", fontSize: "14px", fontWeight: 600, letterSpacing: "0.02em" }}>The RealFinance</p>
          <p style={{ color: "#374151", fontSize: "11px", marginTop: 4 }}>
            Version 1.0.0
          </p>
        </motion.div>
      </div>
    </div>
  );
}
