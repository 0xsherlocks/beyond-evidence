"use client";

import { motion } from 'framer-motion';
import { Database, Plus, FileText, Settings, Users, LogOut } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/src/lib/utils';

export default function Studio() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Sidebar Nav */}
      <aside className="w-full md:w-64 bg-white border-r border-slate-200 p-6 flex flex-col pt-24 md:pt-6">
        <div className="mb-10 hidden md:flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white">
            <Database className="w-4 h-4" />
          </div>
          <span className="font-display font-bold">Studio.</span>
        </div>

        <nav className="flex-1 space-y-1">
          {[
            { name: 'Topics', icon: Database },
            { name: 'Articles', icon: FileText },
            { name: 'Researchers', icon: Users },
            { name: 'Settings', icon: Settings },
          ].map((item) => (
            <button key={item.name} className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-cta rounded-xl transition-all">
              <item.icon className="w-4 h-4" />
              {item.name}
            </button>
          ))}
        </nav>

        <div className="mt-auto pt-6 border-t border-slate-100">
           <Link href="/" className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-400 hover:text-red-500 transition-colors">
            <LogOut className="w-4 h-4" />
            Exit Studio
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-12 pt-12">
        <div className="max-w-5xl mx-auto">
          <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-12">
            <div>
              <h1 className="text-3xl font-display font-bold text-slate-900">Content Dashboard</h1>
              <p className="text-slate-500 text-sm mt-1">Manage the forensic knowledge base.</p>
            </div>
            <button className="pill-button bg-cta text-white hover:bg-blue-800 flex items-center justify-center gap-2">
              <Plus className="w-4 h-4" /> Create New
            </button>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
             <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <span className="eyebrow block mb-1">Total Topics</span>
                <div className="text-3xl font-display font-bold">14</div>
             </div>
             <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <span className="eyebrow block mb-1">Articles Published</span>
                <div className="text-3xl font-display font-bold">142</div>
             </div>
             <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <span className="eyebrow block mb-1">In Review</span>
                <div className="text-3xl font-display font-bold">8</div>
             </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <h2 className="font-display font-semibold text-slate-900">Recent Content</h2>
            </div>
            <div className="divide-y divide-slate-50">
              {[
                { title: "HPLC Data in Toxicology", category: "Toxicology", date: "2 hours ago", status: "Published" },
                { title: "Digital Artifacts in MacOS", category: "Digital Forensics", date: "5 hours ago", status: "Draft" },
                { title: "Point of Entry Analysis", category: "Crim-Investigation", date: "1 day ago", status: "Published" },
              ].map((article) => (
                <div key={article.title} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-slate-900">{article.title}</span>
                    <span className="text-xs text-slate-400">{article.category}</span>
                  </div>
                  <div className="flex items-center gap-6">
                    <span className="text-xs text-slate-400 hidden sm:block">{article.date}</span>
                    <span className={cn(
                      "text-[10px] uppercase tracking-tighter font-bold px-2 py-1 rounded-md",
                      article.status === 'Published' ? "bg-green-50 text-green-600" : "bg-orange-50 text-orange-600"
                    )}>
                      {article.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
