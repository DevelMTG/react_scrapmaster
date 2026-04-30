import { useState, useRef, useMemo, useCallback, useEffect } from "react";
import {
  CheckSquare2,
  Square,
  ChevronRight,
  ChevronDown,
  FileText,
} from "lucide-react";

type ColumnKey =
  | "expander"
  | "checkbox"
  | "title"
  | "media"
  | "date"
  | "page"
  | "reporter"
  | "category"
  | "size"
  | "serial";

interface ArticleItem {
  id: string;
  title: string;
  media: string;
  date: string;
  page: string;
  reporter: string;
  category: string;
  size: string;
  serial: string;
}

interface GroupItem {
  id: string;
  name: string;
  count: number;
  articles: ArticleItem[];
}

const COLUMN_CONFIG: Record<
  ColumnKey,
  { label: string; defaultWidth: number; minWidth: number }
> = {
  expander: { label: "", defaultWidth: 30, minWidth: 30 },
  checkbox: { label: "", defaultWidth: 28, minWidth: 28 },
  title: { label: "기사 제목", defaultWidth: 440, minWidth: 160 },
  media: { label: "매체명", defaultWidth: 110, minWidth: 70 },
  date: { label: "날짜", defaultWidth: 110, minWidth: 70 },
  page: { label: "지면", defaultWidth: 100, minWidth: 70 },
  reporter: { label: "기자명", defaultWidth: 110, minWidth: 70 },
  category: { label: "카테고리", defaultWidth: 110, minWidth: 70 },
  size: { label: "크기", defaultWidth: 110, minWidth: 70 },
  serial: { label: "Serial", defaultWidth: 170, minWidth: 120 },
};

const mockGroups: GroupItem[] = [
  {
    id: "newspaper",
    name: "신문",
    count: 0,
    articles: [],
  },
  {
    id: "newsletter",
    name: "NEWSLETTER",
    count: 0,
    articles: [],
  },
  {
    id: "scrap1",
    name: "스크랩 그룹 관리1",
    count: 0,
    articles: [],
  },
  {
    id: "scrap2",
    name: "스크랩 그룹 관리2",
    count: 0,
    articles: [],
  },
  {
    id: "scrap3",
    name: "스크랩 그룹 관리3",
    count: 0,
    articles: [],
  },
  {
    id: "scrap4",
    name: "스크랩 그룹 관리4",
    count: 0,
    articles: [],
  },
  {
    id: "scrap5",
    name: "스크랩 그룹 관리5",
    count: 3,
    articles: [
      {
        id: "20260428sg00001001",
        title: "K증시 '시총 6000조' 시대 열다",
        media: "세계일보",
        date: "2026-04-28",
        page: "001면",
        reporter: "김영훈 기자",
        category: "경제",
        size: "22.6 x 24.5cm",
        serial: "20260428sg00001001",
      },
      {
        id: "20260428sg00001003",
        title: "허정우 씨의… 부산 복합 숲타 올리기 候, 이광세",
        media: "세계일보",
        date: "2026-04-28",
        page: "001면",
        reporter: "워싱턴=홍주형",
        category: "경제",
        size: "22.6 x 24.5cm",
        serial: "20260428sg00001003",
      },
      {
        id: "20260428sg00002001",
        title: "충격범 '기관총 들고 와도 몰랐을 것'… 허술한",
        media: "세계일보",
        date: "2026-04-28",
        page: "002면",
        reporter: "이도형, 김나현",
        category: "경제",
        size: "22.6 x 24.5cm",
        serial: "20260428sg00002001",
      },
    ],
  },
];

interface IndeterminateCheckboxProps {
  checked: boolean;
  indeterminate: boolean;
  onChange: (checked: boolean) => void;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
}

const IndeterminateCheckbox = ({
  checked,
  indeterminate,
  onChange,
  onClick,
}: IndeterminateCheckboxProps) => {
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.indeterminate = indeterminate;
    }
  }, [indeterminate]);

  return (
    <div className="flex h-5 w-5 items-center justify-center" onClick={onClick}>
      <input
        ref={ref}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-3 w-3 cursor-pointer"
      />
    </div>
  );
};

interface HeaderCellProps {
  columnKey: ColumnKey;
  width: number;
  isResizing: boolean;
  onResizeStart: (columnKey: ColumnKey, e: React.PointerEvent<HTMLDiv>) => void;
}

const HeaderCell = ({
  columnKey,
  width,
  isResizing,
  onResizeStart,
}: HeaderCellProps) => {
  const config = COLUMN_CONFIG[columnKey];

  return (
    <div
      className="relative flex items-center border-r border-slate-300 bg-white px-1.5 text-xs font-semibold text-gray-700"
      style={{ width: `${width}px` }}
    >
      {config.label}
      {columnKey !== "expander" && columnKey !== "checkbox" && (
        <div
          className={`absolute right-0 top-0 h-full w-1.5 cursor-col-resize transition-colors ${
            isResizing ? "bg-blue-400" : "hover:bg-blue-100"
          }`}
          onPointerDown={(e) => onResizeStart(columnKey, e)}
        />
      )}
    </div>
  );
};

interface HeaderRowProps {
  columnWidths: Record<ColumnKey, number>;
  resizingColumn: ColumnKey | null;
  onResizeStart: (
    columnKey: ColumnKey,
    e: React.PointerEvent<HTMLDivElement>,
  ) => void;
}

const HeaderRow = ({
  columnWidths,
  resizingColumn,
  onResizeStart,
}: HeaderRowProps) => {
  const gridTemplate = useMemo(() => {
    const columns: string[] = [];
    (Object.keys(COLUMN_CONFIG) as ColumnKey[]).forEach((key) => {
      columns.push(`${columnWidths[key]}px`);
    });
    return columns.join(" ");
  }, [columnWidths]);

  return (
    <div
      className="flex h-[27px] flex-shrink-0 border-b border-slate-300"
      style={{ display: "grid", gridTemplateColumns: gridTemplate }}
    >
      {(Object.keys(COLUMN_CONFIG) as ColumnKey[]).map((columnKey) => (
        <HeaderCell
          key={columnKey}
          columnKey={columnKey}
          width={columnWidths[columnKey]}
          isResizing={resizingColumn === columnKey}
          onResizeStart={onResizeStart}
        />
      ))}
    </div>
  );
};

interface GroupRowProps {
  group: GroupItem;
  isSelected: boolean;
  isExpanded: boolean;
  groupChecked: boolean;
  groupIndeterminate: boolean;
  columnWidths: Record<ColumnKey, number>;
  onSelect: (groupId: string) => void;
  onExpandToggle: (groupId: string) => void;
  onCheckboxChange: (groupId: string, checked: boolean) => void;
}

const GroupRow = ({
  group,
  isSelected,
  isExpanded,
  groupChecked,
  groupIndeterminate,
  columnWidths,
  onSelect,
  onExpandToggle,
  onCheckboxChange,
}: GroupRowProps) => {
  const gridTemplate = useMemo(() => {
    const columns: string[] = [];
    (Object.keys(COLUMN_CONFIG) as ColumnKey[]).forEach((key) => {
      columns.push(`${columnWidths[key]}px`);
    });
    return columns.join(" ");
  }, [columnWidths]);

  return (
    <div
      className={`flex h-[27px] cursor-pointer select-none border-b ${
        isSelected
          ? "border-blue-600 bg-blue-500 text-white"
          : "border-gray-500 bg-gray-600 text-gray-900"
      }`}
      style={{ display: "grid", gridTemplateColumns: gridTemplate }}
      onClick={() => onSelect(group.id)}
    >
      {/* expander */}
      <div
        className={`flex items-center justify-center border-r ${
          isSelected ? "border-blue-600" : "border-gray-500"
        }`}
        onClick={(e) => {
          e.stopPropagation();
          if (group.articles.length > 0) {
            onExpandToggle(group.id);
          }
        }}
      >
        {group.articles.length > 0 && (
          <span className="text-white">
            {isExpanded ? (
              <ChevronDown size={14} />
            ) : (
              <ChevronRight size={14} />
            )}
          </span>
        )}
      </div>

      {/* checkbox */}
      <div
        className={`flex items-center justify-center border-r ${
          isSelected ? "border-blue-600" : "border-gray-500"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <IndeterminateCheckbox
          checked={groupChecked}
          indeterminate={groupIndeterminate}
          onChange={(checked) => {
            onCheckboxChange(group.id, checked);
          }}
          onClick={(e) => {
            e.stopPropagation();
          }}
        />
      </div>

      {/* title */}
      <div
        className={`flex min-w-0 items-center border-r px-1.5 ${
          isSelected ? "border-blue-600" : "border-gray-500"
        }`}
      >
        <span className="truncate font-medium">
          {group.name} [{group.count}]
        </span>
      </div>

      {/* media, date, page, reporter, category, size, serial - empty for group */}
      {(
        [
          "media",
          "date",
          "page",
          "reporter",
          "category",
          "size",
          "serial",
        ] as const
      ).map((key) => (
        <div
          key={key}
          className={`border-r ${
            isSelected ? "border-blue-600" : "border-gray-500"
          }`}
        />
      ))}
    </div>
  );
};

interface ArticleRowProps {
  article: ArticleItem;
  isChecked: boolean;
  columnWidths: Record<ColumnKey, number>;
  onSelect?: () => void;
  onCheckboxChange: (articleId: string, checked: boolean) => void;
}

const ArticleRow = ({
  article,
  isChecked,
  columnWidths,
  onSelect,
  onCheckboxChange,
}: ArticleRowProps) => {
  const gridTemplate = useMemo(() => {
    const columns: string[] = [];
    (Object.keys(COLUMN_CONFIG) as ColumnKey[]).forEach((key) => {
      columns.push(`${columnWidths[key]}px`);
    });
    return columns.join(" ");
  }, [columnWidths]);

  return (
    <div
      className="flex h-[27px] select-none border-b border-slate-300 bg-white hover:bg-slate-50"
      style={{ display: "grid", gridTemplateColumns: gridTemplate }}
      onClick={onSelect}
    >
      {/* expander - empty for article */}
      <div className="border-r border-slate-300" />

      {/* checkbox */}
      <div
        className="flex items-center justify-center border-r border-slate-300"
        onClick={(e) => e.stopPropagation()}
      >
        <IndeterminateCheckbox
          checked={isChecked}
          indeterminate={false}
          onChange={(checked) => {
            onCheckboxChange(article.id, checked);
          }}
          onClick={(e) => {
            e.stopPropagation();
          }}
        />
      </div>

      {/* title */}
      <div className="flex min-w-0 items-center gap-1.5 border-r border-slate-300 px-1.5">
        <FileText size={13} className="flex-shrink-0 text-gray-600" />
        <span className="truncate text-xs text-gray-900">{article.title}</span>
      </div>

      {/* media */}
      <div className="flex items-center border-r border-slate-300 px-1.5">
        <span className="truncate text-xs text-gray-900">{article.media}</span>
      </div>

      {/* date */}
      <div className="flex items-center border-r border-slate-300 px-1.5">
        <span className="text-xs text-gray-900">{article.date}</span>
      </div>

      {/* page */}
      <div className="flex items-center border-r border-slate-300 px-1.5">
        <span className="text-xs text-gray-900">{article.page}</span>
      </div>

      {/* reporter */}
      <div className="flex items-center border-r border-slate-300 px-1.5">
        <span className="truncate text-xs text-gray-900">
          {article.reporter}
        </span>
      </div>

      {/* category */}
      <div className="flex items-center border-r border-slate-300 px-1.5">
        <span className="truncate text-xs text-gray-900">
          {article.category}
        </span>
      </div>

      {/* size */}
      <div className="flex items-center border-r border-slate-300 px-1.5">
        <span className="truncate text-xs text-gray-900">{article.size}</span>
      </div>

      {/* serial */}
      <div className="flex items-center px-1.5">
        <span className="truncate text-xs text-gray-900">{article.serial}</span>
      </div>
    </div>
  );
};

interface ScrapGroupResizableTableProps {
  className?: string;
}

export default function ScrapGroupResizableTable({
  className = "",
}: ScrapGroupResizableTableProps) {
  const [groups, setGroups] = useState<GroupItem[]>(mockGroups);
  const [selectedGroupId, setSelectedGroupId] = useState<string>("scrap5");
  const [expandedGroupIds, setExpandedGroupIds] = useState<Set<string>>(
    new Set(["scrap5"]),
  );
  const [checkedArticleIds, setCheckedArticleIds] = useState<Set<string>>(
    new Set(["20260428sg00001001"]),
  );
  const [groupCheckboxes, setGroupCheckboxes] = useState<
    Record<string, boolean>
  >({});

  const [columnWidths, setColumnWidths] = useState<Record<ColumnKey, number>>(
    () => {
      const widths: Record<ColumnKey, number> = {} as Record<ColumnKey, number>;
      (Object.keys(COLUMN_CONFIG) as ColumnKey[]).forEach((key) => {
        widths[key] = COLUMN_CONFIG[key].defaultWidth;
      });
      return widths;
    },
  );

  const [resizingColumn, setResizingColumn] = useState<ColumnKey | null>(null);
  const resizeStartXRef = useRef<number>(0);
  const resizeStartWidthRef = useRef<number>(0);

  const handleResizeStart = useCallback(
    (columnKey: ColumnKey, e: React.PointerEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setResizingColumn(columnKey);
      resizeStartXRef.current = e.clientX;
      resizeStartWidthRef.current = columnWidths[columnKey];

      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";

      const handlePointerMove = (moveEvent: PointerEvent) => {
        const delta = moveEvent.clientX - resizeStartXRef.current;
        const newWidth = Math.max(
          COLUMN_CONFIG[columnKey].minWidth,
          resizeStartWidthRef.current + delta,
        );
        setColumnWidths((prev) => ({
          ...prev,
          [columnKey]: newWidth,
        }));
      };

      const handlePointerUp = () => {
        document.removeEventListener("pointermove", handlePointerMove);
        document.removeEventListener("pointerup", handlePointerUp);
        document.body.style.cursor = "default";
        document.body.style.userSelect = "auto";
        setResizingColumn(null);
      };

      document.addEventListener("pointermove", handlePointerMove);
      document.addEventListener("pointerup", handlePointerUp);
    },
    [columnWidths],
  );

  const handleGroupSelect = (groupId: string) => {
    setSelectedGroupId(groupId);
  };

  const handleExpandToggle = (groupId: string) => {
    setExpandedGroupIds((prev) => {
      const updated = new Set(prev);
      if (updated.has(groupId)) {
        updated.delete(groupId);
      } else {
        updated.add(groupId);
      }
      return updated;
    });
  };

  const handleGroupCheckboxChange = (groupId: string, checked: boolean) => {
    const group = groups.find((g) => g.id === groupId);
    if (!group) return;

    if (checked) {
      const newIds = new Set(checkedArticleIds);
      group.articles.forEach((article) => {
        newIds.add(article.id);
      });
      setCheckedArticleIds(newIds);
    } else {
      const newIds = new Set(checkedArticleIds);
      group.articles.forEach((article) => {
        newIds.delete(article.id);
      });
      setCheckedArticleIds(newIds);
    }

    setGroupCheckboxes((prev) => ({
      ...prev,
      [groupId]: checked,
    }));
  };

  const handleArticleCheckboxChange = (articleId: string, checked: boolean) => {
    setCheckedArticleIds((prev) => {
      const updated = new Set(prev);
      if (checked) {
        updated.add(articleId);
      } else {
        updated.delete(articleId);
      }
      return updated;
    });
  };

  const getGroupCheckState = (group: GroupItem) => {
    if (group.articles.length === 0) {
      return {
        checked: groupCheckboxes[group.id] ?? false,
        indeterminate: false,
      };
    }

    const allChecked = group.articles.every((article) =>
      checkedArticleIds.has(article.id),
    );
    const someChecked = group.articles.some((article) =>
      checkedArticleIds.has(article.id),
    );

    return {
      checked: allChecked,
      indeterminate: someChecked && !allChecked,
    };
  };

  return (
    <div
      className={`flex h-full w-max min-w-full flex-col overflow-hidden border border-slate-400 bg-gray-100 ${className}`}
    >
      {/* Header */}
      <HeaderRow
        columnWidths={columnWidths}
        resizingColumn={resizingColumn}
        onResizeStart={handleResizeStart}
      />

      {/* Body */}
      <div className="flex-1 overflow-x-auto overflow-y-auto">
        {groups.map((group) => (
          <div key={group.id}>
            <GroupRow
              group={group}
              isSelected={selectedGroupId === group.id}
              isExpanded={expandedGroupIds.has(group.id)}
              groupChecked={getGroupCheckState(group).checked}
              groupIndeterminate={getGroupCheckState(group).indeterminate}
              columnWidths={columnWidths}
              onSelect={handleGroupSelect}
              onExpandToggle={handleExpandToggle}
              onCheckboxChange={handleGroupCheckboxChange}
            />
            {expandedGroupIds.has(group.id) &&
              group.articles.map((article) => (
                <ArticleRow
                  key={article.id}
                  article={article}
                  isChecked={checkedArticleIds.has(article.id)}
                  columnWidths={columnWidths}
                  onCheckboxChange={handleArticleCheckboxChange}
                />
              ))}
          </div>
        ))}
      </div>
    </div>
  );
}
