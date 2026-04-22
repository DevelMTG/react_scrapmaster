import { useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { useScrapStore } from "../../../store/edit/useScrapStore";
import { 
  Trash2, 
  PanelRightClose, 
  Eye,
  EyeClosed } from "lucide-react";
// import "./styles/scrap-list-menu.css";
import { 
  usePanelRef,
  Panel,
  Separator,
  Group,
} from "react-resizable-panels";

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
  list: {
    margin: 0,
    paddingLeft: 18,
    lineHeight: 1.8,
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
  },
};

export default function ScrapListRightSidebar() {
  // 스크랩 목록과 제거 함수 가져오기
  const { scraps, removeScrap } = useScrapStore(
    useShallow((state) => ({
      scraps: state.scraps,
      removeScrap: state.removeScrap,
    }))
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
        defaultSize="360px"
        minSize="260px"
        collapsible
        collapsedSize="52px"
      >
        <div style={styles.rightInnerWrap}>
          <Group orientation="vertical" style={{ height: "100%" }}>
            <Panel
              id="right-top"
              defaultSize="55%"
              minSize="180px"
            >
              <section style={styles.panel}>
                <header style={styles.header}>
                  <span>상단 상세 패널</span>
                  <button style={styles.button} onClick={toggleRight}>
                    <PanelRightClose />
                  </button>
                </header>

                <div style={styles.body}>
                  선택한 항목의 상세정보를 여기에 배치합니다.
                  <ul style={styles.list}>
                    <li>기본 정보</li>
                    <li>상태값</li>
                    <li>태그</li>
                    <li>미리보기</li>
                  </ul>
                </div>
              </section>
            </Panel>

            <Separator style={styles.vSeparator}>•••</Separator>

            <Panel
              id="right-bottom"
              panelRef={rightBottomPanelRef}
              defaultSize="45%"
              minSize="140px"
              collapsedSize="44px"
              collapsible
              onResize={() => {
                const isCollapsed = rightBottomPanelRef.current?.isCollapsed();
                setPreviewIsCollapsed(isCollapsed ?? false);
              }}  
            >
              <section style={styles.panel}>
                <header style={styles.header}>
                  <span>하단 옵션 패널</span>
                  <button style={styles.button} onClick={toggleRightBottom}>
                    {previewIsCollapsed ? <Eye /> : <EyeClosed />}
                  </button>
                </header>

                <div style={styles.body}>
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
      </Panel>
    </>
  );
}