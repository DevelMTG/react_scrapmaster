import {
  Group,
  Panel,
  Separator,
  usePanelRef,
} from "react-resizable-panels";
import NewsLeftSidebar from "../sidebar/NewsLeftSidebar";

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

export default function SearchMain() {
  const leftPanelRef = usePanelRef();
  
  const toggleLeft = () => {
    const panel = leftPanelRef.current;
    if (!panel) return;

    if (panel.isCollapsed()) {
      panel.expand();
    } else {
      panel.collapse();
    }
  };

  return (
    <>
      <Panel
        id="left"
        panelRef={leftPanelRef}
        defaultSize="280px"
        minSize="180px"
        maxSize="400px"
        collapsible
        collapsedSize="0px"
      >
        <NewsLeftSidebar toggleLeft={toggleLeft} />
      </Panel>

      <Separator style={styles.hSeparator}>•••</Separator>

      <Panel id="center" minSize="420px">
        <section style={styles.panel}>
          <header style={styles.header}>
            <span>메인 작업영역</span>
          </header>

          <div style={styles.body}>
            메뉴를 클릭하면 이 영역에 상세 화면이나 편집기가 열린다고
            생각하시면 됩니다.
            <br /><br />
            예:
            <ul style={styles.list}>
              <li>게시물 상세</li>
              <li>편집 화면</li>
              <li>미리보기</li>
              <li>탭형 콘텐츠</li>
            </ul>
          </div>
        </section>
      </Panel>
    </>
  );
}