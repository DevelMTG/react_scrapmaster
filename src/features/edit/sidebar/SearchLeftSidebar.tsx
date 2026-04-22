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
};

export default function SearchLeftSidebar({
  toggleLeft = () => {},
}) {

  return (
    <section style={styles.panel}>
      <header style={styles.header}>
        <span>목록 패널</span>
        <button style={styles.button} onClick={toggleLeft}>
          좌측 토글
        </button>
      </header>

      <div style={styles.body}>
        <ul style={styles.list}>
          <li>문서 목록</li>
          <li>검색 결과</li>
          <li>최근 작업</li>
          <li>즐겨찾기</li>
        </ul>
      </div>
    </section>
  );
}