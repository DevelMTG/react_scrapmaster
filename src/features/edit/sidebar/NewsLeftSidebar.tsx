import { PanelLeftClose } from "lucide-react";

const styles = {
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
  button: {
    padding: "0",
    border: "unset",
    background: "transparent",
    cursor: "pointer",
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
};

export default function NewsLeftSidebar({
  toggleLeft = () => {},
}) {

  return (
    <section style={styles.panel}>
      <header style={styles.header}>
        <span>뉴스</span>
        <button style={styles.button} onClick={toggleLeft}>
          <PanelLeftClose />
        </button>
      </header>

      <div style={styles.body}>
        <ul style={styles.list}>
          <li>날짜 선택</li>
          <li>매체 선택</li>
          <li>기사 목록</li>
        </ul>
      </div>
    </section>
  );
}