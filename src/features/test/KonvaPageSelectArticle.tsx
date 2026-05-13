import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  type HTMLElementType,
} from "react";
import {
  Stage,
  Layer,
  Group,
  Rect,
  Line,
  Image as KonvaImage,
} from "react-konva";
import {
  union as polygonUnion,
  intersection as polygonIntersection,
} from "polygon-clipping";

import { renderToStaticMarkup } from "react-dom/server";
import {
  Star,
  SquareArrowOutUpRight,
  Printer,
  Copy,
  Save,
  Sparkles,
} from "lucide-react";
// SVG 문자열을 이미지 객체로 변환

import articleDatas from "@/datas/20260511sg00.json";

function useImage(src: string) {
  const [image, setImage] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    const img = new Image();
    img.src = src;
    img.onload = () => setImage(img);
  }, [src]);

  return image;
}

function rectToPolygon(rect: {
  x: number;
  y: number;
  width: number;
  height: number;
}) {
  const x1 = rect.x;
  const y1 = rect.y;
  const x2 = rect.x + rect.width;
  const y2 = rect.y + rect.height;

  return [
    [
      [
        [x1, y1],
        [x2, y1],
        [x2, y2],
        [x1, y2],
        [x1, y1],
      ],
    ],
  ];
}

function flattenPoints(points: number[][]) {
  return points.flatMap((p) => [p[0], p[1]]);
}

// 아이콘 SVG→Image 변환 및 캐싱
const iconButtonDefs = [
  { name: "star", Lucide: Star },
  { name: "export", Lucide: SquareArrowOutUpRight },
  { name: "print", Lucide: Printer },
  { name: "copy", Lucide: Copy },
  { name: "save", Lucide: Save },
  { name: "sparkles", Lucide: Sparkles },
];
function svgToImage(svgString, size = 24) {
  return new Promise((resolve) => {
    const svg = window.btoa(svgString);
    const img = new Image();
    img.src = `data:image/svg+xml;base64,${svg}`;
    img.width = size;
    img.height = size;
    img.onload = () => resolve(img);
  });
}

export default function KonvaPageSelectArticle() {
  const image = useImage("../src/assets/page/세계일보_2026-05-11_001면.png");
  // 임시 데이터 정제: 좌표 문자열을 2D 숫자 배열로 변환
  const articles = articleDatas.map((article) => ({
    ...article,
    coordinate: article.coordinate
      .split("|")
      .map((coor) => {
        if (coor === "") return null;
        return coor.split(",").map(Number);
      })
      .filter((coor) => coor !== null),
  }));

  // articles의 coordinate를 폴리곤으로 변환 (최소 3개 포인트 필요)
  const articlePolygons = useMemo(() => {
    return articles
      .filter((article) => article.coordinate.length >= 3)
      .map((article) => {
        const polygon = article.coordinate.map((point) => [point[0], point[1]]);
        // 폐곡선 형태로 마지막 점과 처음 점 연결
        polygon.push(polygon[0]);
        return polygon;
      });
  }, []);
  // Konva에 lucide 아이콘을 이미지로 변환하여 표시하기 위한 상태 및 효과
  const [iconImages, setIconImages] = useState([]);
  useEffect(() => {
    Promise.all(
      iconButtonDefs.map(({ Lucide }) =>
        svgToImage(renderToStaticMarkup(<Lucide size={24} color="#222" />), 24),
      ),
    ).then(setIconImages);
  }, []);

  const imageGroupRef = useRef(null);
  const dragStartRef = useRef(null);
  const panStartRef = useRef({ pointer: null, groupPos: { x: 0, y: 0 } });

  const [isShiftPressed, setIsShiftPressed] = useState(false);
  const [isSelecting, setIsSelecting] = useState(false);
  const [isPanning, setIsPanning] = useState(false);
  const [stageScale, setStageScale] = useState(1);
  const [groupPos, setGroupPos] = useState({ x: 0, y: 0 });
  const [polygons, setPolygons] = useState<number[][][]>([]);
  const [hoveredArticleIndex, setHoveredArticleIndex] = useState<number | null>(
    null,
  );
  const [selectionRect, setSelectionRect] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    visible: false,
  });

  const [stageSize, setStageSize] = useState({ width: 0, height: 0 });
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  // 화면 크기에 따라 Observer가 감시하여 stage 크기 업데이트
  useEffect(() => {
    if (!wrapperRef.current) return;

    const updateSize = () => {
      if (!wrapperRef.current) return;

      const rect = wrapperRef.current.getBoundingClientRect();

      setStageSize({
        width: rect.width,
        height: rect.height,
      });
    };

    updateSize();

    const observer = new ResizeObserver(updateSize);
    observer.observe(wrapperRef.current);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!image) return;

    const scaleX = stageSize.width / image.width;
    const scaleY = stageSize.height / image.height;
    const nextScale = Math.min(scaleX, scaleY);

    const nextPos = {
      x: (stageSize.width - image.width * nextScale) / 2,
      y: (stageSize.height - image.height * nextScale) / 2,
    };

    setStageScale(nextScale);
    setGroupPos(nextPos);
    //, stageSize.height, stageSize.width
  }, [image]);

  useEffect(() => {
    if (!image) return;
    // console.log("window size changed:", stageSize);
    // 중앙 정렬이 필요하다면 해당 값을 ture 전환이 필요하다
    // setIsPanning(true);
    handleMouseMove();
  }, [stageSize.width]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Shift") setIsShiftPressed(true);
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === "Shift") setIsShiftPressed(false);
    };

    const handleWindowBlur = () => {
      setIsShiftPressed(false);
    };

    globalThis.addEventListener("keydown", handleKeyDown);
    globalThis.addEventListener("keyup", handleKeyUp);
    globalThis.addEventListener("blur", handleWindowBlur);

    return () => {
      globalThis.removeEventListener("keydown", handleKeyDown);
      globalThis.removeEventListener("keyup", handleKeyUp);
      globalThis.removeEventListener("blur", handleWindowBlur);
    };
  }, []);

  const getPointOnImageGroup = () => {
    if (!imageGroupRef.current) return null;
    const stage = imageGroupRef.current.getStage();
    const pointer = stage?.getPointerPosition();
    if (!pointer) return null;

    const transform = imageGroupRef.current.getAbsoluteTransform().copy();
    transform.invert();
    return transform.point(pointer);
  };

  const getClampedGroupPos = (
    nextPos: { x: number; y: number },
    nextScale: number,
  ) => {
    if (!image) return nextPos;

    const scaledWidth = image.width * nextScale;
    const scaledHeight = image.height * nextScale;

    let clampedX = nextPos.x;
    let clampedY = nextPos.y;

    if (scaledWidth <= stageSize.width) {
      clampedX = (stageSize.width - scaledWidth) / 2;
    } else {
      const minX = stageSize.width - scaledWidth;
      const maxX = 0;
      clampedX = Math.min(maxX, Math.max(minX, clampedX));
    }

    if (scaledHeight <= stageSize.height) {
      clampedY = (stageSize.height - scaledHeight) / 2;
    } else {
      const minY = stageSize.height - scaledHeight;
      const maxY = 0;
      clampedY = Math.min(maxY, Math.max(minY, clampedY));
    }

    return { x: clampedX, y: clampedY };
  };

  const isPointInsideImage = (point: { x: number; y: number }) => {
    if (!image) return false;
    return (
      point.x >= 0 &&
      point.y >= 0 &&
      point.x <= image.width &&
      point.y <= image.height
    );
  };

  const handleMouseDown = () => {
    if (!isShiftPressed) {
      const stage = imageGroupRef.current?.getStage();
      const pointer = stage?.getPointerPosition();
      if (!pointer) return;

      panStartRef.current = {
        pointer,
        groupPos: { ...groupPos },
      };
      setIsPanning(true);
      return;
    }

    const point = getPointOnImageGroup();
    if (!point) return;
    if (!isPointInsideImage(point)) return;

    dragStartRef.current = point;
    setIsSelecting(true);
    setSelectionRect({
      x: point.x,
      y: point.y,
      width: 0,
      height: 0,
      visible: true,
    });
  };

  const handleMouseMove = () => {
    if (isPanning) {
      const stage = imageGroupRef.current?.getStage();
      const pointer = stage?.getPointerPosition();
      const start = panStartRef.current;
      if (!pointer || !start.pointer) return;

      const dx = pointer.x - start.pointer.x;
      const dy = pointer.y - start.pointer.y;

      const nextPos = {
        x: start.groupPos.x + dx,
        y: start.groupPos.y + dy,
      };

      setGroupPos(getClampedGroupPos(nextPos, stageScale));
      return;
    }

    if (!isSelecting) return;
    const start = dragStartRef.current;
    const point = getPointOnImageGroup();
    if (!start || !point) return;

    const nextX = Math.min(start.x, point.x);
    const nextY = Math.min(start.y, point.y);
    const nextWidth = Math.abs(point.x - start.x);
    const nextHeight = Math.abs(point.y - start.y);

    setSelectionRect((prev) => ({
      ...prev,
      x: nextX,
      y: nextY,
      width: nextWidth,
      height: nextHeight,
      visible: true,
    }));
  };

  const handleMouseUp = () => {
    if (isPanning) {
      setIsPanning(false);
      return;
    }
    if (!isSelecting) return;
    setIsSelecting(false);
    dragStartRef.current = null;

    if (selectionRect.width > 0 && selectionRect.height > 0) {
      const rectPoly = rectToPolygon(selectionRect);
      setPolygons((prev) => {
        const mergedPolygons = prev.length
          ? polygonUnion(prev, rectPoly)
          : rectPoly;

        const imagePoly = image
          ? rectToPolygon({
              x: 0,
              y: 0,
              width: image.width,
              height: image.height,
            })
          : null;

        const nextPolygons = imagePoly
          ? polygonIntersection(mergedPolygons, imagePoly)
          : mergedPolygons;

        nextPolygons.forEach((polygon, polygonIndex) => {
          const outerRing = polygon[0];
          if (!outerRing) return;
          // console.log(
          //   `polygon ${polygonIndex + 1} vertices:`,
          //   outerRing.map(([x, y]) => ({ x, y })),
          //   "image coords:",
          //   image
          //     ? {
          //         x: 0,
          //         y: 0,
          //         width: image.width,
          //         height: image.height,
          //       }
          //     : null,
          // );
        });

        return nextPolygons;
      });
    }

    setSelectionRect((prev) => ({
      ...prev,
      visible: false,
    }));
  };
  // 화면에서 마우스가 나가면 하던 액션 종료 (패닝/셀렉션)
  const handleMouseLeave = () => {
    setIsPanning(false);
    setIsSelecting(false);
    dragStartRef.current = null;
  };

  const handleWheel = (e) => {
    e.evt.preventDefault();

    const scaleBy = 1.1;
    const stage = imageGroupRef.current?.getStage();
    const pointer = stage?.getPointerPosition();
    if (!pointer) return;

    const oldScale = stageScale;
    const direction = e.evt.deltaY > 0 ? -1 : 1;
    const nextScale = direction > 0 ? oldScale * scaleBy : oldScale / scaleBy;
    const clampedScale = Math.max(0.2, Math.min(4, nextScale));

    const mousePointTo = {
      x: (pointer.x - groupPos.x) / oldScale,
      y: (pointer.y - groupPos.y) / oldScale,
    };

    const nextPos = {
      x: pointer.x - mousePointTo.x * clampedScale,
      y: pointer.y - mousePointTo.y * clampedScale,
    };

    setStageScale(clampedScale);
    setGroupPos(getClampedGroupPos(nextPos, clampedScale));
  };

  // 아이콘 액션 핸들러 (추후 각각의 액션 구현)
  const handleIconAction = (iconName: string, articleIndex: number) => {
    console.log(`${iconName} clicked for article ${articleIndex}`);
    // TODO: 각 아이콘별 액션 구현
  };

  return (
    <div ref={wrapperRef} className="h-full w-full">
      <Stage
        width={stageSize.width}
        height={stageSize.height}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onWheel={handleWheel}
        onMouseLeave={handleMouseLeave}
      >
        <Layer>
          <Group
            ref={imageGroupRef}
            x={groupPos.x}
            y={groupPos.y}
            scaleX={stageScale}
            scaleY={stageScale}
          >
            <KonvaImage image={image} />
            {/* articles 좌표 영역 표시 */}
            {articlePolygons.map((polygon, index) => {
              const isHovered = hoveredArticleIndex === index;
              const [x, y] = polygon[0];
              return (
                <Group
                  key={`article-group-${index}`}
                  onMouseEnter={() => setHoveredArticleIndex(index)}
                  onMouseLeave={() => setHoveredArticleIndex(null)}
                >
                  <Line
                    points={flattenPoints(polygon)}
                    closed
                    fill={
                      isHovered ? "rgba(255, 200, 100, 0.25)" : "transparent"
                    }
                    stroke="rgba(255, 140, 0, 0.8)"
                    strokeWidth={2}
                    dashEnabled
                    dash={[5, 5]}
                  />
                  {iconImages.length === iconButtonDefs.length &&
                    isHovered &&
                    iconImages.map((img, i) => (
                      <KonvaImage
                        key={`icon-${i}`}
                        image={img}
                        x={x + i * 48}
                        y={y}
                        width={48}
                        height={48}
                        listening
                        onMouseEnter={() => setHoveredArticleIndex(index)}
                        onClick={() =>
                          handleIconAction(iconButtonDefs[i].name, index)
                        }
                      />
                    ))}
                </Group>
              );
            })}
            {/* 사용자 선택 폴리곤 */}
            {polygons.map((polygon, index) => {
              const outerRing = polygon[0];
              if (!outerRing || outerRing.length < 3) return null;

              return (
                <Line
                  key={`poly-${index}`}
                  points={flattenPoints(outerRing)}
                  closed
                  fill="rgba(135, 206, 235, 0.35)"
                  stroke="rgba(90, 150, 210, 0.8)"
                  strokeWidth={1}
                />
              );
            })}
            {selectionRect.visible && (
              <Rect
                x={selectionRect.x}
                y={selectionRect.y}
                width={selectionRect.width}
                height={selectionRect.height}
                fill="rgba(135, 206, 235, 0.35)"
                stroke="rgba(90, 150, 210, 0.8)"
                strokeWidth={1}
              />
            )}
          </Group>
        </Layer>
      </Stage>

      <div className="absolute left-12 top-12 max-w-xs rounded bg-white/80 p-2 text-xs">
        {articles.map((article, index) => (
          <div key={index}>
            {/* <h3>{article.article_title}</h3>
            <p>
              {article.coordinate
                .map((coor) => `(${coor[0]}, ${coor[1]})`)
                .join(", ")}
            </p> */}
          </div>
        ))}
      </div>
    </div>
  );
}
