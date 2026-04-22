import { Outlet } from "react-router-dom";
import ScrapListRightSidebar from "../../features/edit/sidebar/ScrapListRightSidebar";

export default function EditPage() {
  return (
    <>
      <Outlet /> 
      <ScrapListRightSidebar />
    </>
  );
}