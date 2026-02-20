import { Outlet } from "react-router";

export function PhoneFrame() {
  return (
    <div
      style={{
        width: "100%",
        height: "100dvh",
        background: "#0D0D0D",
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif",
        display: "flex",
        flexDirection: "column",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: "hidden",
        paddingTop: "max(0px, var(--safe-area-inset-top))",
        paddingBottom: "max(0px, var(--safe-area-inset-bottom))",
        paddingLeft: "max(0px, var(--safe-area-inset-left))",
        paddingRight: "max(0px, var(--safe-area-inset-right))",
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
          position: "relative",
        }}
      >
        <Outlet />
      </div>
    </div>
  );
}
