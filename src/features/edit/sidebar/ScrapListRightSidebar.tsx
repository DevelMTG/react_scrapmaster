import { useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { useScrapStore } from "../../../store/edit/useScrapStore";
import { Trash2, PanelRightClose, Eye, EyeClosed } from "lucide-react";
// import "./styles/scrap-list-menu.css";
import { usePanelRef, Panel, Separator, Group } from "react-resizable-panels";

const styles = {
  panel: {
    height: "100%",
    background: "#ffffff",
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
  list: {
    margin: 0,
    paddingLeft: 18,
    lineHeight: 1.8,
  },
  noWrap: {
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
  },
  button: {
    padding: "0",
    border: "unset",
    background: "transparent",
    cursor: "pointer",
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
  rightInnerWrap: {
    height: "100%",
    minHeight: 0,
    display: "flex",
    flexDirection: "column",
  },
  bottomBar: {
    height: 44,
    flexShrink: 0,
    marginTop: "auto",
    borderTop: "1px solid #e5e7eb",
    background: "#ffffff",
  },
  rightNav: {
    width: 50,
    height: "100%",
    background: "#3f3f3f",
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    overflow: "hidden",
    fontFamily: "Malgun Gothic, Arial, sans-serif",
  },
  scrapBtn: {
    width: 44,
    height: 58,
    marginTop: 6,
    border: 0,
    borderRadius: 2,
    background: "#2f80ed",
    color: "#fff",
    cursor: "pointer",
    padding: "4px 0",
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  scrapIcon: {
    fontSize: 18,
    lineHeight: 1,
    marginBottom: 3,
  },
  scrapText: {
    fontSize: 11,
    lineHeight: 1.15,
    fontWeight: 600,
    textAlign: "center",
  },
  topTools: {
    width: 44,
    marginTop: 10,
    display: "flex",
    flexDirection: "column",
    gap: 6,
    alignItems: "center",
  },
  toolBtn: {
    width: 28,
    height: 28,
    border: "1px solid #bdbdbd",
    borderRadius: 2,
    background: "#f2f2f2",
    color: "#333",
    fontSize: 18,
    fontWeight: 600,
    lineHeight: 1,
    cursor: "pointer",
  },
  toolBtnArrow: {
    height: 22,
    fontSize: 15,
    color: "#777",
  },
  verticalTabs: {
    width: 50,
    marginTop: 8,
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
  },
  tabItem: {
    position: "relative",
    width: 50,
    height: 135,
    background: "#e6e6e6",
    borderLeft: "3px solid transparent",
    borderBottom: "1px solid #777",
    boxSizing: "border-box",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 18,
  },
  tabItemActive: {
    background: "#f8f8f8",
    borderLeftColor: "#2f80ed",
  },
  tabTitle: {
    writingMode: "sideways-lr",
    textOrientation: "mixed",
    transform: "rotate(180deg)",
    color: "#111",
    fontSize: 13,
    fontWeight: 600,
    whiteSpace: "nowrap",
    letterSpacing: 0.5,
    userSelect: "none",
  },
  tabClose: {
    position: "absolute",
    bottom: 5,
    left: "50%",
    transform: "translateX(-50%)",
    border: 0,
    background: "transparent",
    color: "#333",
    fontSize: 16,
    lineHeight: 1,
    cursor: "pointer",
    padding: 0,
  },
};

export default function ScrapListRightSidebar() {
  // 스크랩 목록과 제거 함수 가져오기
  const { scraps, removeScrap } = useScrapStore(
    useShallow((state) => ({
      scraps: state.scraps,
      removeScrap: state.removeScrap,
    })),
  );

  const rightPanelRef = usePanelRef();
  const rightBottomPanelRef = usePanelRef();
  const [previewIsCollapsed, setPreviewIsCollapsed] = useState(false);

  const toggleRight = () => {
    const panel = rightPanelRef.current;
    if (!panel) return;

    if (panel.isCollapsed()) {
      panel.expand();
    } else {
      panel.collapse();
    }
  };

  const toggleRightBottom = () => {
    const panel = rightBottomPanelRef.current;
    if (!panel) return;

    if (panel.isCollapsed()) {
      panel.expand();
      setPreviewIsCollapsed(false);
    } else {
      panel.collapse();
      setPreviewIsCollapsed(true);
    }
  };

  return (
    <>
      <Separator style={styles.hSeparator}>•••</Separator>

      <Panel
        id="right"
        panelRef={rightPanelRef}
        defaultSize="3 60px"
        minSize="40px"
        maxSize="540px"
        collapsible
        collapsedSize="50px"
      >
        <div style={{ height: "100%", display: "flex", overflow: "hidden" }}>
          <div id="right-nav" style={styles.rightNav}>
            <button type="button" style={styles.scrapBtn}>
              <span style={styles.scrapIcon}>[]</span>
              <span style={styles.scrapText}>
                스크랩
                <br />
                목록열기
              </span>
            </button>

            <div style={styles.topTools}>
              <button type="button" style={styles.toolBtn}>
                +
              </button>
              <button
                type="button"
                style={{ ...styles.toolBtn, ...styles.toolBtnArrow }}
              >
                ^
              </button>
            </div>

            <div style={styles.verticalTabs}>
              <div style={{ ...styles.tabItem, ...styles.tabItemActive }}>
                <div style={styles.tabTitle}>신문</div>
                <button type="button" style={styles.tabClose}>
                  x
                </button>
              </div>

              <div style={styles.tabItem}>
                <div style={styles.tabTitle}>NEWSLETTER [0]</div>
                <button type="button" style={styles.tabClose}>
                  x
                </button>
              </div>

              <div style={styles.tabItem}>
                <div style={styles.tabTitle}>스크랩 그룹 관리 [0]</div>
                <button type="button" style={styles.tabClose}>
                  x
                </button>
              </div>

              <div style={styles.tabItem}>
                <div style={styles.tabTitle}>스크랩 광고 관리 [0]</div>
                <button type="button" style={styles.tabClose}>
                  x
                </button>
              </div>
            </div>
          </div>
          <div style={styles.rightInnerWrap}>
            <Group orientation="vertical" style={{ height: "100%", flex: 1 }}>
              <Panel id="right-top" defaultSize="55%" minSize="180px">
                <section style={styles.panel}>
                  <header style={styles.header}>
                    <span style={styles.noWrap}>상단 상세 패널</span>
                  </header>

                  <div style={{ ...styles.body, ...styles.noWrap }}>
                    선택한 항목의 상세정보를 여기에 배치합니다.
                    <ul style={styles.list}>
                      <li>기본 정보</li>
                      <li>상태값</li>
                      <li>태그</li>
                      <li>미리보기</li>
                    </ul>
                  </div>

                  <section style={styles.bottomBar}>
                    <header style={styles.header}>
                      <span style={styles.noWrap}>하단 옵션 패널</span>
                      <button style={styles.button} onClick={toggleRightBottom}>
                        {previewIsCollapsed ? <Eye /> : <EyeClosed />}
                      </button>
                    </header>
                  </section>
                </section>
              </Panel>
              <Separator style={styles.vSeparator}>•••</Separator>

              <Panel
                id="right-bottom"
                panelRef={rightBottomPanelRef}
                defaultSize="45%"
                minSize="140px"
                collapsible
                onResize={() => {
                  const isCollapsed =
                    rightBottomPanelRef.current?.isCollapsed();
                  setPreviewIsCollapsed(isCollapsed ?? false);
                }}
              >
                <section style={styles.panel}>
                  <div style={{ ...styles.body, ...styles.noWrap }}>
                    필터, 설정, 로그, 메타정보처럼 보조 정보를 여기에 둘 수
                    있습니다.
                    <ul style={styles.list}>
                      <li>필터 옵션</li>
                      <li>권한 설정</li>
                      <li>로그 출력</li>
                      <li>메모 / 히스토리</li>
                    </ul>
                  </div>
                </section>
              </Panel>
            </Group>
          </div>
        </div>
      </Panel>
    </>
  );
}
