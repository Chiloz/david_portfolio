import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "../app/page.jsx";
import ContactPage from "../app/contact/page.jsx";
import ProjectsPage from "../app/projects/page.jsx";
import SkillsPage from "../app/skills/page.jsx";
import AdminDashboardPage from "../app/admin/dashboard/page.jsx";
import AddProjectPage from "../app/admin/add-project/page.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/skills" element={<SkillsPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
        <Route path="/admin/add-project" element={<AddProjectPage />} />
      </Routes>
    </BrowserRouter>
  );
}
