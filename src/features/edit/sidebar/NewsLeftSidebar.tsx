import React, { useState } from "react";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  PanelLeftClose,
} from "lucide-react";

const mediaTree = [
  {
    id: "print",
    label: "지면",
    children: [
      {
        id: "daily",
        label: "중앙일간지",
        children: [
          { id: "joongang", label: "중앙일보" },
          { id: "donga", label: "동아일보" },
          { id: "chosun", label: "조선일보" },
        ],
      },
      {
        id: "evening",
        label: "중앙석간지",
        children: [
          { id: "seoul", label: "서울신문" },
          { id: "maeil", label: "매일일보" },
        ],
      },
    ],
  },
  {
    id: "digital",
    label: "디지털",
    children: [
      {
        id: "portal",
        label: "포털",
        children: [
          { id: "naver", label: "네이버뉴스" },
          { id: "daum", label: "다음뉴스" },
        ],
      },
    ],
  },
];

const articlePages = [
  {
    id: "p001",
    title: "001면",
    articles: [
      { id: "a001", title: "정치 톱 기사" },
      { id: "a002", title: "경제 요약" },
      { id: "a003", title: "국제 이슈" },
    ],
  },
  {
    id: "p002",
    title: "002면",
    articles: [
      { id: "a004", title: "사회 주요 뉴스" },
      { id: "a005", title: "산업 동향" },
    ],
  },
];

const WEEK_LABELS = ["일", "월", "화", "수", "목", "금", "토"];

const formatDateInput = (date) => {
  const pad = (value) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
};

const addDays = (dateString, diff) => {
  const next = new Date(dateString);
  next.setDate(next.getDate() + diff);
  return formatDateInput(next);
};

const parseDateInput = (dateString) => {
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(year, month - 1, day);
};

const buildCalendarCells = (monthDate) => {
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const startWeekday = firstDay.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const cells = [];
  for (let i = 0; i < 42; i += 1) {
    const dayIndex = i - startWeekday + 1;
    if (dayIndex <= 0) {
      const date = new Date(year, month - 1, daysInPrevMonth + dayIndex);
      cells.push({ date, inMonth: false });
    } else if (dayIndex > daysInMonth) {
      const date = new Date(year, month + 1, dayIndex - daysInMonth);
      cells.push({ date, inMonth: false });
    } else {
      const date = new Date(year, month, dayIndex);
      cells.push({ date, inMonth: true });
    }
  }

  return cells;
};

const filterMediaTree = (items, keyword) => {
  if (!keyword) return items;

  const lower = keyword.toLowerCase();

  return items
    .map((item) => {
      const matches = item.label.toLowerCase().includes(lower);
      const children = item.children
        ? filterMediaTree(item.children, keyword)
        : [];
      if (matches || children.length) {
        return { ...item, children };
      }
      return null;
    })
    .filter(Boolean);
};

const getPageSelectionState = (page, selectedMap) => {
  const selectedCount = page.articles.filter(
    (article) => selectedMap[article.id],
  ).length;
  if (selectedCount === 0) {
    return { checked: false, indeterminate: false };
  }
  if (selectedCount === page.articles.length) {
    return { checked: true, indeterminate: false };
  }
  return { checked: false, indeterminate: true };
};

export default function NewsLeftSidebar({ toggleLeft = () => {} }) {
  const [expandedPanels, setExpandedPanels] = useState([]);
  const [selectedDate, setSelectedDate] = useState(formatDateInput(new Date()));
  const [calendarMonth, setCalendarMonth] = useState(
    parseDateInput(formatDateInput(new Date())),
  );
  const [mediaFilter, setMediaFilter] = useState("");
  const [selectedArticles, setSelectedArticles] = useState({});

  const isDateOpen = expandedPanels.includes("date");
  const filteredMedia = filterMediaTree(mediaTree, mediaFilter);

  const handlePanelToggle = (panel) => () => {
    setExpandedPanels((prev) =>
      prev.includes(panel)
        ? prev.filter((item) => item !== panel)
        : [...prev, panel],
    );
  };

  const handleArticleToggle = (articleId) => {
    setSelectedArticles((prev) => ({
      ...prev,
      [articleId]: !prev[articleId],
    }));
  };

  const handlePageToggle = (page) => {
    const { checked } = getPageSelectionState(page, selectedArticles);
    setSelectedArticles((prev) => {
      const next = { ...prev };
      page.articles.forEach((article) => {
        next[article.id] = !checked;
      });
      return next;
    });
  };

  const shiftSelectedDate = (diff) => {
    setSelectedDate((prev) => {
      const next = addDays(prev, diff);
      const nextDate = parseDateInput(next);
      setCalendarMonth(
        new Date(nextDate.getFullYear(), nextDate.getMonth(), 1),
      );
      return next;
    });
  };

  const handleDateSelect = (date) => {
    const next = formatDateInput(date);
    setSelectedDate(next);
    setCalendarMonth(new Date(date.getFullYear(), date.getMonth(), 1));
  };

  const renderMediaNodes = (items, depth = 0) => (
    <div className="space-y-1">
      {items.map((item) => {
        const id = `media-${item.id}`;
        const hasChildren = Boolean(item.children?.length);
        const isOpen = expandedPanels.includes(id);
        const paddingLeft = depth * 12;

        if (!hasChildren) {
          return (
            <div
              key={item.id}
              className="ml-2 border-l border-gray-200 py-1"
              style={{ paddingLeft: paddingLeft + 12 }}
            >
              <span className="text-[14px] text-gray-800">{item.label}</span>
            </div>
          );
        }

        return (
          <div key={item.id} className="ml-2 border-l border-gray-200">
            <div
              role="button"
              tabIndex={0}
              onClick={handlePanelToggle(id)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  handlePanelToggle(id)();
                }
              }}
              className="flex cursor-pointer select-none items-center gap-2 py-1"
              style={{ paddingLeft }}
            >
              <ChevronDown
                size={16}
                className={`transition-transform ${isOpen ? "rotate-0" : "-rotate-90"}`}
              />
              <span
                className={
                  depth === 0
                    ? "text-[16px] font-bold text-gray-900"
                    : "text-[14px] font-bold text-gray-900"
                }
              >
                {item.label}
              </span>
            </div>
            {isOpen && (
              <div className="pl-3">
                {renderMediaNodes(item.children, depth + 1)}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );

  return (
    <section className="flex h-full flex-col overflow-hidden bg-white">
      <header className="flex h-[48px] shrink-0 items-center justify-between border-b border-gray-200 bg-gray-50 px-3 font-semibold">
        <span className="text-[16px]">뉴스</span>
        <button
          type="button"
          onClick={toggleLeft}
          className="rounded p-1 hover:bg-gray-100"
        >
          <PanelLeftClose size={18} />
        </button>
      </header>

      <div className="flex-1 space-y-3 overflow-auto p-3">
        <div className="rounded border border-gray-200">
          <div
            role="button"
            tabIndex={0}
            onClick={handlePanelToggle("date")}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                handlePanelToggle("date")();
              }
            }}
            className="flex cursor-pointer select-none items-center justify-between px-3 py-2"
          >
            <div className="flex items-center gap-2">
              <ChevronDown
                size={18}
                className={`transition-transform ${isDateOpen ? "rotate-0" : "-rotate-90"}`}
              />
              <span className="text-[16px] font-bold">날짜 선택</span>
            </div>
            {!isDateOpen && (
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    shiftSelectedDate(-1);
                  }}
                  className="p-1 text-gray-500 hover:text-gray-800"
                >
                  <ChevronLeft size={16} />
                </button>
                <span className="min-w-[86px] text-[14px] text-gray-700">
                  {selectedDate}
                </span>
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    shiftSelectedDate(1);
                  }}
                  className="p-1 text-gray-500 hover:text-gray-800"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </div>
          {isDateOpen && (
            <div className="space-y-3 border-t border-gray-200 p-3">
              <span className="text-[12px] text-gray-500">
                날짜를 클릭해 선택하세요.
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setCalendarMonth(
                      (prev) =>
                        new Date(prev.getFullYear(), prev.getMonth() - 1, 1),
                    )
                  }
                  className="p-1 text-gray-500 hover:text-gray-800"
                >
                  <ChevronLeft size={16} />
                </button>
                <span className="text-[14px] font-semibold text-gray-800">
                  {calendarMonth.getFullYear()}년 {calendarMonth.getMonth() + 1}
                  월
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setCalendarMonth(
                      (prev) =>
                        new Date(prev.getFullYear(), prev.getMonth() + 1, 1),
                    )
                  }
                  className="p-1 text-gray-500 hover:text-gray-800"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
              <div className="grid grid-cols-7 gap-2">
                {WEEK_LABELS.map((label) => (
                  <span
                    key={label}
                    className="text-center text-[12px] text-gray-500"
                  >
                    {label}
                  </span>
                ))}
                {buildCalendarCells(calendarMonth).map((cell) => {
                  const cellKey = `${cell.date.toISOString()}-${cell.inMonth}`;
                  const cellValue = formatDateInput(cell.date);
                  const isSelected = cellValue === selectedDate;

                  return (
                    <button
                      key={cellKey}
                      type="button"
                      onClick={() => handleDateSelect(cell.date)}
                      className={`h-8 rounded border text-[14px] transition-colors ${
                        isSelected
                          ? "border-blue-300 bg-blue-50 font-bold text-blue-700"
                          : "border-transparent hover:border-gray-200"
                      } ${cell.inMonth ? "text-gray-800" : "text-gray-300"}`}
                    >
                      {cell.date.getDate()}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className="rounded border border-gray-200">
          <div
            role="button"
            tabIndex={0}
            onClick={handlePanelToggle("media")}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                handlePanelToggle("media")();
              }
            }}
            className="flex cursor-pointer select-none items-center justify-between px-3 py-2"
          >
            <div className="flex items-center gap-2">
              <ChevronDown
                size={18}
                className={`transition-transform ${
                  expandedPanels.includes("media") ? "rotate-0" : "-rotate-90"
                }`}
              />
              <span className="text-[16px] font-bold">매체사 선택</span>
            </div>
          </div>
          {expandedPanels.includes("media") && (
            <div className="space-y-3 border-t border-gray-200 p-3">
              <input
                type="text"
                placeholder="매체사 필터"
                value={mediaFilter}
                onChange={(event) => setMediaFilter(event.target.value)}
                className="w-full rounded border border-gray-200 px-2 py-1 text-[14px]"
              />
              {filteredMedia.length ? (
                renderMediaNodes(filteredMedia)
              ) : (
                <span className="text-[14px] text-gray-500">
                  검색 결과가 없습니다.
                </span>
              )}
            </div>
          )}
        </div>

        <div className="rounded border border-gray-200">
          <div
            role="button"
            tabIndex={0}
            onClick={handlePanelToggle("articles")}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                handlePanelToggle("articles")();
              }
            }}
            className="flex cursor-pointer select-none items-center justify-between px-3 py-2"
          >
            <div className="flex items-center gap-2">
              <ChevronDown
                size={18}
                className={`transition-transform ${
                  expandedPanels.includes("articles")
                    ? "rotate-0"
                    : "-rotate-90"
                }`}
              />
              <span className="text-[16px] font-bold">기사 선택</span>
            </div>
          </div>
          {expandedPanels.includes("articles") && (
            <div className="space-y-3 border-t border-gray-200 p-3">
              {articlePages.map((page) => {
                const { checked, indeterminate } = getPageSelectionState(
                  page,
                  selectedArticles,
                );
                const pageId = `page-${page.id}`;
                const isPageOpen = expandedPanels.includes(pageId);

                return (
                  <div key={page.id} className="rounded border border-gray-200">
                    <div
                      role="button"
                      tabIndex={0}
                      onClick={handlePanelToggle(pageId)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          handlePanelToggle(pageId)();
                        }
                      }}
                      className="flex cursor-pointer select-none items-center gap-2 px-3 py-2"
                    >
                      <ChevronDown
                        size={16}
                        className={`transition-transform ${isPageOpen ? "rotate-0" : "-rotate-90"}`}
                      />
                      <input
                        type="checkbox"
                        checked={checked}
                        ref={(node) => {
                          if (node) {
                            node.indeterminate = indeterminate;
                          }
                        }}
                        onClick={(event) => event.stopPropagation()}
                        onChange={(event) => {
                          event.stopPropagation();
                          handlePageToggle(page);
                        }}
                      />
                      <span className="text-[16px] font-bold">
                        {page.title}
                      </span>
                    </div>
                    {isPageOpen && (
                      <div className="space-y-2 border-t border-gray-200 px-6 py-2">
                        {page.articles.map((article) => (
                          <label
                            key={article.id}
                            className="flex items-center gap-2 border-b border-dashed border-gray-200 pb-1 last:border-b-0"
                          >
                            <input
                              type="checkbox"
                              checked={Boolean(selectedArticles[article.id])}
                              onChange={() => handleArticleToggle(article.id)}
                            />
                            <span className="text-[14px] text-gray-800">
                              {article.title}
                            </span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
