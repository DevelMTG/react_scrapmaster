import { useState, useRef } from "react";
import {
  Eye,
  EyeClosed,
  Menu,
  Plus,
  ChevronUp,
  ChevronDown,
  X,
  CheckSquare2,
  Minus,
  Trash2,
  ChevronsUp,
  ChevronsDown,
  FileSpreadsheet,
} from "lucide-react";
// import "./styles/scrap-list-menu.css";
import { usePanelRef, Panel, Separator, Group } from "react-resizable-panels";
import styles from "./ScrapListRightSidebar.module.css";
import ScrapGroupResizableTable from "./ScrapGroupResizableTable";

const inlineStyles: Record<string, any> = {
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
    height: 52,
    flexShrink: 0,
    marginTop: "auto",
    borderTop: "1px solid #e5e7eb",
    background: "#ffffff",
  },
  scrapSelectBtn: {
    height: 40,
    padding: "0 10px",
    border: "1px solid #d1d5db",
    background: "#fff",
    cursor: "pointer",
    fontSize: 12,
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
  },
};

// 탭 데이터
const tabsInitialData = [
  { id: 1, label: "신문" },
  { id: 2, label: "NEWSLETTER" },
  { id: 3, label: "스크랩 그룹" },
  { id: 4, label: "광고 관리" },
  { id: 5, label: "스크랩 그룹 관리1" },
  { id: 6, label: "스크랩 그룹 관리2" },
  { id: 7, label: "스크랩 그룹 관리3" },
  { id: 8, label: "스크랩 그룹 관리4214223142241" },
];

interface ToolbarButtonProps {
  icon: React.ReactNode;
  title?: string;
  onClick?: () => void;
  disabled?: boolean;
}

const ToolbarButton = ({
  icon,
  title,
  onClick,
  disabled,
}: ToolbarButtonProps) => (
  <button
    type="button"
    title={title}
    onClick={onClick}
    disabled={disabled}
    className="inline-flex h-7 w-7 items-center justify-center transition-colors hover:border hover:border-blue-300 hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-50"
  >
    {icon}
  </button>
);

const ToolbarSeparator = () => <div className="mx-0.5 h-5 w-px bg-gray-400" />;

export default function ScrapListRightSidebar() {
  const rightPanelRef = usePanelRef();
  const rightBottomPanelRef = usePanelRef();
  const [previewIsCollapsed, setPreviewIsCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState(1);
  const [tabs, setTabs] = useState(tabsInitialData);

  const rightNavRef = useRef(null);

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

  const toggleRightMenu = () => {
    const panel = rightPanelRef.current;
    if (!panel) return;

    if (panel.isCollapsed()) {
      panel.expand();
      setPreviewIsCollapsed(false);
    } else {
      panel.collapse();
      setPreviewIsCollapsed(true);
    }
  };

  const handleTabSelect = (tabId: number) => {
    setActiveTab(tabId);
  };

  const handleTabClose = (tabId: number) => {
    const newTabs = tabs.filter((tab) => tab.id !== tabId);
    setTabs(newTabs);

    if (activeTab === tabId) {
      if (newTabs.length > 0) {
        setActiveTab(newTabs[0].id);
      }
    }
  };

  return (
    <>
      <Separator className="group cursor-col-resize outline-none">
        <div className="h-full w-[5px] bg-gray-300 transition-colors group-hover:bg-blue-300 group-data-[separator=active]:bg-blue-600" />
      </Separator>

      <Panel
        id="right"
        panelRef={rightPanelRef}
        defaultSize="360px"
        minSize="50px"
        maxSize="80%"
        collapsible
        collapsedSize="50px"
      >
        <div style={{ height: "100%", display: "flex", overflow: "hidden" }}>
          <nav id="right-nav" className={styles.rightNav}>
            <button
              type="button"
              className={styles.scrapBtn}
              title="스크랩 목록 열기"
              onClick={toggleRightMenu}
            >
              <span className={styles.scrapIcon}>
                <Menu size={20} />
              </span>
              <span className={styles.scrapText}>
                스크랩
                <br />
                목록열기
              </span>
            </button>

            <div className={styles.topTools}>
              <button type="button" className={styles.toolBtn} title="추가">
                <Plus size={16} />
              </button>
              <button
                type="button"
                className={styles.toolBtn}
                title="스크랩 목록 올리기"
                onClick={() => {
                  const nav = rightNavRef.current;
                  if (!nav) return;
                  nav.scrollBy({ top: -100, behavior: "smooth" });
                }}
              >
                <ChevronUp size={16} />
              </button>
            </div>

            <ul className={styles.tabList} ref={rightNavRef}>
              {tabs.map((tab) => (
                <li
                  key={tab.id}
                  className={`${styles.tabItem} ${
                    activeTab === tab.id ? styles.active : ""
                  }`}
                  onClick={() => handleTabSelect(tab.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      handleTabSelect(tab.id);
                    }
                  }}
                >
                  <span className={styles.tabTitle}>{tab.label}</span>
                  <button
                    type="button"
                    className={styles.tabClose}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTabClose(tab.id);
                    }}
                    title="닫기"
                    aria-label={`${tab.label} 닫기`}
                  >
                    <X size={14} />
                  </button>
                </li>
              ))}
            </ul>

            <div className={styles.topTools}>
              <button
                type="button"
                className={styles.toolBtn}
                title="스크랩 목록 내리기"
                onClick={() => {
                  const nav = rightNavRef.current;
                  if (!nav) return;
                  nav.scrollBy({ top: 100, behavior: "smooth" });
                }}
              >
                <ChevronDown size={16} />
              </button>
            </div>
          </nav>
          <div className="w-full flex-auto" style={inlineStyles.rightInnerWrap}>
            <Group orientation="vertical" style={{ height: "100%", flex: 1 }}>
              <Panel id="right-top" defaultSize="55%" minSize="180px">
                <section style={inlineStyles.panel}>
                  <header style={inlineStyles.header}>
                    <span style={inlineStyles.noWrap}>스크랩 목록</span>
                    <div className="flex"></div>
                  </header>

                  {/* 상단 툴바 */}
                  <div className="flex h-8 flex-shrink-0 items-center gap-0.5 border-b border-t border-gray-400 bg-gray-200 px-1">
                    <ToolbarButton
                      icon={<CheckSquare2 size={16} />}
                      title="선택"
                    />
                    <ToolbarButton
                      icon={<Minus size={16} />}
                      title="체크 해제"
                    />
                    <ToolbarButton icon={<Trash2 size={16} />} title="삭제" />
                    <ToolbarSeparator />
                    <ToolbarButton
                      icon={<ChevronsUp size={16} />}
                      title="맨 위로"
                    />
                    <ToolbarButton
                      icon={<ChevronUp size={16} />}
                      title="위로"
                    />
                    <ToolbarButton
                      icon={<ChevronDown size={16} />}
                      title="아래로"
                    />
                    <ToolbarButton
                      icon={<ChevronsDown size={16} />}
                      title="맨 아래로"
                    />
                    <ToolbarSeparator />
                    <ToolbarButton
                      icon={<FileSpreadsheet size={16} />}
                      title="Excel 내보내기"
                    />
                  </div>

                  <div
                    id="right-top-body"
                    className="h-full w-0 min-w-full flex-auto overflow-auto"
                  >
                    <ScrapGroupResizableTable />
                  </div>

                  <div
                    style={inlineStyles.bottomBar}
                    className="flex h-6 items-center justify-end px-3 py-0"
                  >
                    <div className="mr-auto flex items-center gap-1 text-xs text-gray-500">
                      <button type="button" style={inlineStyles.scrapSelectBtn}>
                        전체
                        <br />
                        선택
                      </button>
                      <button type="button" style={inlineStyles.scrapSelectBtn}>
                        선택
                        <br />
                        해제
                      </button>
                      <button type="button" style={inlineStyles.scrapSelectBtn}>
                        선택
                        <br />
                        삭제
                      </button>
                    </div>
                    <div className="flex items-center">
                      <button
                        style={inlineStyles.button}
                        onClick={toggleRightBottom}
                      >
                        {previewIsCollapsed ? <Eye /> : <EyeClosed />}
                      </button>
                    </div>
                  </div>
                </section>
              </Panel>

              <Separator className="group cursor-col-resize outline-none">
                <div className="h-[5px] w-full bg-gray-300 transition-colors group-hover:bg-blue-300 group-data-[separator=active]:bg-blue-600" />
              </Separator>

              <Panel
                id="right-bottom"
                panelRef={rightBottomPanelRef}
                defaultSize="25%"
                minSize="140px"
                maxSize="60%"
                collapsible
                onResize={() => {
                  const isCollapsed =
                    rightBottomPanelRef.current?.isCollapsed();
                  setPreviewIsCollapsed(isCollapsed ?? false);
                }}
              >
                <section style={inlineStyles.panel}>
                  <div style={inlineStyles.body}></div>
                </section>
              </Panel>
            </Group>
          </div>
        </div>
      </Panel>
    </>
  );
}
