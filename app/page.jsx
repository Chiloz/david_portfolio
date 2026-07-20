"use client";

import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import { 
  Cpu, 
  Database, 
  Shield, 
  Code, 
  ExternalLink, 
  Download, 
  Mail, 
  Phone,
  ArrowRight,
  Sparkles,
  Terminal,
  FolderKanban,
  Server
} from "lucide-react";

export default function HomePage() {
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  // Custom live homepage settings
  const [settings, setSettings] = useState({
    heroTitle: "David Chilengwa",
    heroSubtitle: "Building high-performance, production-ready IT solutions with modern architecture, network resilience, and stateless container deployments.",
    aboutText: "With a deep specialization in infrastructure resilience, secure edge telemetry integrations, and stateless server integrations, I bridge the gap between hardware systems and robust cloud integrations.",
    availableText: "Available for Consultations & Contracts",
    phone: "+260768409033",
    email: "deavchile@gmail.com",
    homeMediaUrl: ""
  });

  // Fallback default projects
  const defaultProjects = [
    {
      id: "fallback-1",
      title: "Zambian National Cloud Infrastructure Integration",
      description: "Implemented high-availability multi-tenant cloud architectures to host unified public service gateways. Built with robust secure networks and automated scaling parameters.",
      techStack: "Cloud Architectures, Terraform, Kubernetes, AWS",
      imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=600&auto=format&fit=crop",
      projectUrl: ""
    },
    {
      id: "fallback-2",
      title: "Afri-Tech Secure IoT Edge Gateway",
      description: "Designed a high-security telemetry stream forwarding edge sensor readings into real-time analytical dashboards. Operates reliably under low bandwidth settings.",
      techStack: "IoT, Node.js, MQTT, Express, Firestore",
      imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=600&auto=format&fit=crop",
      projectUrl: ""
    }
  ];

  // Fallback default skills
  const defaultSkills = [
    { category: "Infrastructure & DevOps", items: "AWS Cloud, Docker & Kubernetes, Terraform & IaC, CI/CD Pipelines, Linux Administration" },
    { category: "Database & Backends", items: "Firebase Firestore, PostgreSQL / Cloud SQL, MongoDB, Express.js / Node.js" },
    { category: "Security & Networking", items: "Zero Trust Security, IAM Policies & RBAC, VPC & Subnetting, OAuth Integration" },
    { category: "Frontend & Design", items: "React / Next.js, Tailwind CSS, TypeScript & ESNext, Responsive Design System" }
  ];

  useEffect(() => {
    async function initPage() {
      try {
        // Fetch Projects
        const projRes = await fetch("/api/projects");
        if (projRes.ok) {
          const projData = await projRes.json();
          if (projData && projData.length > 0) {
            setProjects(projData);
          } else {
            setProjects(defaultProjects);
          }
        } else {
          setProjects(defaultProjects);
        }

        // Fetch Skills
        const skillsRes = await fetch("/api/skills");
        if (skillsRes.ok) {
          const skillsData = await skillsRes.json();
          if (skillsData && skillsData.length > 0) {
            setSkills(skillsData);
          } else {
            setSkills(defaultSkills);
          }
        } else {
          setSkills(defaultSkills);
        }

        // Fetch Custom Settings
        const settingsRes = await fetch("/api/settings");
        if (settingsRes.ok) {
          const settingsData = await settingsRes.json();
          setSettings({
            heroTitle: settingsData.heroTitle || "David Chilengwa",
            heroSubtitle: settingsData.heroSubtitle || "Building high-performance, production-ready IT solutions with modern architecture, network resilience, and stateless container deployments.",
            aboutText: settingsData.aboutText || "With a deep specialization in infrastructure resilience, secure edge telemetry integrations, and stateless server integrations, I bridge the gap between hardware systems and robust cloud integrations.",
            availableText: settingsData.availableText || "Available for Consultations & Contracts",
            phone: settingsData.phone || "+260768409033",
            email: settingsData.email || "deavchile@gmail.com",
            homeMediaUrl: settingsData.homeMediaUrl || ""
          });
        }
      } catch (err) {
        console.error("Error initializing homepage:", err);
        setProjects(defaultProjects);
        setSkills(defaultSkills);
      } finally {
        setLoading(false);
      }
    }
    initPage();
  }, []);

  const getCategoryIcon = (categoryName) => {
    const norm = categoryName.toLowerCase();
    if (norm.includes("infra") || norm.includes("devops") || norm.includes("cloud")) {
      return <Cpu className="w-4 h-4 text-sky-500" />;
    } else if (norm.includes("db") || norm.includes("data") || norm.includes("backend") || norm.includes("server")) {
      return <Server className="w-4 h-4 text-indigo-500" />;
    } else if (norm.includes("sec") || norm.includes("net") || norm.includes("trust") || norm.includes("vpc")) {
      return <Shield className="w-4 h-4 text-emerald-500" />;
    } else {
      return <Code className="w-4 h-4 text-purple-500" />;
    }
  };

  const handleDownload = () => {
    window.open("/api/resume/download", "_blank");
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-sky-500 selection:text-white flex flex-col transition-all duration-300 relative">
      <Navbar />

      {/* Hero background image if posted directly on homepage */}
      {settings.homeMediaUrl && (
        <div className="absolute inset-0 max-h-[500px] overflow-hidden pointer-events-none z-0">
          <img 
            src={settings.homeMediaUrl} 
            alt="Homepage Cover Asset" 
            className="w-full h-full object-cover opacity-10 dark:opacity-5 blur-sm"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-50 dark:to-slate-950" />
        </div>
      )}

      {/* Main Content Split Grid */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-12 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12 overflow-hidden relative z-10">
        
        {/* Left Column: Hero & Intro */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-12">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-600 dark:text-sky-400 text-xs font-bold tracking-widest uppercase">
              <Sparkles className="w-3.5 h-3.5 animate-spin" />
              <span>Full-Stack & Cloud Systems Architect</span>
            </div>
            
            <h1 className="text-5xl sm:text-6xl font-black tracking-tight leading-none">
              {settings.heroTitle.split(" ").map((word, idx) => (
                <span key={idx} className={idx === 1 ? "text-slate-400 dark:text-slate-500 block" : "block"}>
                  {word}
                </span>
              ))}
            </h1>
            
            <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed max-w-md">
              {settings.heroSubtitle}
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={handleDownload}
                className="px-8 py-4 bg-sky-500 text-slate-950 font-bold rounded-xl shadow-lg shadow-sky-500/20 flex items-center justify-center gap-2 hover:bg-sky-450 active:scale-95 transition-all outline-none cursor-pointer"
              >
                <span>Download Resume</span>
                <Download className="w-4 h-4" />
              </button>
              <a 
                href="/contact" 
                className="px-8 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-bold rounded-xl text-center hover:border-sky-500 dark:hover:border-sky-500 transition-colors text-slate-700 dark:text-slate-200 block shadow-sm"
              >
                Inquire Collaboration
              </a>
            </div>
            
            <div className="flex flex-wrap items-center gap-y-3 gap-x-6 pt-6 border-t border-slate-200 dark:border-slate-900 text-slate-500 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></div> 
                <span className="text-slate-700 dark:text-slate-300 font-semibold">{settings.availableText}</span>
              </div>
              <div className="font-mono text-slate-600 dark:text-slate-400">{settings.phone}</div>
              <a href={`mailto:${settings.email}`} className="italic underline hover:text-sky-500 dark:hover:text-sky-400 transition-colors text-slate-600 dark:text-slate-300">{settings.email}</a>
            </div>
          </div>
        </div>

        {/* Right Column: Skills & Projects Preview */}
        <div className="lg:col-span-7 flex flex-col gap-10">
          
          {/* About Me Details Section */}
          <section id="about" className="bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/60 p-6 sm:p-8 rounded-2xl relative overflow-hidden shadow-sm">
            <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-sky-500/5 to-transparent pointer-events-none" />
            <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4">Professional Narrative Biography</h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-sm mb-4">
              {settings.aboutText}
            </p>
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-xs font-medium">
              Operated in Lusaka, Zambia. David engineers customized software integrations, VPC network layouts, and automated container deployment pipelines with deep mitigation against latency and downtime vectors.
            </p>
          </section>

          {/* Technical Skills Bento Preview */}
          <section id="skills" className="bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Active Skills Matrix Nodes</h3>
              <a href="/skills" className="text-xs font-bold text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-1 group">
                <span>View Full Skills page</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {skills.slice(0, 4).map((skill, index) => (
                  <div key={index} className="space-y-1.5 p-3.5 bg-slate-50 dark:bg-slate-950/60 border border-slate-150 dark:border-slate-850 rounded-xl hover:border-sky-500/20 transition-all">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                      {getCategoryIcon(skill.category)}
                      {skill.category}
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {skill.items.split(",").slice(0, 4).map((item, i) => (
                        <span key={i} className="text-[9px] font-mono font-bold px-2 py-0.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400">
                          {item.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Projects Preview Grid */}
          <section id="projects" className="flex-grow flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Featured Deployments</h3>
              <a href="/projects" className="text-xs font-bold text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-1 group">
                <span>View All Projects Catalogue</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 border-2 border-sky-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {projects.slice(0, 2).map((project) => (
                  <div 
                    key={project.id} 
                    className="bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col p-5 group hover:border-sky-500/30 dark:hover:border-sky-500/30 shadow-sm transition-all duration-300 relative"
                  >
                    <div className="h-32 bg-slate-100 dark:bg-slate-950 rounded-xl mb-4 border border-slate-200 dark:border-slate-800 overflow-hidden relative">
                      <img 
                        src={project.imageUrl || "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=600&auto=format&fit=crop"} 
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-tr from-sky-500/10 to-transparent mix-blend-overlay"></div>
                    </div>
                    
                    <h4 className="text-base font-bold mb-1 text-slate-800 dark:text-slate-100 group-hover:text-sky-500 dark:group-hover:text-sky-400 transition-colors line-clamp-1">
                      {project.title}
                    </h4>
                    
                    <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3 mb-4 italic leading-relaxed flex-grow">
                      {project.description}
                    </p>

                    <div className="mt-auto pt-3 border-t border-slate-100 dark:border-slate-800/60 flex flex-wrap gap-1.5 items-center justify-between">
                      <div className="flex flex-wrap gap-1">
                        {project.techStack.split(",").slice(0, 2).map((tech, idx) => (
                          <span key={idx} className="px-2 py-0.5 bg-slate-100 dark:bg-slate-950 text-[9px] rounded font-semibold text-slate-700 dark:text-slate-400 border border-slate-200 dark:border-slate-850">
                            {tech.trim()}
                          </span>
                        ))}
                      </div>
                      <a 
                        href={project.projectUrl || `/projects`}
                        target={project.projectUrl ? "_blank" : "_self"}
                        rel="noopener noreferrer"
                        className="p-1 text-sky-500 hover:text-sky-400 hover:scale-110 transition-all"
                        title="Visit Live Deployment website"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

        </div>
      </main>

      {/* Footer bar */}
      <footer className="flex-none h-20 border-t border-slate-200 dark:border-slate-900 bg-white dark:bg-slate-950 flex flex-col sm:flex-row items-center justify-between px-4 sm:px-12 text-[10px] uppercase tracking-[0.2em] text-slate-500 gap-2 sm:gap-0 mt-12 relative z-10">
        <div>© 2026 David_Portfolio // Production Ready</div>
        <div className="flex gap-6">
          <span>Systems Cloud Active</span>
          <a href="/admin/dashboard" className="text-slate-400 hover:text-sky-500 transition-colors">Admin Portal</a>
        </div>
      </footer>
    </div>
  );
}
