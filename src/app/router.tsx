import { Route, Routes } from "react-router";
import FlexLayoutPage from "../features/test/FlexLayoutPage";
import KonvaPage from "../features/test/KonvaPage";
import KonvaPageTest from "../features/test/KonvaPageTest";
import MainPage from "../pages/MainPage";



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
      <Route path="/app" element={<MainPage />} />  
      <Route path="/flex" element={<FlexLayoutPage />} />
      <Route path="/konva" element={<KonvaPage />} />
      <Route path="/konvaTest" element={<KonvaPageTest />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}