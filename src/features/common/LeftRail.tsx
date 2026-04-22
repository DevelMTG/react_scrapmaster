import { useMemo } from "react";
import {
  Code2,
  Files,
  Search,
  BrainCircuit,
  ChartNoAxesCombined,
  Boxes,
  ShieldAlert,
  Bell,
  Settings,
  User,
} from "lucide-react";
import "../../styles/LeftRail.css";

function RailButton({ item, active, onItemClick }) {
  const Icon = item.icon;

  return (
    <button
      type="button"
      className={`rail-button ${active ? "is-active" : ""}`}
      aria-label={item.label}
      aria-pressed={active}
      title={item.label}
      onClick={(e) => onItemClick(item, e)}
    >
      <Icon className="rail-button__icon" strokeWidth={1.9} />

      {/* {item.badge?.type === "count" && (
        <span className="rail-badge rail-badge--count">
          {item.badge.value}
        </span>
      )}

      {item.badge?.type === "warning" && (
        <span className="rail-badge rail-badge--warning">!</span>
      )} */}
    </button>
  );
}

export default function LeftRail({
  activeId = "news",
  onItemClick = () => {},
}) {
  const mainItems = useMemo(
    () => [
      { id: "news", label: "뉴스", icon: Files },
      { id: "search", label: "검색", icon: Search },
      {
        id: "premium",
        label: "프리미엄",
        icon: ChartNoAxesCombined,
        // badge: { type: "warning" },
      },
      {
        id: "analysis",
        label: "분석",
        icon: BrainCircuit,
        //badge: { type: "count", value: 1 },
      },
      { id: "issues", label: "이슈", icon: ShieldAlert },
    ],
    []
  );

  const bottomItems = useMemo(
    () => [
      {
        id: "notifications",
        label: "알림",
        icon: Bell,
        badge: { type: "count", value: 9 },
      },
      { id: "settings", label: "설정", icon: Settings },
      { id: "account", label: "계정", icon: User },
    ],
    []
  );

  return (
    <aside className="left-rail" aria-label="좌측 작업 메뉴">
      <button
        type="button"
        className="rail-brand"
        aria-label="워크스페이스 홈"
        title="워크스페이스 홈"
      >
        <Code2 className="rail-brand__icon" strokeWidth={2} />
      </button>

      <nav className="rail-nav" aria-label="주요 메뉴">
        {mainItems.map((item) => (
          <RailButton
            key={item.id}
            item={item}
            active={activeId === item.id}
            onItemClick={onItemClick}
          />
        ))}
      </nav>

      <div className="rail-spacer" />

      <nav className="rail-nav rail-nav--bottom" aria-label="보조 메뉴">
        {bottomItems.map((item) => (
          <RailButton
            key={item.id}
            item={item}
            active={activeId === item.id}
            onItemClick={onItemClick}
          />
        ))}
      </nav>
    </aside>
  );
}