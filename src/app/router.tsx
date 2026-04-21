import { Route, Routes, Navigate } from "react-router-dom";
import ResizablePanelsPage from "../features/test/ResizablePanelsPage";
import KonvaPage from "../features/test/KonvaPage";
import KonvaPageTest from "../features/test/KonvaPageTest";
import MainPage from "../pages/MainPage";
import ReactHTML from "../features/test/ReactHTML";



function NotFoundPage() {
  return <div>404 - 페이지를 찾을 수 없습니다.</div>;
}

export default function AppRouter() {
  return (
    <Routes>
      {/* Layout 있는 경우 */}
      {/* <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/posts" element={<PostsPage />} />
      </Route> */}
      <Route path="/" element={<Navigate to="/resizable-panels" replace />} />  
      <Route path="/app" element={<MainPage />} />  
      <Route path="/resizable-panels" element={<ResizablePanelsPage />} />
      <Route path="/konva" element={<KonvaPage />} />
      <Route path="/konvaTest" element={<KonvaPageTest />} />
      <Route path="/react-html" element={<ReactHTML />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}