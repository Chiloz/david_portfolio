"use client";

import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { Cpu, Terminal, Shield, Code, Search, Sparkles, Server, CheckCircle } from "lucide-react";

export default function SkillsPage() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const defaultSkills = [
    { id: "def-1", category: "Infrastructure & DevOps", items: "AWS Cloud, Docker & Kubernetes, Terraform & IaC, CI/CD Pipelines, Linux Administration" },
    { id: "def-2", category: "Database & Backends", items: "Firebase Firestore, PostgreSQL / Cloud SQL, MongoDB, Express.js / Node.js, RESTful API Engineering" },
    { id: "def-3", category: "Security & Networking", items: "Zero Trust Security, IAM Policies & RBAC, VPC & Subnetting, OAuth Integration, Secure Cloud CDN" },
    { id: "def-4", category: "Frontend & Design", items: "React / Next.js, Tailwind CSS, TypeScript & ESNext, Responsive Design System, Framer Motion Effects" }
  ];

  useEffect(() => {
    async function fetchSkills() {
      try {
        const res = await fetch("/api/skills");
        if (res.ok) {
          const data = await res.json();
          if (data && data.length > 0) {
            setSkills(data);
          } else {
            setSkills(defaultSkills);
          }
        } else {
          setSkills(defaultSkills);
        }
      } catch (err) {
        console.error("Error fetching skills:", err);
        setSkills(defaultSkills);
      } finally {
        setLoading(false);
      }
    }
    fetchSkills();
  }, []);

  const getCategoryIcon = (categoryName) => {
    const norm = categoryName.toLowerCase();
    if (norm.includes("infra") || norm.includes("devops") || norm.includes("cloud")) {
      return <Cpu className="w-6 h-6 text-sky-500" />;
    } else if (norm.includes("db") || norm.includes("data") || norm.includes("backend") || norm.includes("server")) {
      return <Server className="w-6 h-6 text-indigo-500" />;
    } else if (norm.includes("sec") || norm.includes("net") || norm.includes("trust") || norm.includes("vpc")) {
      return <Shield className="w-6 h-6 text-emerald-500" />;
    } else {
      return <Code className="w-6 h-6 text-purple-500" />;
    }
  };

  // Filter skills by search query
  const filteredSkills = skills.filter((skill) => {
    const matchCategory = skill.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchItems = skill.items.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory || matchItems;
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans flex flex-col transition-all duration-300">
      <Navbar />

      {/* Header section */}
      <section className="relative overflow-hidden py-16 px-4 sm:px-12 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-900">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(14,165,233,0.08),transparent_50%)]" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-bold tracking-widest uppercase mb-4 animate-pulse">
            <Sparkles className="w-3.5 h-3.5" />
            Core Competence Matrices
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-4">
            Technical <span className="text-sky-500 dark:text-sky-400">Capabilities</span>
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl">
            A comprehensive overview of David's technical proficiencies across cloud environments, DevOps orchestration, complex networking, and custom software stacks.
          </p>
        </div>
      </section>

      {/* Main Dynamic View */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-12 py-10 flex flex-col gap-8">
        
        {/* Search Filter Module */}
        <div className="bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:max-w-lg">
            <Search className="absolute left-3.5 top-3.5 text-slate-400 w-4 h-4" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search across skills, frameworks, tags..."
              className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 text-sm outline-none focus:border-sky-500 transition-all placeholder:text-slate-400"
            />
          </div>
          <span className="text-xs font-mono text-slate-400 dark:text-slate-500 tracking-wider">
            Total Categories Loaded: {filteredSkills.length}
          </span>
        </div>

        {/* Dynamic Skills Bento Cards */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-xs font-mono text-slate-400 uppercase tracking-widest animate-pulse">Retrieving Skills Matrices...</span>
          </div>
        ) : filteredSkills.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl bg-white dark:bg-slate-900/10">
            <Terminal className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
            <h3 className="text-lg font-bold mb-1">No Capabilities Match</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm max-w-md mx-auto">
              We couldn't find any skill categories matching your search criteria. Check your spelling or try using alternative keywords.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredSkills.map((skill, index) => (
              <div
                key={skill.id || index}
                className="group p-6 sm:p-8 bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm hover:shadow-xl hover:border-sky-500/30 dark:hover:border-sky-500/30 transition-all duration-300 relative overflow-hidden"
              >
                {/* Visual Glow Ornament */}
                <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-gradient-to-tr from-sky-500/5 to-transparent rounded-full blur-2xl group-hover:scale-125 transition-transform" />

                <div className="flex items-start gap-4 relative z-10">
                  <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 group-hover:scale-105 transition-transform">
                    {getCategoryIcon(skill.category)}
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 group-hover:text-sky-500 dark:group-hover:text-sky-400 transition-colors mb-2">
                      {skill.category}
                    </h3>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mb-6 uppercase tracking-wider font-semibold font-mono">
                      Sub-specialization Nodes
                    </p>

                    {/* Skill Pills List */}
                    <div className="flex flex-wrap gap-2">
                      {skill.items.split(",").map((item, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-1.5 px-3 py-2 bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-xl hover:border-sky-500/25 dark:hover:border-sky-500/25 transition-colors group/item"
                        >
                          <CheckCircle className="w-3.5 h-3.5 text-sky-500 flex-none" />
                          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 group-hover/item:text-slate-900 dark:group-hover/item:text-slate-100 transition-colors">
                            {item.trim()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Security / System Resilience Disclaimer Callout */}
        <section className="bg-gradient-to-r from-sky-500/5 via-indigo-500/5 to-transparent border border-slate-200 dark:border-slate-800/60 p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 mt-8">
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Shield className="w-4 h-4 text-sky-500" />
              Standard Compliance & Zero-Trust
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-2xl">
              All listed technologies are applied in coordination with strict VPC isolation parameters, proper identity role controls, database encryption, and automated server pipeline deployments.
            </p>
          </div>
          <a
            href="/contact"
            className="px-6 py-3 bg-slate-900 border border-slate-800 hover:border-sky-500 text-sky-400 font-bold rounded-xl text-xs flex items-center justify-center gap-2 hover:scale-102 active:scale-98 transition-all"
          >
            Inquire Technical Advisory
          </a>
        </section>

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
