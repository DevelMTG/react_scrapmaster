import React, { useEffect, useMemo, useRef, useState } from "react";
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

function useImage(src) {
  const [image, setImage] = useState(null);

  useEffect(() => {
    const img = new window.Image();
    img.src = src;
    img.onload = () => setImage(img);
  }, [src]);

  return image;
}

function rectToPolygon(rect) {
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

function flattenPoints(points) {
  return points.flatMap((p) => [p[0], p[1]]);
}

export default function KonvaPageMerge() {
  const image = useImage("../src/assets/page/매일일보_2026-03-25_004면.png");
  const imageGroupRef = useRef(null);
  const dragStartRef = useRef(null);
  const panStartRef = useRef({ pointer: null, groupPos: { x: 0, y: 0 } });

  const [isShiftPressed, setIsShiftPressed] = useState(false);
  const [isSelecting, setIsSelecting] = useState(false);
  const [isPanning, setIsPanning] = useState(false);
  const [stageScale, setStageScale] = useState(1);
  const [groupPos, setGroupPos] = useState({ x: 0, y: 0 });
  const [polygons, setPolygons] = useState([]);
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
    const handleKeyDown = (e) => {
      if (e.key === "Shift") setIsShiftPressed(true);
    };

    const handleKeyUp = (e) => {
      if (e.key === "Shift") setIsShiftPressed(false);
    };

    const handleWindowBlur = () => {
      setIsShiftPressed(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("blur", handleWindowBlur);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("blur", handleWindowBlur);
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

  const getClampedGroupPos = (nextPos, nextScale) => {
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

  const isPointInsideImage = (point) => {
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
          console.log(
            `polygon ${polygonIndex + 1} vertices:`,
            outerRing.map(([x, y]) => ({ x, y })),
            "image coords:",
            image
              ? {
                  x: 0,
                  y: 0,
                  width: image.width,
                  height: image.height,
                }
              : null,
          );
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

    // if (image) {
    //   console.log('image size:', {
    //     width: image.width * clampedScale,
    //     height: image.height * clampedScale,
    //   });
    // }
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
    </div>
  );
}
