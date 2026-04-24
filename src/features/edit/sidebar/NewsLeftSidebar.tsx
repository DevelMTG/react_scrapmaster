import React, { useState } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Checkbox,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
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

const FONT = {
  menu: 16,
  item: 14,
};

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
  const selectedCount = page.articles.filter((article) => selectedMap[article.id]).length;
  if (selectedCount === 0) {
    return { checked: false, indeterminate: false };
  }
  if (selectedCount === page.articles.length) {
    return { checked: true, indeterminate: false };
  }
  return { checked: false, indeterminate: true };
};

export default function NewsLeftSidebar({
  toggleLeft = () => {},
}) {
  const [expandedPanels, setExpandedPanels] = useState([]);
  const [selectedDate, setSelectedDate] = useState(
    formatDateInput(new Date())
  );
  const [calendarMonth, setCalendarMonth] = useState(
    parseDateInput(formatDateInput(new Date()))
  );
  const [mediaFilter, setMediaFilter] = useState("");
  const [selectedArticles, setSelectedArticles] = useState({});

  const isDateOpen = expandedPanels.includes("date");
  const filteredMedia = filterMediaTree(mediaTree, mediaFilter);

  const handlePanelToggle = (panel) => () => {
    setExpandedPanels((prev) =>
      prev.includes(panel)
        ? prev.filter((item) => item !== panel)
        : [...prev, panel]
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
      setCalendarMonth(new Date(nextDate.getFullYear(), nextDate.getMonth(), 1));
      return next;
    });
  };

  const handleDateSelect = (date) => {
    const next = formatDateInput(date);
    setSelectedDate(next);
    setCalendarMonth(new Date(date.getFullYear(), date.getMonth(), 1));
  };

  const renderAccordionSummary = (label, isTopLevel) => (
    <Typography
      sx={{
        fontSize: isTopLevel ? FONT.menu : FONT.item,
        fontWeight: isTopLevel ? 700 : 400,
      }}
    >
      {label}
    </Typography>
  );

  const renderMediaNodes = (items, depth = 0) => (
    // 단위가 px 단위가 아님을 기억하자 pl:1 준다고 1px이 아니다. 1 = 8px을 의미한다. 디자인 공식의 4,8,16 단위를 차용한것 같다.
    <Box>
      {items.map((item) => {
        const id = `media-${item.id}`;
        const hasChildren = Boolean(item.children?.length);

        if (!hasChildren) {
          return (
            <Box key={item.id} sx={{ pl: 1, py: 0.5 }}>
              {renderAccordionSummary(item.label, false)}
            </Box>
          );
        }

        return (
          <Accordion
            key={item.id}
            expanded={expandedPanels.includes(id)}
            onChange={handlePanelToggle(id)}
            disableGutters
            elevation={0}
            square
            sx={{
              backgroundColor: "transparent",
              "&:before": { display: "none" },
            }}
          >
            <AccordionSummary
              expandIcon={<ChevronDown size={16} />}
              sx={{
                px: 0,
                minHeight: 0,
                pl: 0,
                flexDirection: "row-reverse",
                "& .MuiAccordionSummary-content": {
                  margin: "6px 0",
                },
                "& .MuiAccordionSummary-expandIconWrapper": {
                  mr: 1,
                },
              }}
            >
              {renderAccordionSummary(item.label, depth === 0)}
            </AccordionSummary>
            <AccordionDetails sx={{ pt: 0, pb: 0.5, pl: 2 }}>
              {renderMediaNodes(item.children, depth + 1)}
            </AccordionDetails>
          </Accordion>
        );
      })}
    </Box>
  );

  const renderMediaList = (items, depth = 0) => (
    <List dense disablePadding>
      {items.map((item) => (
        <Box key={item.id} sx={{ pl: depth * 2 }}>
          <ListItem disableGutters>
            <ListItemText
              primary={item.label}
              primaryTypographyProps={{ variant: "body2" }}
            />
          </ListItem>
          {item.children?.length
            ? renderMediaList(item.children, depth + 1)
            : null}
        </Box>
      ))}
    </List>
  );

  return (
    <Box
      component="section"
      sx={{
        height: "100%",
        backgroundColor: "#ffffff",
        border: "1px solid #e5e7eb",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        component="header"
        sx={{
          height: 48,
          px: 1.5,
          borderBottom: "1px solid #e5e7eb",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontWeight: 600,
          backgroundColor: "#fafafa",
          flexShrink: 0,
        }}
      >
        <Typography variant="subtitle1">뉴스</Typography>
        <IconButton size="small" onClick={toggleLeft}>
          <PanelLeftClose size={18} />
        </IconButton>
      </Box>

      <Box sx={{ flex: 1, p: 1.5, overflow: "auto" }}>
        <Accordion
          expanded={expandedPanels.includes("date")}
          onChange={handlePanelToggle("date")}
          disableGutters
          elevation={0}
          square
          sx={{
            backgroundColor: "transparent",
            "&:before": { display: "none" },
          }}
        >
          <AccordionSummary
            expandIcon={<ChevronDown size={18} />}
            sx={{
              px: 0,
              minHeight: 0,
              flexDirection: "row-reverse",
              "& .MuiAccordionSummary-content": {
                margin: "6px 0",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              },
              "& .MuiAccordionSummary-expandIconWrapper": {
                mr: 1,
              },
            }}
          >
            <Typography sx={{ fontSize: FONT.menu, fontWeight: 700 }}>
              날짜 선택
            </Typography>
            {!isDateOpen && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <Box
                  component="span"
                  role="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    shiftSelectedDate(-1);
                  }}
                  sx={{
                    display: "inline-flex",
                    p: 0.5,
                    cursor: "pointer",
                    color: "text.secondary",
                  }}
                >
                  <ChevronLeft size={16} />
                </Box>
                <Typography sx={{ minWidth: 86, fontSize: FONT.item }}>
                  {selectedDate}
                </Typography>
                <Box
                  component="span"
                  role="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    shiftSelectedDate(1);
                  }}
                  sx={{
                    display: "inline-flex",
                    p: 0.5,
                    cursor: "pointer",
                    color: "text.secondary",
                  }}
                >
                  <ChevronRight size={16} />
                </Box>
              </Box>
            )}
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Typography sx={{ fontSize: 12 }} color="text.secondary">
                날짜를 클릭해 선택하세요.
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Box
                  component="span"
                  role="button"
                  onClick={() =>
                    setCalendarMonth(
                      (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1)
                    )
                  }
                  sx={{
                    display: "inline-flex",
                    p: 0.5,
                    cursor: "pointer",
                    color: "text.secondary",
                  }}
                >
                  <ChevronLeft size={16} />
                </Box>
                <Typography sx={{ fontSize: FONT.item, fontWeight: 600 }}>
                  {calendarMonth.getFullYear()}년 {calendarMonth.getMonth() + 1}월
                </Typography>
                <Box
                  component="span"
                  role="button"
                  onClick={() =>
                    setCalendarMonth(
                      (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1)
                    )
                  }
                  sx={{
                    display: "inline-flex",
                    p: 0.5,
                    cursor: "pointer",
                    color: "text.secondary",
                  }}
                >
                  <ChevronRight size={16} />
                </Box>
              </Box>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "repeat(7, 1fr)",
                  gap: 0.5,
                }}
              >
                {WEEK_LABELS.map((label) => (
                  <Typography
                    key={label}
                    sx={{ fontSize: 12, textAlign: "center", color: "text.secondary" }}
                  >
                    {label}
                  </Typography>
                ))}
                {buildCalendarCells(calendarMonth).map((cell) => {
                  const cellKey = `${cell.date.toISOString()}-${cell.inMonth}`;
                  const cellValue = formatDateInput(cell.date);
                  const isSelected = cellValue === selectedDate;

                  return (
                    <Box
                      key={cellKey}
                      component="span"
                      role="button"
                      onClick={() => handleDateSelect(cell.date)}
                      sx={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        height: 32,
                        borderRadius: 1,
                        cursor: "pointer",
                        fontSize: FONT.item,
                        fontWeight: isSelected ? 700 : 400,
                        color: cell.inMonth ? "text.primary" : "text.disabled",
                        backgroundColor: isSelected ? "rgba(59, 130, 246, 0.15)" : "transparent",
                        border: isSelected ? "1px solid rgba(59, 130, 246, 0.4)" : "1px solid transparent",
                      }}
                    >
                      {cell.date.getDate()}
                    </Box>
                  );
                })}
              </Box>
            </Box>
          </AccordionDetails>
        </Accordion>

        <Accordion
          expanded={expandedPanels.includes("media")}
          onChange={handlePanelToggle("media")}
          disableGutters
          elevation={0}
          square
          sx={{
            backgroundColor: "transparent",
            "&:before": { display: "none" },
          }}
        >
          <AccordionSummary
            expandIcon={<ChevronDown size={18} />}
            sx={{
              px: 0,
              minHeight: 0,
              flexDirection: "row-reverse",
              "& .MuiAccordionSummary-content": { margin: "6px 0" },
              "& .MuiAccordionSummary-expandIconWrapper": { mr: 1 },
            }}
          >
            <Typography sx={{ fontSize: FONT.menu, fontWeight: 700 }}>
              매체사 선택
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              <TextField
                size="small"
                placeholder="매체사 필터"
                value={mediaFilter}
                onChange={(event) => setMediaFilter(event.target.value)}
                fullWidth
              />
              {filteredMedia.length ? (
                renderMediaNodes(filteredMedia)
              ) : (
                <Typography sx={{ fontSize: FONT.item }} color="text.secondary">
                  검색 결과가 없습니다.
                </Typography>
              )}
            </Box>
          </AccordionDetails>
        </Accordion>

        <Accordion
          expanded={expandedPanels.includes("articles")}
          onChange={handlePanelToggle("articles")}
          disableGutters
          elevation={0}
          square
          sx={{
            backgroundColor: "transparent",
            "&:before": { display: "none" },
          }}
        >
          <AccordionSummary
            expandIcon={<ChevronDown size={18} />}
            sx={{
              px: 0,
              minHeight: 0,
              flexDirection: "row-reverse",
              "& .MuiAccordionSummary-content": { margin: "6px 0" },
              "& .MuiAccordionSummary-expandIconWrapper": { mr: 1 },
            }}
          >
            <Typography sx={{ fontSize: FONT.menu, fontWeight: 700 }}>
              기사 선택
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {articlePages.map((page) => {
                const { checked, indeterminate } = getPageSelectionState(
                  page,
                  selectedArticles
                );
                const pageId = `page-${page.id}`;

                return (
                  <Accordion
                    key={page.id}
                    expanded={expandedPanels.includes(pageId)}
                    onChange={handlePanelToggle(pageId)}
                    disableGutters
                    elevation={0}
                    square
                    sx={{
                      backgroundColor: "transparent",
                      "&:before": { display: "none" },
                    }}
                  >
                    <AccordionSummary
                      expandIcon={<ChevronDown size={16} />}
                      sx={{
                        px: 0,
                        minHeight: 0,
                        flexDirection: "row-reverse",
                        "& .MuiAccordionSummary-content": {
                          margin: "6px 0",
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                        },
                        "& .MuiAccordionSummary-expandIconWrapper": { mr: 1 },
                      }}
                    >
                      <Checkbox
                        size="small"
                        checked={checked}
                        indeterminate={indeterminate}
                        onChange={() => handlePageToggle(page)}
                        sx={{ padding: 0 }}
                      />
                      <Typography sx={{ fontSize: FONT.menu, fontWeight: 700 }}>
                        {page.title}
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails sx={{ pt: 0, pl: 4 }}>
                      <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                        {page.articles.map((article) => (
                          <Box
                            key={article.id}
                            sx={{ display: "flex", alignItems: "center", gap: 1 }}
                          >
                            <Checkbox
                              size="small"
                              checked={Boolean(selectedArticles[article.id])}
                              onChange={() => handleArticleToggle(article.id)}
                              sx={{ padding: 0 }}
                            />
                            <Typography sx={{ fontSize: FONT.item }}>
                              {article.title}
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                    </AccordionDetails>
                  </Accordion>
                );
              })}
            </Box>
          </AccordionDetails>
        </Accordion>
      </Box>
    </Box>
  );
}