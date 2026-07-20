"use client";

import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { Mail, Phone, MapPin, Send, CheckCircle2, Shield } from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [status, setStatus] = useState("idle"); // idle, submitting, success, error
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setStatus("error");
      setErrorMessage("Please fill out all required fields.");
      return;
    }

    setStatus("submitting");

    // Simulate safe API form processing
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setStatus("success");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      setStatus("error");
      setErrorMessage("Failed to send message. Please try again later.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans flex flex-col justify-between selection:bg-sky-500 selection:text-white transition-all duration-300">
      <Navbar />

      {/* Main Form Area */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-12 py-12 flex-grow flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 w-full">
          {/* Information Column */}
          <div className="lg:col-span-5 flex flex-col justify-center space-y-8">
            <div>
              <span className="text-xs font-bold text-sky-600 dark:text-sky-400 uppercase tracking-widest block mb-2">Get In Touch</span>
              <h1 className="text-4xl font-black tracking-tight mb-6">
                Let's Discuss Your <br />
                Next IT <span className="text-sky-500 dark:text-sky-400">Venture</span>.
              </h1>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                Connect with David Chilengwa for cloud migration consultations, high-security infrastructure audits, custom systems automation pipelines, or dedicated IT operations management.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-sky-500 dark:text-sky-400 shrink-0 shadow-sm">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono block uppercase">Direct Phone</span>
                  <a href="tel:+260768409033" className="text-slate-800 dark:text-slate-200 font-bold hover:text-sky-500 dark:hover:text-sky-400 transition-colors text-base">
                    +260768409033
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-sky-500 dark:text-sky-400 shrink-0 shadow-sm">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono block uppercase">Primary Email</span>
                  <a href="mailto:deavchile@gmail.com" className="text-slate-800 dark:text-slate-200 font-bold hover:text-sky-500 dark:hover:text-sky-400 transition-colors text-base">
                    deavchile@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-sky-500 dark:text-sky-400 shrink-0 shadow-sm">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono block uppercase">Location Base</span>
                  <span className="text-slate-800 dark:text-slate-200 font-bold text-base">
                    Lusaka, Zambia (Southern Africa)
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Form Column */}
          <div className="lg:col-span-7">
            <div className="bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 shadow-sm dark:shadow-none relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-sky-500 to-indigo-500" />
              
              {status === "success" ? (
                <div className="py-12 text-center space-y-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold">Message Transmitted</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm max-w-md mx-auto leading-relaxed">
                      Thank you for contacting David Chilengwa. Your request was successfully processed and routed. We will get back to you shortly.
                    </p>
                  </div>
                  <button 
                    onClick={() => setStatus("idle")}
                    className="px-6 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-xs font-mono text-slate-400 dark:text-slate-500 uppercase">Your Name *</label>
                      <input 
                        type="text" 
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="David Chilengwa"
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-sky-500 text-slate-900 dark:text-slate-100 text-sm outline-none transition-all placeholder:text-slate-400"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-xs font-mono text-slate-400 dark:text-slate-500 uppercase">Email Address *</label>
                      <input 
                        type="email" 
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="deavchile@gmail.com"
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-sky-500 text-slate-900 dark:text-slate-100 text-sm outline-none transition-all placeholder:text-slate-400"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="subject" className="text-xs font-mono text-slate-400 dark:text-slate-500 uppercase">Subject / Engagement Area</label>
                    <input 
                      type="text" 
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="e.g. Infrastructure Modernization Consulting"
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-sky-500 text-slate-900 dark:text-slate-100 text-sm outline-none transition-all placeholder:text-slate-400"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="message" className="text-xs font-mono text-slate-400 dark:text-slate-500 uppercase">Message *</label>
                    <textarea 
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={5}
                      placeholder="Describe your IT architectural needs or contract scope details..."
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-sky-500 text-slate-900 dark:text-slate-100 text-sm outline-none transition-all placeholder:text-slate-400 resize-none"
                      required
                    />
                  </div>

                  {status === "error" && (
                    <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm">
                      {errorMessage}
                    </div>
                  )}

                  <button 
                    type="submit"
                    disabled={status === "submitting"}
                    className="w-full py-4 px-6 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold transition-all shadow-lg shadow-sky-500/10 flex items-center justify-center gap-2 active:scale-98 cursor-pointer disabled:opacity-50"
                  >
                    {status === "submitting" ? (
                      <>
                        <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                        <span>Transmitting Payload...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Transmit Message</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
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
