import { Outlet } from "react-router";

export function PhoneFrame() {
  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        background: "#0D0D0D",
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Screen Content - Full Screen, Responsive */}
      <div
        style={{
          flex: 1,
          width: "100%",
          height: "100%",
          background: "#0D0D0D",
          display: "flex",
          flexDirection: "column",
          overflowY: "auto",
          overflowX: "hidden",
          WebkitOverflowScrolling: "touch",
          scrollBehavior: "smooth",
        }}
      >
        <Outlet />
      </div>
    </div>
  );
}
