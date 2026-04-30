import { Group, Panel, Separator, usePanelRef } from "react-resizable-panels";
import NewsLeftSidebar from "../sidebar/NewsLeftSidebar";
import KonvaPageMerge from "../../test/KonvaPageMerge";
import {
  ChevronFirst,
  ChevronLeft,
  ChevronRight,
  ChevronLast,
  UnfoldHorizontal,
  UnfoldVertical,
  RotateCw,
  Scissors,
  SquareDashed,
  Download,
  Highlighter,
  ArrowBigDownDash,
} from "lucide-react";

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

export default function NewsMain() {
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
        <section className="flex h-full flex-col">
          <header className="flex h-[48px] shrink-0 items-center border-b bg-gray-50 font-semibold">
            <div className="flex h-full items-center border-r-2 text-xs">
              <div className="relative h-full">
                <select className="h-full min-w-[120px] appearance-none border border-gray-300 bg-white px-2 py-1 pr-6">
                  <option value="종합">종합</option>
                  <option value="기획">기획</option>
                  <option value="광고">광고</option>
                  <option value="People, 사람들">People, 사람들</option>
                  <option value="People, 사람들">People, 사람들123132</option>
                </select>
                <ArrowBigDownDash
                  size={16}
                  className="absolute right-1 top-1/2 -translate-y-1/2"
                />
              </div>
              <div className="relative h-full">
                <select className="h-full min-w-[120px] appearance-none border border-gray-300 bg-white px-2 py-1 pr-6">
                  <option value="001">001면-종합</option>
                  <option value="002">002면-종합</option>
                  <option value="003">003면-종합</option>
                  <option value="004">004면-종합</option>
                  <option value="005">005면-종합</option>
                  <option value="006">006면-종합</option>
                  <option value="007">007면-종합</option>
                  <option value="008">008면-종합</option>
                  <option value="009">009면-종합</option>
                  <option value="010">010면-기획</option>
                  <option value="011">011면-광고</option>
                </select>
                <ArrowBigDownDash
                  size={16}
                  className="absolute right-1 top-1/2 -translate-y-1/2"
                />
              </div>
            </div>
            <div className="flex h-full items-center space-x-1 border-r-2 px-2">
              <button type="button" title="처음으로 이동">
                <ChevronFirst size={24} strokeWidth={3} />
              </button>
              <button type="button" title="이전으로 이동">
                <ChevronLeft size={24} strokeWidth={3} />
              </button>
              <button type="button" title="다음으로 이동">
                <ChevronRight size={24} strokeWidth={3} />
              </button>
              <button type="button" title="마지막으로 이동">
                <ChevronLast size={24} strokeWidth={3} />
              </button>
            </div>
            <div className="flex h-full items-center space-x-3 border-r-2 px-2">
              <button type="button" title="가로 방향으로 펼치기">
                <UnfoldHorizontal size={20} strokeWidth={3} />
              </button>
              <button type="button" title="세로 방향으로 펼치기">
                <UnfoldVertical size={20} strokeWidth={3} />
              </button>
              <button type="button" title="다시 불러오기">
                <RotateCw size={20} strokeWidth={3} />
              </button>
            </div>
            <div className="flex h-full items-center space-x-3 border-r-2 px-2">
              <button type="button" title="잘린 기사 스크랩">
                <Scissors size={20} strokeWidth={3} />
              </button>
              <button type="button" title="면 자르기">
                <SquareDashed size={20} strokeWidth={3} />
              </button>
              <button type="button" title="전체 지면 스크랩">
                <Download size={20} strokeWidth={3} />
              </button>
            </div>
            <div className="flex h-full items-center px-2">
              <button type="button" title="하이라이트">
                <Highlighter size={20} strokeWidth={3} />
              </button>
            </div>
          </header>

          <div className="h-full flex-auto bg-white">
            <KonvaPageMerge />
          </div>
        </section>
      </Panel>
    </>
  );
}
