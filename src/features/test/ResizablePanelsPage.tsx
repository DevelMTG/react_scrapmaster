import {
  Group,
  Panel,
  Separator,
  usePanelRef,
} from "react-resizable-panels";

const styles = {
  app: {
    height: "100vh",
    background: "#f5f6f8",
    padding: 12,
    boxSizing: "border-box",
  },
  panel: {
    height: "100%",
    background: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: 10,
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
    width: 8,
    margin: "0 6px",
    borderRadius: 999,
    background: "#d1d5db",
    cursor: "col-resize",
  },

  // 오른쪽 내부 세로 분할용 Separator
  vSeparator: {
    height: 8,
    margin: "6px 0",
    borderRadius: 999,
    background: "#d1d5db",
    cursor: "row-resize",
  },

  button: {
    height: 32,
    padding: "0 10px",
    border: "1px solid #d1d5db",
    borderRadius: 8,
    background: "#fff",
    cursor: "pointer",
    fontSize: 13,
  },
  list: {
    margin: 0,
    paddingLeft: 18,
    lineHeight: 1.8,
  },
  rightInnerWrap: {
    height: "100%",
    minHeight: 0,
  },
};

export default function IdeLikeLayout() {
  const leftPanelRef = usePanelRef();
  const rightPanelRef = usePanelRef();
  const rightBottomPanelRef = usePanelRef();

  const toggleLeft = () => {
    const panel = leftPanelRef.current;
    if (!panel) return;

    if (panel.isCollapsed()) {
      panel.expand();
    } else {
      panel.collapse();
    }
  };

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
    } else {
      panel.collapse();
    }
  };

  return (
    <div style={styles.app}>
      <Group orientation="horizontal" style={{ height: "100%" }}>
        <Panel
          id="left"
          panelRef={leftPanelRef}
          defaultSize="280px"
          minSize="220px"
          collapsible
          collapsedSize="52px"
        >
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
        </Panel>

        <Separator style={styles.hSeparator} />

        <Panel id="center" minSize="420px">
          <section style={styles.panel}>
            <header style={styles.header}>
              <span>메인 작업영역</span>
            </header>

            <div style={styles.body}>
              메뉴를 클릭하면 이 영역에 상세 화면이나 편집기가 열린다고
              생각하시면 됩니다.
              <br />
              <br />
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

        <Separator style={styles.hSeparator} />

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
                      우측 전체 토글
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

              <Separator style={styles.vSeparator} />

              <Panel
                id="right-bottom"
                panelRef={rightBottomPanelRef}
                defaultSize="45%"
                minSize="140px"
                collapsible
                collapsedSize="44px"
              >
                <section style={styles.panel}>
                  <header style={styles.header}>
                    <span>하단 옵션 패널</span>
                    <button style={styles.button} onClick={toggleRightBottom}>
                      아래 패널 토글
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
      </Group>
    </div>
  );
}