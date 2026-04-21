import { useRef, useState } from "react";
import { useNavigate, Link, Outlet } from "react-router-dom";
import {
  Group,
  Panel,
  Separator,
  usePanelRef,
} from "react-resizable-panels";

import LeftRail from "./components/LeftRail";
import NewsComponents from "./components/newsComponent";

const styles = {
  app: {
    height: "100vh",
    background: "#f5f6f8",
    boxSizing: "border-box",
  },
  panel: {
    height: "100%",
    background: "#ffffff",
    border: "1px solid #e5e7eb",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
  },
  header: {
    height: 48,
    padding: "0 12px",
    borderBottom: "1px solid #e5e7eb",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    fontWeight: 600,
    background: "#fafafa",
    flexShrink: 0,
  },
  body: {
    flex: 1,
    padding: 12,
    overflow: "auto",
  },

  // 바깥 가로 분할용 Separator
  hSeparator: {
    width: 5,
    background: "#d1d5db",
    cursor: "col-resize",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#6b7280",
    fontSize: 7,
    fontWeight: 700,
    textOrientation: "mixed",
    writingMode: "sideways-lr",
    letterSpacing: 5,
  },

  // 오른쪽 내부 세로 분할용 Separator
  vSeparator: {
    height: 5,
    background: "#d1d5db",
    cursor: "row-resize",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#6b7280",
    fontSize: 7,
    fontWeight: 700,
    letterSpacing: 5,
  },

  button: {
    height: 32,
    padding: "0 10px",
    border: "1px solid #d1d5db",
    background: "#fff",
    cursor: "pointer",
    fontSize: 13,
  },
  list: {
    margin: 0,
    paddingLeft: 18,
    lineHeight: 1.8,
  },
  leftRail: {
    width: 40,
    border: "unset",
    padding: "10px 0",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  leftRailButton: {
    width: 40,
    height: 50,
    border: "unset",
    background: "transparent",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    fontSize: 18,
  },
  rightInnerWrap: {
    height: "100%",
    minHeight: 0,
  },
};

export default function IdeLikeLayout() {
  const navigate = useNavigate();
  
  const [activeMenu, setActiveMenu] = useState("news");
  
  const handleRailItemClick = (item, event) => {
    console.log("clicked:", item.id);
    console.log("button element:", event.currentTarget);

    switch (item.id) {
      case "news":
        setActiveMenu("news");
        break;

      case "search":
        setActiveMenu("search");
        break;

      case "premium":
        setActiveMenu("premium");
        break;

      case "analysis":
        setActiveMenu("analysis");
        break;

      case "notifications":
        setActiveMenu("notifications");
        break;

      case "settings":
        setActiveMenu("settings");
        break;

      case "account":
        setActiveMenu("account");
        break;

      default:
        break;
    }
    leftPanelRef.current?.expand();
  };

  return (
    <div style={styles.app}>
      <Group orientation="horizontal" style={{ height: "100%" }}>
          <LeftRail activeId={activeMenu} onItemClick={handleRailItemClick} />
          {/* <aside style={styles.leftRail}>
            <button
              type="button"
              style={styles.leftRailButton}
              title="문서 목록"
              onClick={() => leftPanelRef.current?.expand()}
            >
                <span style={{ fontSize: 24, lineHeight: "24px" }}>📄</span>
            </button>
            <button
              type="button"
              style={styles.leftRailButton}
              title="검색 결과"
              onClick={() => leftPanelRef.current?.expand()}
            >
                <span style={{ fontSize: 24, lineHeight: "24px" }}>🔍</span>
            </button>
            <button
              type="button"
              style={styles.leftRailButton}
              title="최근 작업"
              onClick={() => leftPanelRef.current?.expand()}
            >
                <span style={{ fontSize: 24, lineHeight: "24px" }}>🕒</span>
            </button>
            <button
              type="button"
              style={styles.leftRailButton}
              title="즐겨찾기"
              onClick={() => leftPanelRef.current?.expand()}
            >
                <span style={{ fontSize: 24, lineHeight: "24px" }}>⭐</span>
            </button>
          </aside> */}
          <NewsComponents />
      </Group>
    </div>
  );
}