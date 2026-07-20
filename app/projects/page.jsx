"use client";

import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { Search, ExternalLink, SlidersHorizontal, Layers, Terminal, Sparkles, FolderKanban } from "lucide-react";

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTech, setSelectedTech] = useState("All");

  useEffect(() => {
    async function fetchProjects() {
      try {
        const res = await fetch("/api/projects");
        if (res.ok) {
          const data = await res.json();
          setProjects(data || []);
        }
      } catch (err) {
        console.error("Error fetching projects:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, []);

  // Filter project categories/tech unique tags
  const allTechs = ["All"];
  projects.forEach((proj) => {
    if (proj.techStack) {
      proj.techStack.split(",").forEach((tech) => {
        const clean = tech.trim();
        if (clean && !allTechs.includes(clean)) {
          allTechs.push(clean);
        }
      });
    }
  });

  // Filter projects by search query and category selector
  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (project.techStack && project.techStack.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesTech =
      selectedTech === "All" ||
      (project.techStack &&
        project.techStack.split(",").map((t) => t.trim().toLowerCase()).includes(selectedTech.toLowerCase()));

    return matchesSearch && matchesTech;
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans flex flex-col transition-all duration-300">
      <Navbar />

      {/* Hero Banner Area */}
      <section className="relative overflow-hidden py-16 px-4 sm:px-12 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-900">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(14,165,233,0.08),transparent_50%)]" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-600 dark:text-sky-400 text-xs font-bold tracking-widest uppercase mb-4 animate-pulse">
            <FolderKanban className="w-3.5 h-3.5" />
            Dynamic Portfolio Database
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-4">
            Mission-Critical <span className="text-sky-500 dark:text-sky-400">Deployments</span>
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl">
            Explore a fully searchable catalogue of David's custom full-stack solutions, distributed cloud designs, and high-performance system architectures.
          </p>
        </div>
      </section>

      {/* Main Dynamic View */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-12 py-10 flex flex-col gap-8">
        
        {/* Advanced Filters and Search Module */}
        <div className="bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm flex flex-col lg:flex-row gap-4 items-center justify-between">
          
          {/* Search Inputs */}
          <div className="relative w-full lg:max-w-md">
            <Search className="absolute left-3.5 top-3.5 text-slate-400 w-4 h-4" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, stack, keyword..."
              className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 text-sm outline-none focus:border-sky-500 transition-all placeholder:text-slate-400"
            />
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap gap-2 w-full lg:w-auto justify-start lg:justify-end">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5 mr-2 self-center">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              Filter Stack:
            </span>
            <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
              {allTechs.slice(0, 10).map((tech) => (
                <button
                  key={tech}
                  onClick={() => setSelectedTech(tech)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    selectedTech === tech
                      ? "bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20"
                      : "bg-slate-100 hover:bg-slate-200 dark:bg-slate-950 dark:hover:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400"
                  }`}
                >
                  {tech}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Dynamic Project Grid list */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-12 h-12 border-4 border-sky-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-xs font-mono text-slate-400 uppercase tracking-widest animate-pulse">Syncing Projects with Firestore...</span>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl bg-white dark:bg-slate-900/10">
            <Terminal className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
            <h3 className="text-lg font-bold mb-1">No Projects Found</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm max-w-md mx-auto">
              No matching records found for "{searchQuery}" in our system. Try clearing filters or searching for another keyword.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project, index) => (
              <div
                key={project.id}
                className="group bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col overflow-hidden shadow-sm hover:shadow-xl dark:hover:border-sky-500/30 hover:border-sky-500/30 transition-all duration-300 relative"
              >
                {/* Accent glow on hover */}
                <div className="absolute inset-0 bg-gradient-to-tr from-sky-500/0 via-sky-500/0 to-sky-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                {/* Cover Media */}
                <div className="h-48 bg-slate-100 dark:bg-slate-950 relative overflow-hidden border-b border-slate-200 dark:border-slate-800">
                  <img
                    src={project.imageUrl || "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=600&auto=format&fit=crop"}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-md text-[9px] font-mono font-bold tracking-widest text-sky-400 border border-sky-400/20 uppercase">
                    DEPLOYED
                  </div>
                </div>

                {/* Content info */}
                <div className="p-6 flex flex-col flex-grow relative z-10">
                  <h4 className="text-lg font-bold mb-2 group-hover:text-sky-500 dark:group-hover:text-sky-400 transition-colors">
                    {project.title}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-4 mb-6 leading-relaxed flex-grow italic">
                    {project.description}
                  </p>

                  <div className="mt-auto space-y-4">
                    {/* Tech Stack pills */}
                    <div className="flex flex-wrap gap-1.5 pt-3 border-t border-slate-100 dark:border-slate-800/60">
                      {project.techStack &&
                        project.techStack.split(",").map((tech, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 bg-slate-100 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-[10px] rounded font-semibold text-slate-700 dark:text-slate-300"
                          >
                            {tech.trim()}
                          </span>
                        ))}
                    </div>

                    {/* External Project URL link button */}
                    <div className="pt-2 flex justify-between items-center">
                      <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500">
                        ID: #{project.id.substring(0, 8)}
                      </span>
                      <a
                        href={project.projectUrl || `https://google.com/search?q=David+Chilengwa+${encodeURIComponent(project.title)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold bg-sky-500/10 text-sky-600 dark:text-sky-400 hover:bg-sky-500 dark:hover:bg-sky-500 hover:text-slate-950 dark:hover:text-slate-950 transition-all outline-none"
                      >
                        Visit Project
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </main>

      {/* Footer bar */}
      <footer className="flex-none h-20 border-t border-slate-200 dark:border-slate-900 bg-white dark:bg-slate-950 flex flex-col sm:flex-row items-center justify-between px-4 sm:px-12 text-[10px] uppercase tracking-[0.2em] text-slate-500 gap-2 sm:gap-0 mt-16">
        <div>© 2026 David_Portfolio // Production Ready</div>
        <div className="flex gap-6">
          <span>Systems Cloud Active</span>
          <a href="/admin/dashboard" className="text-slate-400 hover:text-sky-500 transition-colors">Admin Portal</a>
        </div>
      </footer>
    </div>
  );
}
