"use client";

import React, { useState, useEffect } from "react";
import { Menu, X, Sun, Moon, Download, Shield } from "lucide-react";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("portfolio-theme");
      if (saved) return saved;
      const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      return systemPrefersDark ? "dark" : "light";
    }
    return "dark";
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
      root.classList.remove("light");
    } else {
      root.classList.add("light");
      root.classList.remove("dark");
    }
    localStorage.setItem("portfolio-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const downloadResume = () => {
    window.open("/api/resume/download", "_blank");
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Projects", href: "/projects" },
    { name: "Skills", href: "/skills" },
    { name: "Contact", href: "/contact" }
  ];

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/70 dark:bg-slate-950/70 border-b border-slate-200 dark:border-slate-800/50 transition-all duration-300 shadow-sm dark:shadow-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-12 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <a href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-sky-500 rounded-lg flex items-center justify-center font-bold text-slate-950 text-xl shadow-lg shadow-sky-500/20 group-hover:scale-105 transition-all">
            D
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight uppercase block text-slate-900 dark:text-slate-100 group-hover:text-sky-500 dark:group-hover:text-sky-400 transition-colors">
              David_Portfolio
            </span>
            <span className="text-[9px] font-mono tracking-widest text-sky-500 dark:text-sky-400 uppercase -mt-1 block">
              IT Architect
            </span>
          </div>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-8 text-sm font-semibold">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-slate-600 dark:text-slate-400 hover:text-sky-500 dark:hover:text-sky-400 transition-all duration-200 relative py-1 group"
            >
              {link.name}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-sky-500 transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </nav>

        {/* Action Controls */}
        <div className="hidden md:flex items-center gap-4">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-sky-500 dark:hover:text-sky-400 hover:border-sky-500 dark:hover:border-sky-500 hover:scale-105 transition-all outline-none cursor-pointer"
            title={theme === "dark" ? "Activate Light Mode" : "Activate Dark Mode"}
          >
            {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Resume Download */}
          <button
            onClick={downloadResume}
            className="px-5 py-2 rounded-full bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-sky-500/10 hover:shadow-sky-500/25 active:scale-95 transition-all outline-none cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>CV</span>
          </button>

          {/* Admin Gateway */}
          <a
            href="/admin/dashboard"
            className="px-5 py-2 bg-slate-900 border border-slate-800 text-slate-300 hover:text-sky-400 hover:border-sky-500 rounded-full text-xs font-semibold transition-all"
          >
            ADMIN AREA
          </a>
        </div>

        {/* Mobile menu trigger + theme toggle */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300"
          >
            {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 focus:outline-none"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {mobileMenuOpen && (
        <div className="absolute top-20 left-0 w-full md:hidden border-b border-slate-200 dark:border-slate-800/80 bg-white/95 dark:bg-slate-950/95 backdrop-blur-lg px-6 py-6 space-y-4 shadow-xl z-50">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block text-base font-bold text-slate-800 dark:text-slate-300 hover:text-sky-500 dark:hover:text-sky-400 transition-colors"
            >
              {link.name}
            </a>
          ))}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-900 flex flex-col gap-3">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                downloadResume();
              }}
              className="w-full text-center px-4 py-3 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold transition-all flex items-center justify-center gap-2 shadow-lg"
            >
              <Download className="w-4 h-4" />
              <span>Download Resume</span>
            </button>
            <a
              href="/admin/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center px-4 py-3 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-bold text-sm block"
            >
              Admin Area Gateway
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
