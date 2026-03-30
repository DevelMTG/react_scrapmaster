import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Stage,
  Layer,
  Group,
  Line,
  Circle,
  Rect,
  Text,
  Image as KonvaImage,
} from 'react-konva';

// const HANDLE_SIZE = 20;     // 10
const VERTEX_RADIUS = 10;   // 6
const START_VERTEX_RADIUS = 14;
const MIN_POLYGON_POINTS = 3;
const MIN_BOX_SIZE = 40;

function useImage(src) {
  const [image, setImage] = useState(null);

  useEffect(() => {
    const img = new window.Image();
    img.src = src;
    img.onload = () => setImage(img);
  }, [src]);

  return image;
}

function flattenPoints(points) {
  return points.flatMap((p) => [p.x, p.y]);
}

function getBounds(points) {
  const xs = points.map((p) => p.x);
  const ys = points.map((p) => p.y);

  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);

  return {
    x: minX,
    y: minY,
    width: maxX - minX,
    height: maxY - minY,
    right: maxX,
    bottom: maxY,
  };
}

function translatePoints(points, dx, dy) {
  return points.map((p) => ({
    x: p.x + dx,
    y: p.y + dy,
  }));
}

// function resizePolygonByCorner(points, handleType, handleX, handleY) {
//   const bounds = getBounds(points);

//   const left = bounds.x;
//   const top = bounds.y;
//   const right = bounds.right;
//   const bottom = bounds.bottom;

//   let newLeft = left;
//   let newTop = top;
//   let newRight = right;
//   let newBottom = bottom;

//   if (handleType === 'topLeft') {
//     newLeft = handleX;
//     newTop = handleY;
//   } else if (handleType === 'topRight') {
//     newRight = handleX;
//     newTop = handleY;
//   } else if (handleType === 'bottomLeft') {
//     newLeft = handleX;
//     newBottom = handleY;
//   } else if (handleType === 'bottomRight') {
//     newRight = handleX;
//     newBottom = handleY;
//   }

//   const newWidth = newRight - newLeft;
//   const newHeight = newBottom - newTop;

//   if (newWidth < MIN_BOX_SIZE || newHeight < MIN_BOX_SIZE) {
//     return points;
//   }

//   const oldWidth = bounds.width || 1;
//   const oldHeight = bounds.height || 1;

//   return points.map((p) => {
//     const relX = (p.x - left) / oldWidth;
//     const relY = (p.y - top) / oldHeight;

//     return {
//       x: newLeft + relX * newWidth,
//       y: newTop + relY * newHeight,
//     };
//   });
// }

// function getResizeHandles(bounds) {
//   return {
//     topLeft: {
//       x: bounds.x - HANDLE_SIZE / 2,
//       y: bounds.y - HANDLE_SIZE / 2,
//     },
//     topRight: {
//       x: bounds.right - HANDLE_SIZE / 2,
//       y: bounds.y - HANDLE_SIZE / 2,
//     },
//     bottomLeft: {
//       x: bounds.x - HANDLE_SIZE / 2,
//       y: bounds.bottom - HANDLE_SIZE / 2,
//     },
//     bottomRight: {
//       x: bounds.right - HANDLE_SIZE / 2,
//       y: bounds.bottom - HANDLE_SIZE / 2,
//     },
//   };
// }

function getRelativePointerPosition(node) {
  const stage = node.getStage();
  const pointer = stage?.getPointerPosition();
  if (!pointer) return null;

  const transform = node.getAbsoluteTransform().copy();
  transform.invert();

  return transform.point(pointer);
}

function orthogonalizePoint(prevPoint, rawPoint) {
  if (!prevPoint) return rawPoint;

  const dx = rawPoint.x - prevPoint.x;
  const dy = rawPoint.y - prevPoint.y;

  if (Math.abs(dx) >= Math.abs(dy)) {
    return {
      x: rawPoint.x,
      y: prevPoint.y,
    };
  }

  return {
    x: prevPoint.x,
    y: rawPoint.y,
  };
}

function getOrthogonalPreviewPoint(points, rawPoint) {
  if (!points.length) return rawPoint;
  return orthogonalizePoint(points[points.length - 1], rawPoint);
}

function closeOrthogonalPolygon(points) {
  if (points.length < 3) return points;

  const first = points[0];
  const last = points[points.length - 1];

  if (last.x === first.x || last.y === first.y) {
    return points;
  }

  const prev = points[points.length - 2];
  const prevIsHorizontal = prev.y === last.y;
  const prevIsVertical = prev.x === last.x;

  let closingPoint;

  if (prevIsHorizontal) {
    closingPoint = { x: last.x, y: first.y };
  } else if (prevIsVertical) {
    closingPoint = { x: first.x, y: last.y };
  } else {
    closingPoint = { x: last.x, y: first.y };
  }

  return [...points, closingPoint];
}

function moveOrthogonalVertex(points, index, newPos) {
  const len = points.length;
  if (len < 3) return points;

  const prevIndex = (index - 1 + len) % len;
  const nextIndex = (index + 1) % len;

  const prev = points[prevIndex];
  const curr = points[index];
  const next = points[nextIndex];

  const prevIsHorizontal = prev.y === curr.y;
  const prevIsVertical = prev.x === curr.x;

  const nextIsHorizontal = curr.y === next.y;
  const nextIsVertical = curr.x === next.x;

  const nextPoints = points.map((p) => ({ ...p }));
  nextPoints[index] = { x: newPos.x, y: newPos.y };

  if (prevIsHorizontal) {
    nextPoints[prevIndex].y = newPos.y;
  } else if (prevIsVertical) {
    nextPoints[prevIndex].x = newPos.x;
  }

  if (nextIsHorizontal) {
    nextPoints[nextIndex].y = newPos.y;
  } else if (nextIsVertical) {
    nextPoints[nextIndex].x = newPos.x;
  }

  return nextPoints;
}

export default function App() {
  const image = useImage('../src/assets/page/매일일보_2026-03-25_004면.png');

  const stageRef = useRef(null);
  const imageGroupRef = useRef(null);
  const dragStateRef = useRef({});

  const wholeAreaDragRef = useRef({
    dragging: false,
    startPointer: null,
    startGroupPos: { x: 0, y: 0 },
    moved: false,
  });

  const [stageScale, setStageScale] = useState(1);
  const [stagePos, setStagePos] = useState({ x: 0, y: 0 });
  const [groupPos, setGroupPos] = useState({ x: 0, y: 0 });

  const [polygons, setPolygons] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [drawingPoints, setDrawingPoints] = useState([]);
  const [isDrawingPolygon, setIsDrawingPolygon] = useState(false);
  const [previewPoint, setPreviewPoint] = useState(null);

  const [isShiftPressed, setIsShiftPressed] = useState(false);

  const stageSize = useMemo(
    () => ({
      width: window.innerWidth,
      height: window.innerHeight,
    }),
    []
  );

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Shift') {
        setIsShiftPressed(true);
      }
    };

    const handleKeyUp = (e) => {
      if (e.key === 'Shift') {
        setIsShiftPressed(false);
      }
    };

    const handleWindowBlur = () => {
      setIsShiftPressed(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('blur', handleWindowBlur);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', handleWindowBlur);
    };
  }, []);

  const updatePolygon = (id, updater) => {
    setPolygons((prev) =>
      prev.map((poly) => {
        if (poly.id !== id) return poly;
        return typeof updater === 'function' ? updater(poly) : updater;
      })
    );
  };

  const deletePolygon = (id) => {
    setPolygons((prev) => prev.filter((poly) => poly.id !== id));
    if (selectedId === id) {
      setSelectedId(null);
    }
  };

  const finishPolygon = () => {
    if (drawingPoints.length < MIN_POLYGON_POINTS) {
      setDrawingPoints([]);
      setPreviewPoint(null);
      setIsDrawingPolygon(false);
      return;
    }

    const normalizedPoints = closeOrthogonalPolygon(drawingPoints);

    const newPolygon = {
      id: `poly-${Date.now()}`,
      points: normalizedPoints,
    };

    setPolygons((prev) => [...prev, newPolygon]);
    setSelectedId(newPolygon.id);
    setDrawingPoints([]);
    setPreviewPoint(null);
    setIsDrawingPolygon(false);
  };

  const getPointOnImageGroup = () => {
    if (!imageGroupRef.current) return null;
    return getRelativePointerPosition(imageGroupRef.current);
  };

  const handleStageMouseDown = (e) => {
    if (!isShiftPressed) return;

    const clickedTarget = e.target;
    const targetType = clickedTarget?.getClassName?.();

    if (
      targetType === 'Circle' ||
      targetType === 'Rect' ||
      targetType === 'Text' ||
      targetType === 'Line'
    ) {
      return;
    }

    const rawPoint = getPointOnImageGroup();
    if (!rawPoint) return;

    if (!isDrawingPolygon) {
      setSelectedId(null);
      setIsDrawingPolygon(true);
      setDrawingPoints([rawPoint]);
      setPreviewPoint(rawPoint);
      return;
    }

    const point = orthogonalizePoint(
      drawingPoints[drawingPoints.length - 1],
      rawPoint
    );

    setDrawingPoints((prev) => [...prev, point]);
    setPreviewPoint(point);
  };

  const handleStageMouseMove = () => {
    if (!isDrawingPolygon) return;
    if (!isShiftPressed) return;

    const rawPoint = getPointOnImageGroup();
    if (!rawPoint) return;

    const point = getOrthogonalPreviewPoint(drawingPoints, rawPoint);
    setPreviewPoint(point);
  };

  const handleStagePanStart = () => {
    if (isShiftPressed) return;

    const stage = stageRef.current;
    const pointer = stage?.getPointerPosition();
    if (!pointer) return;

    wholeAreaDragRef.current = {
      dragging: true,
      startPointer: pointer,
      startGroupPos: { ...groupPos },
      moved: false,
    };
  };

  const handleStagePanMove = () => {
    if (isShiftPressed) return;

    const stage = stageRef.current;
    const pointer = stage?.getPointerPosition();
    const dragState = wholeAreaDragRef.current;

    if (!dragState.dragging || !pointer) return;

    const dx = (pointer.x - dragState.startPointer.x) / stageScale;
    const dy = (pointer.y - dragState.startPointer.y) / stageScale;

    if (dx !== 0 || dy !== 0) {
      dragState.moved = true;
    }

    setGroupPos({
      x: dragState.startGroupPos.x + dx,
      y: dragState.startGroupPos.y + dy,
    });
  };

  const handleStagePanEnd = () => {
    wholeAreaDragRef.current.dragging = false;
  };

  const handleWheel = (e) => {
    e.evt.preventDefault();

    const stage = stageRef.current;
    if (!stage) return;

    const oldScale = stage.scaleX();
    const pointer = stage.getPointerPosition();
    if (!pointer) return;

    const mousePointTo = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale,
    };

    const newScale = e.evt.deltaY > 0 ? oldScale * 0.95 : oldScale * 1.05;

    const newPos = {
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    };

    setStageScale(newScale);
    setStagePos(newPos);
  };

  const renderDrawingPreview = () => {
    if (!isDrawingPolygon || drawingPoints.length === 0) return null;

    const previewPoints =
      previewPoint != null ? [...drawingPoints, previewPoint] : drawingPoints;

    const startPoint = drawingPoints[0];

    return (
      <>
        <Line
          points={flattenPoints(previewPoints)}
          stroke="blue"
          strokeWidth={2}
          lineCap="round"
          lineJoin="round"
          dash={[8, 6]}
          listening={false}
        />

        {drawingPoints.map((p, idx) => {
          if (idx === 0) {
            return (
              <Rect
                key="draft-start-point"
                x={p.x - START_VERTEX_RADIUS}
                y={p.y - START_VERTEX_RADIUS}
                width={START_VERTEX_RADIUS * 2}
                height={START_VERTEX_RADIUS * 2}
                fill="white"
                stroke="red"
                strokeWidth={3}
                cornerRadius={4}
                onClick={(e) => {
                  e.cancelBubble = true;
                  finishPolygon();
                }}
                onTap={(e) => {
                  e.cancelBubble = true;
                  finishPolygon();
                }}
              />
            );
          }

          return (
            <Circle
              key={`draft-point-${idx}`}
              x={p.x}
              y={p.y}
              radius={VERTEX_RADIUS}
              fill="white"
              stroke="blue"
              strokeWidth={2}
              listening={false}
            />
          );
        })}

        {startPoint && drawingPoints.length >= MIN_POLYGON_POINTS && (
          <Text
            x={startPoint.x + 18}
            y={startPoint.y - 12}
            text="시작점 클릭 시 완료"
            fontSize={14}
            fill="red"
            listening={false}
          />
        )}
      </>
    );
  };

  return (
    <Stage
      ref={stageRef}
      width={stageSize.width}
      height={stageSize.height}
      scaleX={stageScale}
      scaleY={stageScale}
      x={stagePos.x}
      y={stagePos.y}
      onMouseDown={(e) => {
        if (isShiftPressed) {
          handleStageMouseDown(e);
        } else {
          handleStagePanStart();
        }
      }}
      onMouseMove={(e) => {
        if (isShiftPressed) {
          handleStageMouseMove(e);
        } else {
          handleStagePanMove();
        }
      }}
      onMouseUp={(e)=>{
          handleStagePanEnd(e);
          console.log(imageGroupRef.current);
          console.log(stageScale);
          console.log(polygons);
        }
      }
      onMouseLeave={handleStagePanEnd}
      onWheel={handleWheel}
      style={{ background: '#fff' }}
    >
      <Layer>
        <Group
          ref={imageGroupRef}
          x={groupPos.x}
          y={groupPos.y}
        >
          {image && (
            <KonvaImage
              image={image}
              x={0}
              y={0}
              width={image.width}
              height={image.height}
              listening={!isShiftPressed}
            />
          )}

          {polygons.map((poly) => {
            const isSelected = poly.id === selectedId;
            const bounds = getBounds(poly.points);
            // const handles = getResizeHandles(bounds);

            return (
              <Group key={poly.id}>
                <Line
                  points={flattenPoints(poly.points)}
                  closed
                  fill="rgba(100, 150, 255, 0.3)"
                  stroke="blue"
                  strokeWidth={2}
                  lineJoin="round"
                  draggable={!isShiftPressed && selectedId === poly.id}
                  onClick={(e) => {
                    if (isShiftPressed) return;
                    if (wholeAreaDragRef.current.moved) return;
                    e.cancelBubble = true;
                    setSelectedId(poly.id);
                  }}
                  onTap={(e) => {
                    if (isShiftPressed) return;
                    if (wholeAreaDragRef.current.moved) return;
                    e.cancelBubble = true;
                    setSelectedId(poly.id);
                  }}
                  onMouseDown={(e) => {
                    if (isShiftPressed) return;
                    if (selectedId !== poly.id) {
                      handleStagePanStart();
                    }
                  }}
                  onDragStart={(e) => {
                    if (isShiftPressed) {
                      e.target.stopDrag();
                      return;
                    }

                    e.cancelBubble = true;
                    setSelectedId(poly.id);

                    const node = e.target;
                    dragStateRef.current[poly.id] = {
                      lastX: node.x(),
                      lastY: node.y(),
                    };
                  }}
                  onDragMove={(e) => {
                    if (isShiftPressed) return;

                    e.cancelBubble = true;

                    const node = e.target;
                    const state = dragStateRef.current[poly.id] || {
                      lastX: 0,
                      lastY: 0,
                    };

                    const currentX = node.x();
                    const currentY = node.y();

                    const dx = currentX - state.lastX;
                    const dy = currentY - state.lastY;

                    e.target.position({ x: 0, y: 0 });

                    if (dx !== 0 || dy !== 0) {
                      updatePolygon(poly.id, (prev) => ({
                        ...prev,
                        points: translatePoints(prev.points, dx, dy),
                      }));

                      dragStateRef.current[poly.id] = {
                        lastX: currentX,
                        lastY: currentY,
                      };
                    }
                  }}
                  onDragEnd={(e) => {
                    if (isShiftPressed) return;

                    e.cancelBubble = true;
                    e.target.position({ x: 0, y: 0 });
                    delete dragStateRef.current[poly.id];
                  }}
                  onMouseOver={(e) => {
                    e.target.opacity(0.8);
                    e.target.getLayer()?.batchDraw();
                  }}
                  onMouseOut={(e) => {
                    e.target.opacity(1);
                    e.target.getLayer()?.batchDraw();
                  }}
                />

                {isSelected && !isShiftPressed && (
                  <>
                    <Rect
                      x={bounds.x}
                      y={bounds.y}
                      width={bounds.width}
                      height={bounds.height}
                      stroke="blue"
                      dash={[6, 4]}
                      listening={false}
                    />

                    <Text
                      x={bounds.right - 43}
                      y={bounds.y + 6}
                      text="✕"
                      fontSize={32}
                      fill="red"
                      width={36}
                      height={36}
                      align="center"
                      verticalAlign="middle"
                      onClick={(e) => {
                        e.cancelBubble = true;
                        deletePolygon(poly.id);
                      }}
                      onTap={(e) => {
                        e.cancelBubble = true;
                        deletePolygon(poly.id);
                      }}
                      onMouseOver={(e) => {
                        e.target.fill('darkred');
                        e.target.getLayer()?.batchDraw();
                      }}
                      onMouseOut={(e) => {
                        e.target.fill('red');
                        e.target.getLayer()?.batchDraw();
                      }}
                    />

                    {poly.points.map((point, index) => (
                      <Circle
                        key={`vertex-${poly.id}-${index}`}
                        x={point.x}
                        y={point.y}
                        radius={VERTEX_RADIUS}
                        fill="white"
                        stroke="blue"
                        strokeWidth={2}
                        draggable
                        onDragStart={(e) => {
                          e.cancelBubble = true;
                        }}
                        onDragMove={(e) => {
                          e.cancelBubble = true;
                          const node = e.target;

                          updatePolygon(poly.id, (prev) => ({
                            ...prev,
                            points: moveOrthogonalVertex(
                              prev.points,
                              index,
                              { x: node.x(), y: node.y() }
                            ),
                          }));
                        }}
                      />
                    ))}

                    {/* {Object.entries(handles).map(([handleType, pos]) => (
                      <Rect
                        key={`resize-${poly.id}-${handleType}`}
                        x={pos.x}
                        y={pos.y}
                        width={HANDLE_SIZE}
                        height={HANDLE_SIZE}
                        fill="white"
                        stroke="blue"
                        strokeWidth={2}
                        draggable
                        onDragStart={(e) => {
                          e.cancelBubble = true;
                        }}
                        onDragMove={(e) => {
                          e.cancelBubble = true;
                          const node = e.target;

                          updatePolygon(poly.id, (prev) => ({
                            ...prev,
                            points: resizePolygonByCorner(
                              prev.points,
                              handleType,
                              node.x() + HANDLE_SIZE / 2,
                              node.y() + HANDLE_SIZE / 2
                            ),
                          }));
                        }}
                      />
                    ))} */}
                  </>
                )}
              </Group>
            );
          })}

          {renderDrawingPreview()}
        </Group>
      </Layer>
    </Stage>
  );
}