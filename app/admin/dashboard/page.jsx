"use client";

import React, { useState, useEffect } from "react";
import { 
  Trash2, 
  Edit, 
  Plus, 
  LogOut, 
  Lock, 
  Eye, 
  EyeOff, 
  Check, 
  X, 
  Sliders, 
  ChevronLeft,
  FolderKanban,
  Cpu,
  Settings,
  Upload,
  FileDown,
  Info
} from "lucide-react";

export default function AdminDashboardPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");

  // Tabs: "projects", "skills", "settings"
  const [activeTab, setActiveTab] = useState("projects");

  // Project states
  const [projects, setProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [editingProject, setEditingProject] = useState(null);
  const [editFormData, setEditFormData] = useState({ title: "", description: "", techStack: "", projectUrl: "" });

  // Skills states
  const [skills, setSkills] = useState([]);
  const [loadingSkills, setLoadingSkills] = useState(true);
  const [editingSkill, setEditingSkill] = useState(null);
  const [editSkillData, setEditSkillData] = useState({ category: "", items: "" });
  const [newSkillCategory, setNewSkillCategory] = useState("");
  const [newSkillItems, setNewSkillItems] = useState("");
  const [showAddSkillForm, setShowAddSkillForm] = useState(false);

  // Homepage Settings states
  const [settings, setSettings] = useState({
    heroTitle: "David Chilengwa",
    heroSubtitle: "Building high-performance, production-ready IT solutions with modern architecture, network resilience, and stateless container deployments.",
    aboutText: "With a deep specialization in infrastructure resilience, secure edge telemetry integrations, and stateless server integrations, I bridge the gap between hardware systems and robust cloud integrations.",
    availableText: "Available for Consultations & Contracts",
    phone: "+260768409033",
    email: "deavchile@gmail.com",
    homeMediaUrl: ""
  });
  const [loadingSettings, setLoadingSettings] = useState(true);
  const [homeMediaBase64, setHomeMediaBase64] = useState("");
  const [resumeBase64, setResumeBase64] = useState("");
  const [resumeFileName, setResumeFileName] = useState("");

  const [statusMessage, setStatusMessage] = useState("");
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  // Handle local credential check
  useEffect(() => {
    const sessionToken = localStorage.getItem("david_portfolio_admin_auth");
    if (sessionToken === "authenticated") {
      setIsLoggedIn(true);
    }
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      fetchProjects();
      fetchSkills();
      fetchSettings();
    }
  }, [isLoggedIn]);

  const fetchProjects = async () => {
    setLoadingProjects(true);
    try {
      const res = await fetch("/api/projects");
      if (res.ok) {
        const data = await res.json();
        setProjects(data || []);
      }
    } catch (err) {
      console.error("Error fetching projects:", err);
    } finally {
      setLoadingProjects(false);
    }
  };

  const fetchSkills = async () => {
    setLoadingSkills(true);
    try {
      const res = await fetch("/api/skills");
      if (res.ok) {
        const data = await res.json();
        setSkills(data || []);
      }
    } catch (err) {
      console.error("Error fetching skills:", err);
    } finally {
      setLoadingSkills(false);
    }
  };

  const fetchSettings = async () => {
    setLoadingSettings(true);
    try {
      const res = await fetch("/api/settings");
      if (res.ok) {
        const data = await res.json();
        // Fallback default values if empty settings returned
        setSettings({
          heroTitle: data.heroTitle || "David Chilengwa",
          heroSubtitle: data.heroSubtitle || "Building high-performance, production-ready IT solutions with modern architecture, network resilience, and stateless container deployments.",
          aboutText: data.aboutText || "With a deep specialization in infrastructure resilience, secure edge telemetry integrations, and stateless server integrations, I bridge the gap between hardware systems and robust cloud integrations.",
          availableText: data.availableText || "Available for Consultations & Contracts",
          phone: data.phone || "+260768409033",
          email: data.email || "deavchile@gmail.com",
          homeMediaUrl: data.homeMediaUrl || ""
        });
        if (data.resumeFileName) {
          setResumeFileName(data.resumeFileName);
        }
      }
    } catch (err) {
      console.error("Error fetching settings:", err);
    } finally {
      setLoadingSettings(false);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === "Chilengwa" && password === "chile21") {
      localStorage.setItem("david_portfolio_admin_auth", "authenticated");
      setIsLoggedIn(true);
      setLoginError("");
    } else {
      setLoginError("Invalid administrator username or security key.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("david_portfolio_admin_auth");
    setIsLoggedIn(false);
    setUsername("");
    setPassword("");
  };

  // --- Project CRUD ---
  const handleDeleteProject = async (id) => {
    if (!confirm("Are you sure you want to delete this project document permanently from Firestore?")) {
      return;
    }
    try {
      const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
      if (res.ok) {
        showFeedback("Project deleted successfully.");
        setProjects(projects.filter(p => p.id !== id));
      } else {
        const data = await res.json();
        alert("Failed to delete: " + data.error);
      }
    } catch (err) {
      alert("Error deleting project: " + err.message);
    }
  };

  const startEditProject = (project) => {
    setEditingProject(project.id);
    setEditFormData({
      title: project.title,
      description: project.description,
      techStack: project.techStack,
      projectUrl: project.projectUrl || ""
    });
  };

  const handleEditProjectChange = (e) => {
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
  };

  const saveEditProject = async (id) => {
    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editFormData)
      });
      if (res.ok) {
        showFeedback("Project updated successfully.");
        setEditingProject(null);
        fetchProjects();
      } else {
        const data = await res.json();
        alert("Failed to update project: " + data.error);
      }
    } catch (err) {
      alert("Error updating project: " + err.message);
    }
  };

  // --- Skills CRUD ---
  const handleAddSkill = async (e) => {
    e.preventDefault();
    if (!newSkillCategory || !newSkillItems) {
      alert("Please fill out both category and items.");
      return;
    }
    try {
      const res = await fetch("/api/skills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category: newSkillCategory, items: newSkillItems })
      });
      if (res.ok) {
        showFeedback("Skill category added to Firestore.");
        setNewSkillCategory("");
        setNewSkillItems("");
        setShowAddSkillForm(false);
        fetchSkills();
      } else {
        const data = await res.json();
        alert("Failed to add skill category: " + data.error);
      }
    } catch (err) {
      alert("Error creating skill category: " + err.message);
    }
  };

  const handleDeleteSkill = async (id) => {
    if (!confirm("Are you sure you want to delete this skill category?")) {
      return;
    }
    try {
      const res = await fetch(`/api/skills/${id}`, { method: "DELETE" });
      if (res.ok) {
        showFeedback("Skill category deleted successfully.");
        setSkills(skills.filter(s => s.id !== id));
      } else {
        const data = await res.json();
        alert("Failed to delete skill: " + data.error);
      }
    } catch (err) {
      alert("Error deleting skill: " + err.message);
    }
  };

  const startEditSkill = (skill) => {
    setEditingSkill(skill.id);
    setEditSkillData({ category: skill.category, items: skill.items });
  };

  const saveEditSkill = async (id) => {
    try {
      const res = await fetch(`/api/skills/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editSkillData)
      });
      if (res.ok) {
        showFeedback("Skill category updated successfully.");
        setEditingSkill(null);
        fetchSkills();
      } else {
        const data = await res.json();
        alert("Failed to update skill: " + data.error);
      }
    } catch (err) {
      alert("Error updating skill: " + err.message);
    }
  };

  // --- Homepage Settings & File uploads ---
  const handleSettingsChange = (e) => {
    setSettings({ ...settings, [e.target.name]: e.target.value });
  };

  // Read HomePage image file to base64
  const handleHomeMediaFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setHomeMediaBase64(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Read CV/Resume PDF file to base64
  const handleResumeFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type !== "application/pdf") {
        alert("Please select a valid PDF document file.");
        return;
      }
      setResumeFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setResumeBase64(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const saveSettings = async (e) => {
    e.preventDefault();
    setIsSavingSettings(true);
    try {
      const payload = {
        ...settings,
        homeMediaBase64: homeMediaBase64 || undefined,
        resumeBase64: resumeBase64 || undefined,
        resumeFileName: resumeFileName || undefined
      };

      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        showFeedback("Global homepage configurations updated successfully.");
        setHomeMediaBase64("");
        setResumeBase64("");
        fetchSettings();
      } else {
        const data = await res.json();
        alert("Failed to save settings: " + data.error);
      }
    } catch (err) {
      alert("Error saving settings: " + err.message);
    } finally {
      setIsSavingSettings(false);
    }
  };

  const showFeedback = (msg) => {
    setStatusMessage(msg);
    setTimeout(() => setStatusMessage(""), 4000);
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex items-center justify-center p-4">
        <div className="max-w-md w-full rounded-2xl bg-slate-900 border border-slate-800 p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-sky-500 to-indigo-500" />
          
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center mx-auto mb-4">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold text-slate-100">David_Portfolio</h1>
            <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider font-mono">Administrative Portal Access</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-mono text-slate-400 uppercase">Username</label>
              <input 
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Chilengwa"
                className="w-full px-4 py-3 rounded-lg bg-slate-950 border border-slate-800 focus:border-sky-500 text-slate-100 text-sm outline-none transition-all placeholder:text-slate-800"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-mono text-slate-400 uppercase">Security Password</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-lg bg-slate-950 border border-slate-800 focus:border-sky-500 text-slate-100 text-sm outline-none transition-all placeholder:text-slate-800 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {loginError && (
              <div className="p-3 text-xs rounded bg-rose-500/10 border border-rose-500/20 text-rose-400 animate-pulse">
                {loginError}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold transition-all shadow-lg shadow-sky-500/10 active:scale-98"
            >
              Unlock Access Dashboard
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-800 text-center">
            <a href="/" className="text-xs text-slate-400 hover:text-sky-400 transition-colors inline-flex items-center space-x-1">
              <ChevronLeft className="w-3 h-3" />
              <span>Back to Public Portfolio</span>
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col justify-between">
      {/* Dynamic Console Header */}
      <header className="border-b border-slate-900 bg-slate-950/80 sticky top-0 z-50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-12 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-bold text-slate-100 text-lg">David_Portfolio</span>
            <span className="px-2.5 py-1 rounded bg-sky-500/10 border border-sky-500/20 text-[9px] text-sky-400 font-mono tracking-widest uppercase">Admin System Active</span>
          </div>

          <div className="flex items-center gap-4">
            <a 
              href="/admin/add-project" 
              className="px-4 py-2 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold transition-all flex items-center gap-1.5 shadow-md shadow-sky-500/10"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Post New Project</span>
            </a>
            <button 
              onClick={handleLogout}
              className="p-2 rounded-lg border border-slate-800 text-slate-400 hover:text-rose-400 hover:border-rose-500/30 transition-all cursor-pointer"
              title="Lock Admin Session"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-12 py-10 flex-grow">
        
        {/* Title area */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black tracking-tight">Administrative Control <span className="text-sky-400">Desk</span></h1>
            <p className="text-slate-400 text-sm mt-1">Manage database records, skills matrix categories, customize live copy, and upload credentials resume dynamically.</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></span>
            <span className="text-xs text-slate-400 font-mono">Dynamic Firestore Client Stream Connected</span>
          </div>
        </div>

        {/* Operational Tabs Navigation */}
        <div className="flex border-b border-slate-900 mb-8 gap-4 overflow-x-auto">
          <button
            onClick={() => setActiveTab("projects")}
            className={`py-3.5 px-4 text-sm font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "projects"
                ? "border-sky-500 text-sky-400"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <FolderKanban className="w-4 h-4" />
            Project Deployments ({projects.length})
          </button>
          <button
            onClick={() => setActiveTab("skills")}
            className={`py-3.5 px-4 text-sm font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "skills"
                ? "border-sky-500 text-sky-400"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Cpu className="w-4 h-4" />
            Technical Skills Matrix ({skills.length})
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={`py-3.5 px-4 text-sm font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "settings"
                ? "border-sky-500 text-sky-400"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Settings className="w-4 h-4" />
            Homepage Customize & CV Resume
          </button>
        </div>

        {/* Global Success / Warning Feedback toast */}
        {statusMessage && (
          <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 mb-8 text-sm flex items-center gap-2 animate-bounce">
            <Check className="w-4 h-4" />
            {statusMessage}
          </div>
        )}

        {/* TAB 1: PROJECTS MODULE */}
        {activeTab === "projects" && (
          <div className="space-y-6">
            {loadingProjects ? (
              <div className="flex items-center justify-center py-20">
                <div className="w-10 h-10 border-2 border-sky-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : projects.length === 0 ? (
              <div className="text-center py-16 border border-slate-900 rounded-2xl bg-slate-900/10">
                <FolderKanban className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-slate-300">No Projects Found</h3>
                <p className="text-sm text-slate-500 mt-1">Post custom project documents to populate your portfolios.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {projects.map((project) => (
                  <div 
                    key={project.id}
                    className="bg-slate-900/40 border border-slate-900 rounded-xl p-6 transition-all hover:border-slate-800"
                  >
                    {editingProject === project.id ? (
                      /* Edit State Form */
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-mono text-slate-400 uppercase">Project Name/Title</label>
                            <input 
                              type="text"
                              name="title"
                              value={editFormData.title}
                              onChange={handleEditProjectChange}
                              className="w-full px-3 py-2.5 text-sm rounded-lg bg-slate-950 border border-slate-850 focus:border-sky-500 text-slate-100 outline-none"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-mono text-slate-400 uppercase">Comma-Separated Tech Stack</label>
                            <input 
                              type="text"
                              name="techStack"
                              value={editFormData.techStack}
                              onChange={handleEditProjectChange}
                              className="w-full px-3 py-2.5 text-sm rounded-lg bg-slate-950 border border-slate-850 focus:border-sky-500 text-slate-100 outline-none"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1.5 md:col-span-2">
                            <label className="text-[10px] font-mono text-slate-400 uppercase">Live Deployment URL (Website Link)</label>
                            <input 
                              type="url"
                              name="projectUrl"
                              value={editFormData.projectUrl}
                              onChange={handleEditProjectChange}
                              placeholder="https://example.com/project"
                              className="w-full px-3 py-2.5 text-sm rounded-lg bg-slate-950 border border-slate-850 focus:border-sky-500 text-slate-100 outline-none"
                            />
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[10px] font-mono text-slate-400 uppercase">Project Description</label>
                          <textarea 
                            name="description"
                            value={editFormData.description}
                            onChange={handleEditProjectChange}
                            rows={4}
                            className="w-full px-3 py-2.5 text-sm rounded-lg bg-slate-950 border border-slate-850 focus:border-sky-500 text-slate-100 outline-none resize-none"
                          />
                        </div>

                        <div className="flex justify-end gap-2 pt-2">
                          <button 
                            onClick={() => setEditingProject(null)}
                            className="px-4 py-2 rounded-lg border border-slate-800 hover:bg-slate-800 text-slate-300 text-xs flex items-center gap-1 cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5" />
                            <span>Cancel</span>
                          </button>
                          <button 
                            onClick={() => saveEditProject(project.id)}
                            className="px-4 py-2 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold flex items-center gap-1 cursor-pointer"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Save to Firestore</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* Display State */
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                        <div className="flex items-start gap-4">
                          <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-slate-950 border border-slate-800">
                            <img 
                              src={project.imageUrl || "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=200&auto=format&fit=crop"} 
                              alt={project.title}
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h2 className="text-lg font-bold text-slate-100">{project.title}</h2>
                              {project.projectUrl && (
                                <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[8px] font-mono rounded tracking-widest uppercase">Has Website Link</span>
                              )}
                            </div>
                            <p className="text-xs text-slate-400 mt-1 line-clamp-2 max-w-2xl italic">{project.description}</p>
                            <div className="flex flex-wrap gap-1 mt-3">
                              {project.techStack.split(",").map((tech, idx) => (
                                <span key={idx} className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 border border-slate-850 text-slate-400">
                                  {tech.trim()}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                          <button 
                            onClick={() => startEditProject(project)}
                            className="p-2.5 rounded-lg border border-slate-800 text-slate-300 hover:text-sky-400 hover:border-sky-500/20 transition-all cursor-pointer"
                            title="Edit Record"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteProject(project.id)}
                            className="p-2.5 rounded-lg border border-slate-800 text-slate-400 hover:text-rose-400 hover:border-rose-500/20 transition-all cursor-pointer"
                            title="Delete Record"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: TECHNICAL SKILLS MODULE */}
        {activeTab === "skills" && (
          <div className="space-y-6">
            
            {/* Create Skill trigger bar */}
            <div className="flex justify-between items-center bg-slate-900/30 p-4 rounded-xl border border-slate-900">
              <span className="text-sm text-slate-400 font-mono">Operational Skill Documents</span>
              <button
                onClick={() => setShowAddSkillForm(!showAddSkillForm)}
                className="px-4 py-2 bg-sky-500 text-slate-950 hover:bg-sky-400 font-bold text-xs rounded-lg flex items-center gap-1.5 transition-all outline-none"
              >
                {showAddSkillForm ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                <span>{showAddSkillForm ? "Cancel New" : "Add Skill Category"}</span>
              </button>
            </div>

            {/* Create Skill Form */}
            {showAddSkillForm && (
              <form onSubmit={handleAddSkill} className="p-6 bg-slate-900 border border-slate-800 rounded-xl space-y-4 animate-fadeIn">
                <h3 className="text-sm font-bold uppercase tracking-widest text-sky-400">Create Skill category</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-slate-400 uppercase">Category name</label>
                    <input
                      type="text"
                      placeholder="e.g., Cloud & Infrastructure Orchestration"
                      value={newSkillCategory}
                      onChange={(e) => setNewSkillCategory(e.target.value)}
                      className="w-full px-3 py-2.5 text-sm rounded-lg bg-slate-950 border border-slate-850 focus:border-sky-500 text-slate-100 outline-none"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-slate-400 uppercase">Skills (Comma-separated items)</label>
                    <input
                      type="text"
                      placeholder="e.g., AWS Cloud, Terraform, Kubernetes, Helm"
                      value={newSkillItems}
                      onChange={(e) => setNewSkillItems(e.target.value)}
                      className="w-full px-3 py-2.5 text-sm rounded-lg bg-slate-950 border border-slate-850 focus:border-sky-500 text-slate-100 outline-none"
                      required
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="submit"
                    className="px-4 py-2.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Publish Skill to DB</span>
                  </button>
                </div>
              </form>
            )}

            {/* Skills List */}
            {loadingSkills ? (
              <div className="flex items-center justify-center py-20">
                <div className="w-10 h-10 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : skills.length === 0 ? (
              <div className="text-center py-16 border border-slate-900 rounded-2xl bg-slate-900/10">
                <Cpu className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-slate-300">No Skill Categories Added</h3>
                <p className="text-sm text-slate-500 mt-1">Create skill categories in the database to display in skills matrix.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {skills.map((skill) => (
                  <div
                    key={skill.id}
                    className="bg-slate-900/40 border border-slate-900 rounded-xl p-6 transition-all hover:border-slate-800"
                  >
                    {editingSkill === skill.id ? (
                      /* Edit Skill Form */
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-mono text-slate-400 uppercase">Category Name</label>
                            <input
                              type="text"
                              value={editSkillData.category}
                              onChange={(e) => setEditSkillData({ ...editSkillData, category: e.target.value })}
                              className="w-full px-3 py-2.5 text-sm rounded-lg bg-slate-950 border border-slate-850 focus:border-sky-500 text-slate-100 outline-none"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-mono text-slate-400 uppercase">Skills (Comma separated list)</label>
                            <input
                              type="text"
                              value={editSkillData.items}
                              onChange={(e) => setEditSkillData({ ...editSkillData, items: e.target.value })}
                              className="w-full px-3 py-2.5 text-sm rounded-lg bg-slate-950 border border-slate-850 focus:border-sky-500 text-slate-100 outline-none"
                            />
                          </div>
                        </div>
                        <div className="flex justify-end gap-2 pt-2">
                          <button
                            onClick={() => setEditingSkill(null)}
                            className="px-4 py-2 rounded-lg border border-slate-800 hover:bg-slate-800 text-slate-300 text-xs flex items-center gap-1 cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5" />
                            <span>Cancel</span>
                          </button>
                          <button
                            onClick={() => saveEditSkill(skill.id)}
                            className="px-4 py-2 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold flex items-center gap-1 cursor-pointer"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Save to DB</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* Display Skill row */
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                        <div className="flex-grow">
                          <h3 className="text-base font-bold text-slate-100 mb-2">{skill.category}</h3>
                          <div className="flex flex-wrap gap-1.5">
                            {skill.items.split(",").map((item, idx) => (
                              <span
                                key={idx}
                                className="px-2.5 py-1 text-[10px] rounded-lg bg-slate-950 border border-slate-850 text-slate-300 font-mono font-semibold"
                              >
                                {item.trim()}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                          <button
                            onClick={() => startEditSkill(skill)}
                            className="p-2.5 rounded-lg border border-slate-800 text-slate-300 hover:text-sky-400 hover:border-sky-500/20 transition-all cursor-pointer"
                            title="Edit Skill Category"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteSkill(skill.id)}
                            className="p-2.5 rounded-lg border border-slate-800 text-slate-400 hover:text-rose-400 hover:border-rose-500/20 transition-all cursor-pointer"
                            title="Delete Skill Category"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

          </div>
        )}

        {/* TAB 3: HOMEPAGE CUSTOMIZE & RESUME MODULE */}
        {activeTab === "settings" && (
          <div>
            {loadingSettings ? (
              <div className="flex items-center justify-center py-20">
                <div className="w-10 h-10 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <form onSubmit={saveSettings} className="space-y-6 bg-slate-900/20 border border-slate-900 p-6 sm:p-8 rounded-2xl">
                <div className="border-b border-slate-900 pb-4 mb-4">
                  <h3 className="text-base font-extrabold text-slate-100">Live Homepage customization</h3>
                  <p className="text-xs text-slate-400 mt-1">Directly customize landing content, available status indicators, and background brand assets.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Hero Title */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Hero Display Title</label>
                    <input
                      type="text"
                      name="heroTitle"
                      value={settings.heroTitle}
                      onChange={handleSettingsChange}
                      className="w-full px-4 py-3 text-sm rounded-lg bg-slate-950 border border-slate-850 focus:border-sky-500 text-slate-100 outline-none"
                    />
                  </div>

                  {/* Available indicator */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Availability Indicator Tag</label>
                    <input
                      type="text"
                      name="availableText"
                      value={settings.availableText}
                      onChange={handleSettingsChange}
                      className="w-full px-4 py-3 text-sm rounded-lg bg-slate-950 border border-slate-850 focus:border-sky-500 text-slate-100 outline-none"
                    />
                  </div>

                  {/* Subtitle / elevator description */}
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Hero Elevator Paragraph Subtitle</label>
                    <textarea
                      name="heroSubtitle"
                      value={settings.heroSubtitle}
                      onChange={handleSettingsChange}
                      rows={2}
                      className="w-full px-4 py-3 text-sm rounded-lg bg-slate-950 border border-slate-850 focus:border-sky-500 text-slate-100 outline-none resize-none"
                    />
                  </div>

                  {/* Professional Summary detailed bio */}
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">About Me Detailed Narrative Bio</label>
                    <textarea
                      name="aboutText"
                      value={settings.aboutText}
                      onChange={handleSettingsChange}
                      rows={4}
                      className="w-full px-4 py-3 text-sm rounded-lg bg-slate-950 border border-slate-850 focus:border-sky-500 text-slate-100 outline-none resize-none"
                    />
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Operational Phone Contact</label>
                    <input
                      type="text"
                      name="phone"
                      value={settings.phone}
                      onChange={handleSettingsChange}
                      className="w-full px-4 py-3 text-sm rounded-lg bg-slate-950 border border-slate-850 focus:border-sky-500 text-slate-100 outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Contact Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={settings.email}
                      onChange={handleSettingsChange}
                      className="w-full px-4 py-3 text-sm rounded-lg bg-slate-950 border border-slate-850 focus:border-sky-500 text-slate-100 outline-none"
                    />
                  </div>
                </div>

                {/* FILE UPLOAD SECTIONS */}
                <div className="border-t border-slate-900 pt-6 mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Cloudinary Homepage Media/Background Upload */}
                  <div className="bg-slate-950 border border-slate-850 rounded-xl p-5 space-y-4">
                    <h4 className="text-xs font-bold text-sky-400 uppercase tracking-wider flex items-center gap-2">
                      <Upload className="w-4 h-4" />
                      Homepage Background / Brand Image
                    </h4>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Upload an image as a background or side banner for the homepage. The image is uploaded directly to Cloudinary and is saved under homepage settings.
                    </p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleHomeMediaFile}
                      className="w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-slate-900 file:text-slate-300 hover:file:bg-slate-800"
                    />
                    {homeMediaBase64 && (
                      <div className="text-[10px] text-green-400 bg-green-500/5 px-2.5 py-1 rounded border border-green-500/10">
                        Image processed. Ready to upload to Cloudinary on Save!
                      </div>
                    )}
                    {settings.homeMediaUrl && (
                      <div className="pt-2">
                        <div className="text-[9px] text-slate-500 uppercase font-mono tracking-widest mb-1.5">Current Banner</div>
                        <img src={settings.homeMediaUrl} className="w-24 h-16 object-cover rounded-md border border-slate-800" referrerPolicy="no-referrer" />
                      </div>
                    )}
                  </div>

                  {/* Real PDF Resume / CV File Uploader */}
                  <div className="bg-slate-950 border border-slate-850 rounded-xl p-5 space-y-4">
                    <h4 className="text-xs font-bold text-sky-400 uppercase tracking-wider flex items-center gap-2">
                      <FileDown className="w-4 h-4" />
                      Real CV / Resume PDF Document
                    </h4>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Upload your real PDF resume. When visitors click the "Download Resume" or "CV" button anywhere on the portfolio, they will download this exact PDF!
                    </p>
                    <input
                      type="file"
                      accept="application/pdf"
                      onChange={handleResumeFile}
                      className="w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-slate-900 file:text-slate-300 hover:file:bg-slate-800"
                    />
                    {resumeBase64 && (
                      <div className="text-[10px] text-green-400 bg-green-500/5 px-2.5 py-1 rounded border border-green-500/10">
                        PDF analyzed: {resumeFileName}. Ready to publish on Save!
                      </div>
                    )}
                    {resumeFileName && !resumeBase64 && (
                      <div className="text-[10px] text-slate-400 bg-slate-900/40 px-2.5 py-1.5 rounded flex items-center gap-1.5 border border-slate-850">
                        <Info className="w-3.5 h-3.5 text-sky-400" />
                        <span>Active file in DB: <strong>{resumeFileName}</strong></span>
                      </div>
                    )}
                  </div>

                </div>

                {/* Save button */}
                <div className="border-t border-slate-900 pt-6 mt-6 flex justify-end">
                  <button
                    type="submit"
                    disabled={isSavingSettings}
                    className="px-6 py-3 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-sm rounded-lg flex items-center gap-1.5 shadow-lg shadow-sky-500/10 active:scale-98 disabled:opacity-50 cursor-pointer"
                  >
                    {isSavingSettings ? (
                      <>
                        <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                        <span>Publishing configs & Assets...</span>
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Publish Homepage Customizations</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-8 text-center text-slate-500 text-xs">
        <a href="/" className="hover:underline">Return to Public Homepage</a>
      </footer>
    </div>
  );
}
