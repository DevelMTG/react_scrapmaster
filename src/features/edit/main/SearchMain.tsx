import { useMemo } from "react";
import { Group, Panel, Separator, usePanelRef } from "react-resizable-panels";
import NewsLeftSidebar from "../sidebar/NewsLeftSidebar";

import { List } from "react-window";
import { AutoSizer } from "react-virtualized-auto-sizer";

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

const Row = ({ index, style, items, ariaAttributes }) => {
  const item = items[index];

  return (
    <div
      style={style}
      {...ariaAttributes}
      className="flex items-center border-b px-3"
    >
      <div>
        <div className="font-bold">{item.title}</div>
        <div className="text-sm text-gray-500">{item.description}</div>
      </div>
    </div>
  );
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
  // 2. 가상 스크롤에 뿌릴 대량의 데이터 (예: 1만 개)
  const items = useMemo(() => {
    const data = Array.from({ length: 2000 }, (_, index) => ({
      id: index + 1,
      title: `게시글 ${index + 1}`,
      description: `react-window 2.2.7 + AutoSizer 2.0.3 가상 스크롤 예제입니다.`,
    }));
    return data;
  }, []);

  return (
    <>
      <Panel
        id="left"
        panelRef={leftPanelRef}
        defaultSize="300px"
        minSize="300px"
        maxSize="400px"
        collapsible
        collapsedSize="0px"
      >
        <NewsLeftSidebar toggleLeft={toggleLeft} />
      </Panel>

      <Separator className="group cursor-col-resize outline-none">
        <div className="h-full w-[5px] bg-gray-300 transition-colors group-hover:bg-blue-300 group-data-[separator=active]:bg-blue-600" />
      </Separator>

      <Panel id="center" minSize="420px" className="w-full">
        <section className="flex h-full w-full flex-col">
          <div style={{ flex: 1, width: "100%", overflow: "hidden" }}>
            <AutoSizer
              Child={({ height, width }) => {
                return (
                  <List
                    style={{
                      height,
                      width,
                    }}
                    rowCount={items.length}
                    rowHeight={62}
                    rowComponent={Row}
                    rowProps={{ items }}
                    overscanCount={30}
                  />
                );
              }}
            />
          </div>
        </section>
      </Panel>
    </>
  );
}
