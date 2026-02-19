import { Outlet } from "react-router";

export function PhoneFrame() {
  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        background: "#0D0D0D",
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Screen Content - Full Screen */}
      <div style={{ flex: 1, width: "100%", background: "#0D0D0D" }}>
        <Outlet />
      </div>
    </div>
  );
}
