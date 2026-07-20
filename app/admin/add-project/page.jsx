"use client";

import React, { useState, useEffect } from "react";
import { 
  ArrowLeft, 
  Upload, 
  FileImage, 
  CheckCircle2, 
  X, 
  Plus, 
  Lock, 
  Eye, 
  EyeOff, 
  Sparkles 
} from "lucide-react";

export default function AddProjectPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [techStack, setTechStack] = useState("");
  const [projectUrl, setProjectUrl] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageBase64, setImageBase64] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const sessionToken = localStorage.getItem("david_portfolio_admin_auth");
    if (sessionToken === "authenticated") {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === "Chilengwa" && password === "chile21") {
      localStorage.setItem("david_portfolio_admin_auth", "authenticated");
      setIsLoggedIn(true);
      setLoginError("");
    } else {
      setLoginError("Invalid administrator credentials.");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 8 * 1024 * 1024) { // 8MB limit
      alert("Image size exceeds 8MB limit. Please select a smaller asset.");
      return;
    }

    setImageFile(file);

    // Read file as Base64 for the API payload
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
      setImageBase64(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      if (file.size > 8 * 1024 * 1024) {
        alert("Image size exceeds 8MB limit.");
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setImageBase64(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setImageBase64("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description || !techStack || !imageBase64) {
      setErrorMessage("Please ensure all fields are populated, and an image asset is selected.");
      return;
    }

    setSubmitting(true);
    setErrorMessage("");
    setStatusMessage("Uploading asset payload to Cloudinary and writing to Firestore...");

    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          techStack,
          projectUrl,
          imageBase64
        })
      });

      const data = await res.json();
      if (res.ok) {
        setStatusMessage("Project record successfully established!");
        setTitle("");
        setDescription("");
        setTechStack("");
        setProjectUrl("");
        clearImage();
        // Redirect to dashboard
        setTimeout(() => {
          window.location.href = "/admin/dashboard";
        }, 1500);
      } else {
        setErrorMessage(data.error || "Failed to create project record.");
        setSubmitting(false);
      }
    } catch (err) {
      setErrorMessage("An unexpected network exception occurred: " + err.message);
      setSubmitting(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex items-center justify-center p-4">
        <div className="max-w-md w-full rounded-2xl bg-slate-900 border border-slate-800 p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-sky-500 to-blue-500" />
          
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center mx-auto mb-4">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold text-slate-100">David_Portfolio</h1>
            <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider font-mono">Administrative Lockscreen</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-mono text-slate-400 uppercase">Username</label>
              <input 
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Chilengwa"
                className="w-full px-4 py-3 rounded-lg bg-slate-950 border border-slate-850 focus:border-sky-500 text-slate-100 text-sm outline-none transition-all placeholder:text-slate-800"
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
                  className="w-full px-4 py-3 rounded-lg bg-slate-950 border border-slate-850 focus:border-sky-500 text-slate-100 text-sm outline-none transition-all placeholder:text-slate-800 pr-10"
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
              <div className="p-3 text-xs rounded bg-rose-500/10 border border-rose-500/20 text-rose-400">
                {loginError}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold transition-all shadow-lg shadow-sky-500/10"
            >
              Unlock Access Dashboard
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-800 text-center">
            <a href="/" className="text-xs text-slate-400 hover:text-sky-400 transition-colors inline-flex items-center space-x-1">
              <ArrowLeft className="w-3 h-3" />
              <span>Back to Public Portfolio</span>
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col justify-between">
      {/* Navigation Header */}
      <header className="border-b border-slate-900 bg-slate-950/80 sticky top-0 z-50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <a href="/admin/dashboard" className="flex items-center space-x-2 text-slate-300 hover:text-sky-400 transition-colors group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium">Back to Console</span>
          </a>
          <span className="text-sm text-slate-400 font-mono">Create Portfolio Record</span>
        </div>
      </header>

      {/* Form Content */}
      <main className="max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-grow">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-100">Add New Project Case</h1>
          <p className="text-slate-400 text-sm mt-1">Submit technical artifacts, tech stacks, and cloud layouts to showcase David Chilengwa's IT capabilities.</p>
        </div>

        <div className="bg-slate-900/40 border border-slate-900 rounded-2xl p-8 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-sky-400 to-indigo-500" />
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="title" className="text-xs font-mono text-slate-400 uppercase">Project Title / Deployment Name *</label>
              <input 
                type="text" 
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Copperbelt Telecommunications Edge Gateway"
                className="w-full px-4 py-3 rounded-lg bg-slate-950 border border-slate-850 focus:border-sky-500 text-slate-100 text-sm font-medium outline-none transition-all placeholder:text-slate-800"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="techStack" className="text-xs font-mono text-slate-400 uppercase">Technologies Utilized (Comma-separated) *</label>
                <input 
                  type="text" 
                  id="techStack"
                  value={techStack}
                  onChange={(e) => setTechStack(e.target.value)}
                  placeholder="e.g. Docker, Terraform, Firebase, AWS Cloud"
                  className="w-full px-4 py-3 rounded-lg bg-slate-950 border border-slate-850 focus:border-sky-500 text-slate-100 text-sm font-medium outline-none transition-all placeholder:text-slate-800"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="projectUrl" className="text-xs font-mono text-slate-400 uppercase">Project Website / Deployment Link (Optional)</label>
                <input 
                  type="url" 
                  id="projectUrl"
                  value={projectUrl}
                  onChange={(e) => setProjectUrl(e.target.value)}
                  placeholder="e.g. https://my-deployed-project.com"
                  className="w-full px-4 py-3 rounded-lg bg-slate-950 border border-slate-850 focus:border-sky-500 text-slate-100 text-sm font-medium outline-none transition-all placeholder:text-slate-800"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="description" className="text-xs font-mono text-slate-400 uppercase">Project Case Description *</label>
              <textarea 
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={5}
                placeholder="Outline David's functional responsibilities, architectural challenges solved, and infrastructure metrics achieved..."
                className="w-full px-4 py-3 rounded-lg bg-slate-950 border border-slate-850 focus:border-sky-500 text-slate-100 text-sm font-medium outline-none transition-all placeholder:text-slate-800 resize-none"
                required
              />
            </div>

            {/* Image File Selector with Drag-and-Drop support */}
            <div className="space-y-2">
              <label className="text-xs font-mono text-slate-400 uppercase block">Project Image Asset *</label>
              
              {!imagePreview ? (
                <div 
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  className="border-2 border-dashed border-slate-800 hover:border-sky-500/40 rounded-xl p-8 text-center cursor-pointer bg-slate-950/40 hover:bg-slate-950/80 transition-all group relative"
                >
                  <input 
                    type="file" 
                    id="imageFile"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <Upload className="w-8 h-8 text-slate-600 group-hover:text-sky-400 mx-auto mb-3 transition-colors" />
                  <p className="text-sm font-medium text-slate-300">Drag and drop project image here, or <span className="text-sky-400">browse folders</span></p>
                  <p className="text-xs text-slate-500 mt-2">Supports JPG, PNG, WEBP. Maximum file size: 8MB.</p>
                </div>
              ) : (
                <div className="relative rounded-xl overflow-hidden border border-slate-800 aspect-video max-w-md mx-auto bg-slate-950">
                  <img 
                    src={imagePreview} 
                    alt="Selected project preview" 
                    className="w-full h-full object-cover"
                  />
                  <button 
                    type="button"
                    onClick={clearImage}
                    className="absolute top-3 right-3 p-1.5 rounded-full bg-slate-950/80 hover:bg-slate-950 text-slate-400 hover:text-slate-100 border border-slate-800 transition-all shadow-md"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {statusMessage && (
              <div className="p-4 rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-400 text-sm">
                {statusMessage}
              </div>
            )}

            {errorMessage && (
              <div className="p-4 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm">
                {errorMessage}
              </div>
            )}

            <button 
              type="submit"
              disabled={submitting}
              className="w-full py-4 px-6 rounded-lg bg-sky-500 hover:bg-sky-400 disabled:bg-sky-800 text-slate-950 font-bold transition-all shadow-lg shadow-sky-500/10 flex items-center justify-center space-x-2"
            >
              {submitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  <span>Creating Portfolio Record...</span>
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5" />
                  <span>Deploy to Live Portfolio</span>
                </>
              )}
            </button>
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-8 text-center text-slate-500 text-xs">
        <a href="/admin/dashboard" className="hover:underline">Return to Console Home</a>
      </footer>
    </div>
  );
}
