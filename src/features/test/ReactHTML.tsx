import { useState } from "react";

const dragStartThreshold = 5; // 드래그 시작으로 간주되는 최소 이동 거리

export default function ReactHTML() {
    const [isDragging, setIsDragging] = useState(false);

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        setIsDragging(true); // 드래그 상태 초기화
        console.log("Mouse Down", e.clientX, e.clientY);
    }
    const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
        console.log("Drag Start", e.clientX, e.clientY);
    };
    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if( !isDragging ) return; // 드래그 상태가 아니면 무시
        console.log("Mouse Move", e.clientX, e.clientY);
    };
    const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
        setIsDragging(false); // 드래그 상태 초기화
        console.log("Drag End", e.clientX, e.clientY);
    };
    const Border = () => {
        return (
            <div className="border" 
                onMouseDown={handleMouseDown}
                onDragStart={handleDragStart} 
                onMouseMove={handleMouseMove} 
                onDragEnd={handleDragEnd}
                draggable={isDragging}>
            </div>
        );
    }   

    return (
        <>
            <style>{` 
                .flex { display: flex; gap: 16px; } 
                .flex .border { width: 5px; height: 100vh; background: #ccc; cursor: e-resize; }
            `}</style>
            <div className="flex">
                <div>React HTML 테스트 페이지</div>
                <Border />
                <div>HTML 태그를 React에서 렌더링하는 테스트 페이지입니다.</div>
                <Border />
                <div>아래는 HTML 태그를 React에서 렌더링한 결과입니다.</div>
            </div>
        </>
    );
}
