import { Outlet } from "react-router";

export function PhoneFrame() {
  return (
    <div
      className="flex items-center justify-center w-full h-full"
      style={{
        background: "#08090C",
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif",
      }}
    >
      {/* Phone Frame */}
      <div
        style={{
          width: 360,
          height: 800,
          borderRadius: 40,
          background: "#0B0F14",
          position: "relative",
          overflow: "hidden",
          boxShadow:
            "0 0 0 1px rgba(255,255,255,0.06), 0 25px 80px rgba(0,0,0,0.6), 0 0 60px rgba(22, 163, 74, 0.04)",
        }}
      >
        {/* Screen Content */}
        <div
          style={{
            height: "100%",
            overflow: "hidden",
            WebkitOverflowScrolling: "touch",
            overscrollBehavior: "none",
          }}
        >
          <Outlet />
        </div>
      </div>
    </div>
  );
}
