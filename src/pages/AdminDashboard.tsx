import React, { useState, useEffect } from "react";
import { ApiClient } from "../api";
import { Blog, Project, Contact, Newsletter } from "../types";
import { 
  KeyRound, ShieldAlert, Layout, BookOpen, Mail, Send, Clipboard, Check,
  Plus, Edit, Trash2, CheckCircle, Eye, Loader2, Sparkles, LogOut,
  Sliders, ArrowUpRight, Clock, ToggleLeft, ToggleRight
} from "lucide-react";

export const AdminDashboard: React.FC = () => {
  // Authentication status
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  // Active dashboard tab
  const [activeTab, setActiveTab] = useState<"blogs" | "projects" | "contacts" | "newsletters">("blogs");

  // Data States
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [newsletters, setNewsletters] = useState<Newsletter[]>([]);

  // Local loading states
  const [loadingBlogs, setLoadingBlogs] = useState(false);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [loadingContacts, setLoadingContacts] = useState(false);
  const [loadingNewsletters, setLoadingNewsletters] = useState(false);

  // Clipboard Copied notification state for sublist
  const [copiedSuccess, setCopiedSuccess] = useState(false);

  // Modal / Form States
  const [isBlogFormOpen, setIsBlogFormOpen] = useState(false);
  const [isProjectFormOpen, setIsProjectFormOpen] = useState(false);
  const [editingBlogId, setEditingBlogId] = useState<string | null>(null);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);

  // Blog Form Fields
  const [blogTitle, setBlogTitle] = useState("");
  const [blogExcerpt, setBlogExcerpt] = useState("");
  const [blogCategory, setBlogCategory] = useState("Web Development");
  const [blogTags, setBlogTags] = useState(""); // Comma separated
  const [blogContent, setBlogContent] = useState("");
  const [blogReadTime, setBlogReadTime] = useState("");
  const [blogFeatured, setBlogFeatured] = useState(false);

  // Project Form Fields
  const [projTitle, setProjTitle] = useState("");
  const [projDescription, setProjDescription] = useState("");
  const [projShortDesc, setProjShortDesc] = useState("");
  const [projImage, setProjImage] = useState("");
  const [projGithub, setProjGithub] = useState("");
  const [projLive, setProjLive] = useState("");
  const [projTechStack, setProjTechStack] = useState(""); // Comma separated
  const [projCategory, setProjCategory] = useState("MERN Stack");
  const [projFeatured, setProjFeatured] = useState(false);

  // Form error & loading helpers
  const [formLoading, setFormLoading] = useState(false);
  const [formErrorMsg, setFormErrorMsg] = useState("");

  // Check login on startup
  useEffect(() => {
    const doubleCheckAuth = async () => {
      const storedToken = localStorage.getItem("swaraj_admin_token");
      if (storedToken) {
        try {
          await ApiClient.getMe();
          setIsLoggedIn(true);
        } catch (err) {
          ApiClient.clearToken();
          setIsLoggedIn(false);
        }
      }
    };
    doubleCheckAuth();
  }, []);

  // Fetch data on active login
  useEffect(() => {
    if (isLoggedIn) {
      loadBlogs();
      loadProjects();
      loadContacts();
      loadNewsletters();
    }
  }, [isLoggedIn]);

  /* ==========================================================================
     API DATA LOADING METHODS
     ========================================================================== */

  const loadBlogs = async () => {
    setLoadingBlogs(true);
    try {
      const data = await ApiClient.getBlogs();
      setBlogs(data);
    } catch (err) {
      console.error("Failed to load admin blogs", err);
    } finally {
      setLoadingBlogs(false);
    }
  };

  const loadProjects = async () => {
    setLoadingProjects(true);
    try {
      const data = await ApiClient.getProjects();
      setProjects(data);
    } catch (err) {
      console.error("Failed to load admin projects", err);
    } finally {
      setLoadingProjects(false);
    }
  };

  const loadContacts = async () => {
    setLoadingContacts(true);
    try {
      const data = await ApiClient.getContacts();
      setContacts(data);
    } catch (err) {
      console.error("Failed to load admin contact messages", err);
    } finally {
      setLoadingContacts(false);
    }
  };

  const loadNewsletters = async () => {
    setLoadingNewsletters(true);
    try {
      const data = await ApiClient.getNewsletters();
      setNewsletters(data);
    } catch (err) {
      console.error("Failed to load admin newsletters", err);
    } finally {
      setLoadingNewsletters(false);
    }
  };

  /* ==========================================================================
     AUTH OPERATIONS
     ========================================================================== */

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput || !passwordInput) return;
    setLoginLoading(true);
    setLoginError("");

    try {
      const res = await ApiClient.login(emailInput, passwordInput);
      ApiClient.setToken(res.token);
      setIsLoggedIn(true);
      setEmailInput("");
      setPasswordInput("");
    } catch (err: any) {
      setLoginError(err.message || "Invalid login credentials. Did you seed initial DB?");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    ApiClient.clearToken();
    setIsLoggedIn(false);
  };

  /* ==========================================================================
     BLOG CRUD BACKEND DRIVER
     ========================================================================== */

  const openBlogCreateForm = () => {
    setEditingBlogId(null);
    setBlogTitle("");
    setBlogExcerpt("");
    setBlogCategory("Web Development");
    setBlogTags("");
    setBlogContent("");
    setBlogReadTime("8 min");
    setBlogFeatured(false);
    setFormErrorMsg("");
    setIsBlogFormOpen(true);
  };

  const openBlogEditForm = (blog: Blog) => {
    setEditingBlogId(blog.id);
    setBlogTitle(blog.title);
    setBlogExcerpt(blog.excerpt);
    setBlogCategory(blog.category);
    setBlogTags(blog.tags ? blog.tags.join(", ") : "");
    setBlogContent(blog.content);
    setBlogReadTime(blog.readTime || "5 min");
    setBlogFeatured(!!blog.featured);
    setFormErrorMsg("");
    setIsBlogFormOpen(true);
  };

  const handleBlogFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!blogTitle || !blogExcerpt || !blogContent) {
      setFormErrorMsg("Please enter Title, Excerpt, and Tutorial content.");
      return;
    }
    setFormLoading(true);
    setFormErrorMsg("");

    const payload = {
      title: blogTitle,
      excerpt: blogExcerpt,
      category: blogCategory,
      tags: blogTags ? blogTags.split(",").map((t) => t.trim()).filter(Boolean) : [],
      content: blogContent,
      readTime: blogReadTime || "8 min",
      featured: blogFeatured,
    };

    try {
      if (editingBlogId) {
        await ApiClient.updateBlog(editingBlogId, payload);
      } else {
        await ApiClient.createBlog(payload);
      }
      setIsBlogFormOpen(false);
      loadBlogs();
    } catch (err: any) {
      setFormErrorMsg(err.message || "Technical save crash.");
    } finally {
      setFormLoading(false);
    }
  };

  const handleBlogDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this blog article?")) return;
    try {
      await ApiClient.deleteBlog(id);
      loadBlogs();
    } catch (err: any) {
      alert(err.message || "Delete error");
    }
  };

  /* ==========================================================================
     PROJECT CRUD BACKEND DRIVER
     ========================================================================== */

  const openProjCreateForm = () => {
    setEditingProjectId(null);
    setProjTitle("");
    setProjDescription("");
    setProjShortDesc("");
    setProjImage("");
    setProjGithub("");
    setProjLive("");
    setProjTechStack("");
    setProjCategory("MERN Stack");
    setProjFeatured(false);
    setFormErrorMsg("");
    setIsProjectFormOpen(true);
  };

  const openProjEditForm = (proj: Project) => {
    setEditingProjectId(proj.id);
    setProjTitle(proj.title);
    setProjDescription(proj.description);
    setProjShortDesc(proj.shortDesc);
    setProjImage(proj.image);
    setProjGithub(proj.githubUrl);
    setProjLive(proj.liveUrl);
    setProjTechStack(proj.techStack ? proj.techStack.join(", ") : "");
    setProjCategory(proj.category);
    setProjFeatured(!!proj.featured);
    setFormErrorMsg("");
    setIsProjectFormOpen(true);
  };

  const handleProjFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projTitle || !projDescription || !projShortDesc) {
      setFormErrorMsg("Please input project Title, description, and short excerpt.");
      return;
    }
    setFormLoading(true);
    setFormErrorMsg("");

    const payload = {
      title: projTitle,
      description: projDescription,
      shortDesc: projShortDesc,
      image: projImage || "https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=600&auto=format&fit=crop",
      githubUrl: projGithub || "https://github.com/swarajpatil",
      liveUrl: projLive || "",
      techStack: projTechStack ? projTechStack.split(",").map((t) => t.trim()).filter(Boolean) : [],
      category: projCategory,
      featured: projFeatured,
    };

    try {
      if (editingProjectId) {
        await ApiClient.updateProject(editingProjectId, payload);
      } else {
        await ApiClient.createProject(payload);
      }
      setIsProjectFormOpen(false);
      loadProjects();
    } catch (err: any) {
      setFormErrorMsg(err.message || "Project save failed.");
    } finally {
      setFormLoading(false);
    }
  };

  const handleProjectDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;
    try {
      await ApiClient.deleteProject(id);
      loadProjects();
    } catch (err: any) {
      alert(err.message || "Delete error.");
    }
  };

  /* ==========================================================================
     CONTACT TOGGLE FLAGS OPERATIONS
     ========================================================================== */

  const handleToggleContactStatus = async (contact: Contact) => {
    const nextStatus = 
      contact.status === "unread" ? "read" : 
      contact.status === "read" ? "replied" : "unread";

    try {
      await ApiClient.updateContactStatus(contact.id, nextStatus);
      loadContacts();
    } catch (err: any) {
      alert("Failed to change contact message flags.");
    }
  };

  /* ==========================================================================
     NEWSLETTER CLIPBOARD COPY SHORTCUT
     ========================================================================== */

  const handleCopyAllNewsletters = () => {
    const list = newsletters.map((n) => n.email).join(", ");
    navigator.clipboard.writeText(list);
    setCopiedSuccess(true);
    setTimeout(() => {
      setCopiedSuccess(false);
    }, 2000);
  };

  /* ==========================================================================
     LOGIN OVERLAY INTERFACE
     ========================================================================== */

  if (!isLoggedIn) {
    return (
      <div className="max-w-md mx-auto py-16 px-4 animate-fade-in text-slate-800 dark:text-slate-105">
        <div className="bg-white dark:bg-slate-900 border border-slate-205/50 dark:border-slate-805/50 rounded-3xl p-8 shadow-2xl relative">
          
          <div className="text-center space-y-3 mb-8">
            <div className="inline-block bg-teal-500/10 p-3.5 rounded-2xl text-teal-600 dark:text-teal-400">
              <KeyRound className="h-6 w-6" />
            </div>
            <h1 className="text-2xl font-heading font-black text-slate-900 dark:text-white">
              Admin Entry Portal
            </h1>
            <p className="text-slate-400 dark:text-slate-400 text-xs">
              MERN Blog Site Authorizations for "Swaraj Patil"
            </p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                Email Address
              </label>
              <input
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="pilly2702@gmail.com"
                required
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 rounded-xl text-sm text-slate-800 dark:text-slate-100 outline-none focus:border-teal-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                Secret Access Password
              </label>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 rounded-xl text-sm text-slate-800 dark:text-slate-100 outline-none focus:border-teal-500"
              />
            </div>

            {loginError && (
              <div className="text-xs text-rose-500 font-semibold p-2.5 bg-rose-500/5 text-center border border-rose-500/10 rounded-xl animate-fade-in flex items-center justify-center gap-1.5">
                <ShieldAlert className="h-3.5 w-3.5" />
                <span>{loginError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full py-3 text-sm font-semibold tracking-tight text-white bg-gradient-to-r from-teal-500 to-sky-500 hover:from-teal-600 hover:to-sky-600 shadow-lg shadow-teal-500/10 hover:shadow-teal-500/25 active:scale-95 transition-all duration-200 flex items-center justify-center gap-1"
            >
              {loginLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <span>Authorize Login Session</span>
              )}
            </button>
          </form>

          {/* Quick helpful developer hints */}
          <div className="mt-8 pt-4 border-t border-slate-150/40 dark:border-slate-800 flex items-center justify-center gap-1 text-[10px] text-slate-400 font-mono">
            <span>Seeded Login Email:</span>
            <strong className="text-slate-650 dark:text-slate-300">pilly2702@gmail.com</strong>
            <span>/ Password:</span>
            <strong className="text-slate-650 dark:text-slate-300">admin123</strong>
          </div>

        </div>
      </div>
    );
  }

  /* ==========================================================================
     CORE AUTHENTICATED PANEL LAYOUT
     ========================================================================= */

  return (
    <div className="space-y-8 pb-16 animate-fade-in text-slate-800 dark:text-slate-100 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Dynamic Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 dark:border-slate-900 pb-4 gap-4">
        <div>
          <h1 className="text-2xl font-heading font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Sliders className="h-6 w-6 text-teal-500 shadow-sm" />
            <span>Developer Blog Administrator Control Center</span>
          </h1>
          <p className="text-xs text-slate-400 tracking-wide">
            Add or edit projects catalogs, write technical publications, read messages, copy newsletters emails
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="px-3.5 py-1.5 shrink-0 rounded-xl text-xs font-semibold bg-rose-50 dark:bg-rose-950/20 text-rose-500 hover:text-rose-600 hover:bg-rose-100 border border-rose-500/10 flex items-center gap-1.5 transition"
        >
          <LogOut className="h-3.5 w-3.5" />
          <span>Exit Session</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        
        {/* Sidebar Dashboard select navigation */}
        <div className="col-span-1 md:col-span-3 space-y-3 bg-slate-50 dark:bg-slate-950 p-4 rounded-3xl border border-slate-200/50 dark:border-slate-800/60">
          <h4 className="text-[10px] font-mono tracking-widest font-bold text-slate-400 dark:text-slate-550 uppercase">
            Admin Options
          </h4>

          <div className="flex flex-col gap-1 sm:gap-1.5">
            {[
              { id: "blogs", name: "Manage Blogs", icon: BookOpen, count: blogs.length },
              { id: "projects", name: "Manage Projects", icon: Layout, count: projects.length },
              { id: "contacts", name: "Client Messages", icon: Mail, count: contacts.filter((c) => c.status === "unread").length },
              { id: "newsletters", name: "Newsletter subs", icon: Send, count: newsletters.length },
            ].map((tab) => {
              const TabIcon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl font-semibold text-xs tracking-tight transition ${
                    isActive
                      ? "bg-teal-500 text-white shadow"
                      : "text-slate-600 dark:text-slate-350 hover:bg-slate-100 dark:hover:bg-slate-900/60 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <TabIcon className="h-4 w-4" />
                    <span>{tab.name}</span>
                  </div>
                  {tab.id === "contacts" && tab.count > 0 ? (
                    <span className="px-1.5 py-0.5 rounded text-[8px] leading-none font-extrabold tracking-wider bg-rose-500 text-white animate-pulse">
                      {tab.count} New
                    </span>
                  ) : (
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-mono ${isActive ? "bg-white/20 text-white" : "bg-slate-200 dark:bg-slate-800 text-slate-500"}`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic Display panel */}
        <div className="col-span-1 md:col-span-9 bg-white dark:bg-slate-900/10 p-6 md:p-8 rounded-3xl border border-slate-205/60 dark:border-slate-800/80">
          
          {/* 1. MANAGE BLOG PANEL */}
          {activeTab === "blogs" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b pb-4 border-slate-100 dark:border-slate-900">
                <div className="space-y-1">
                  <h3 className="font-heading font-extrabold text-base tracking-tight">Technical Publications Feed</h3>
                  <p className="text-xs text-slate-400">Total of {blogs.length} technical blog posts registered in local catalogs.</p>
                </div>
                <button
                  onClick={openBlogCreateForm}
                  className="px-3.5 py-2 hover:bg-teal-600 rounded-xl text-xs font-bold text-white bg-teal-500 flex items-center gap-1 text shadow transition"
                >
                  <Plus className="h-4 w-4" />
                  <span>Create Blog</span>
                </button>
              </div>

              {loadingBlogs ? (
                <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-teal-500" /></div>
              ) : blogs.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-medium text-slate-600 dark:text-slate-300">
                    <thead className="text-[10px] font-mono tracking-widest font-extrabold uppercase border-b border-slate-100 dark:border-slate-800 text-slate-400">
                      <tr>
                        <th className="pb-3 select-none">Title</th>
                        <th className="pb-3 select-none">Category</th>
                        <th className="pb-3 select-none">Date</th>
                        <th className="pb-3 select-none text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {blogs.map((b) => (
                        <tr key={b.id} className="hover:bg-slate-50/20 dark:hover:bg-slate-900/10 font-bold transition">
                          <td className="py-2.5 max-w-[280px] truncate pr-4 text-slate-850 dark:text-slate-200">
                            {b.title}
                            {b.featured && (
                              <span className="text-[8px] font-extrabold tracking-widest px-1 py-0.5 rounded bg-amber-500/10 border border-amber-500/10 text-amber-500 ml-1.5 uppercase font-mono">
                               Featured
                              </span>
                            )}
                          </td>
                          <td className="py-2.5 font-sans font-medium text-slate-400">{b.category}</td>
                          <td className="py-2.5 font-mono text-slate-400 text-[11px]">{new Date(b.createdAt).toLocaleDateString()}</td>
                          <td className="py-2.5 text-right space-x-1 whitespace-nowrap">
                            <button
                              onClick={() => openBlogEditForm(b)}
                              className="p-1 px-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded bg-slate-50 dark:bg-slate-900/60 text-slate-400 hover:text-teal-500 font-mono text-[10px]"
                              title="Edit Article"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleBlogDelete(b.id)}
                              className="p-1 px-2 hover:bg-rose-500/10 rounded bg-slate-50 dark:bg-slate-905 text-slate-400 hover:text-rose-500 font-mono text-[10px]"
                              title="Delete Article"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-10 text-slate-400 border border-dashed rounded-3xl">No articles cataloged.</div>
              )}
            </div>
          )}

          {/* 2. MANAGE PROJECT PANEL */}
          {activeTab === "projects" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b pb-4 border-slate-100 dark:border-slate-900">
                <div className="space-y-1">
                  <h3 className="font-heading font-extrabold text-base tracking-tight">Portfolio Project Catalogs</h3>
                  <p className="text-xs text-slate-400">Total of {projects.length} project items cataloged.</p>
                </div>
                <button
                  onClick={openProjCreateForm}
                  className="px-3.5 py-2 hover:bg-teal-600 rounded-xl text-xs font-bold text-white bg-teal-500 flex items-center gap-1 text shadow transition"
                >
                  <Plus className="h-4 w-4" />
                  <span>Create Project</span>
                </button>
              </div>

              {loadingProjects ? (
                <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-teal-500" /></div>
              ) : projects.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-medium text-slate-600 dark:text-slate-300">
                    <thead className="text-[10px] font-mono tracking-widest font-extrabold uppercase border-b border-slate-100 dark:border-slate-800 text-slate-400">
                      <tr>
                        <th className="pb-3">Title</th>
                        <th className="pb-3">Category</th>
                        <th className="pb-3">Demo URL</th>
                        <th className="pb-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {projects.map((proj) => (
                        <tr key={proj.id} className="hover:bg-slate-50/20 dark:hover:bg-slate-900/10 font-bold transition">
                          <td className="py-2.5 max-w-[280px] truncate pr-4 text-slate-850 dark:text-slate-200">
                            {proj.title}
                            {proj.featured && (
                              <span className="text-[8px] font-extrabold tracking-widest px-1 py-0.5 rounded bg-amber-500/10 border border-amber-500/10 text-amber-500 ml-1.5 uppercase font-mono">
                               Featured
                              </span>
                            )}
                          </td>
                          <td className="py-2.5 font-sans font-medium text-slate-400">{proj.category}</td>
                          <td className="py-2.5 font-mono text-slate-500 text-[11px]">
                            {proj.liveUrl ? (
                              <a href={proj.liveUrl} target="_blank" rel="noreferrer" className="text-teal-500 hover:underline">
                                Demo link &raquo;
                              </a>
                            ) : (
                              <span className="text-slate-400">Local IoT</span>
                            )}
                          </td>
                          <td className="py-2.5 text-right space-x-1 whitespace-nowrap">
                            <button
                              onClick={() => openProjEditForm(proj)}
                              className="p-1 px-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded bg-slate-50 dark:bg-slate-900/60 text-slate-400 hover:text-teal-500 font-mono text-[10px]"
                              title="Edit Project"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleProjectDelete(proj.id)}
                              className="p-1 px-2 hover:bg-rose-500/10 rounded bg-slate-50 dark:bg-slate-905 text-slate-400 hover:text-rose-500 font-mono text-[10px]"
                              title="Delete Project"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-10 text-slate-400 border border-dashed rounded-3xl">No projects in catalogs yet.</div>
              )}
            </div>
          )}

          {/* 3. CONTACT MESSAGES VIEW */}
          {activeTab === "contacts" && (
            <div className="space-y-6">
              <div className="border-b pb-4 border-slate-100 dark:border-slate-900">
                <h3 className="font-heading font-extrabold text-base tracking-tight animate-pulse">
                  Submitted Client Inquiries
                </h3>
                <p className="text-xs text-slate-400">Total of {contacts.length} incoming contact inquiries.</p>
              </div>

              {loadingContacts ? (
                <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-teal-500" /></div>
              ) : contacts.length > 0 ? (
                <div className="space-y-4">
                  {contacts.map((contact) => (
                    <div 
                      key={contact.id}
                      className="p-5 bg-slate-50 dark:bg-slate-950 border border-slate-200/50 dark:border-slate-800/80 rounded-2xl space-y-3 shadow-xs font-medium"
                    >
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                        <div>
                          <h4 className="font-bold text-slate-800 dark:text-slate-150 text-sm">
                            {contact.name}
                          </h4>
                          <span className="text-xs text-slate-450 font-mono select-all">
                            {contact.email}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleToggleContactStatus(contact)}
                            className={`px-2.5 py-1 text-[10px] font-mono tracking-widest font-extrabold border rounded-lg uppercase transition ${
                              contact.status === "unread" ? "bg-red-500/10 border-red-500/10 text-red-500" :
                              contact.status === "read" ? "bg-amber-500/10 border-amber-500/10 text-amber-500" :
                              "bg-emerald-500/10 border-emerald-500/10 text-emerald-500"
                            }`}
                          >
                            <span>Mark: {contact.status}</span>
                          </button>
                        </div>
                      </div>

                      <p className="text-xs md:text-sm text-slate-600 dark:text-slate-350 bg-white dark:bg-slate-900/60 p-3 rounded-xl border border-slate-100 dark:border-slate-800 leading-relaxed">
                        {contact.message}
                      </p>

                      <div className="text-[10px] font-mono text-slate-400 text-right">
                        Submitted: {new Date(contact.createdAt).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 text-slate-400 border border-dashed rounded-3xl">No client messages available.</div>
              )}
            </div>
          )}

          {/* 4. NEWSLETTER PANEL */}
          {activeTab === "newsletters" && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center justify-between border-b pb-4 border-slate-100 dark:border-slate-900">
                <div className="space-y-1">
                  <h3 className="font-heading font-extrabold text-base tracking-tight">Subscribed Email Alerts list</h3>
                  <p className="text-xs text-slate-400">Total of {newsletters.length} mailing addresses.</p>
                </div>
                {newsletters.length > 0 && (
                  <button
                    onClick={handleCopyAllNewsletters}
                    className="px-3 py-1.5 hover:bg-teal-600 font-bold border border-teal-500/10 text-white bg-teal-500 rounded-xl text-xs flex items-center gap-1.5 shadow transition active:scale-95"
                  >
                    {copiedSuccess ? <Check className="h-4 w-4 text-white" /> : <Clipboard className="h-4 w-4" />}
                    <span>{copiedSuccess ? "Copied Addresses!" : "Copy All Copy list"}</span>
                  </button>
                )}
              </div>

              {loadingNewsletters ? (
                <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-teal-500" /></div>
              ) : newsletters.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-semibold text-slate-600 dark:text-slate-350">
                    <thead className="text-[10px] font-mono tracking-widest font-extrabold uppercase border-b border-slate-150 text-slate-400">
                      <tr>
                        <th className="pb-3 select-none">Subscriber Email Address</th>
                        <th className="pb-3 text-right">Subscribing Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {newsletters.map((n) => (
                        <tr key={n.id} className="hover:bg-slate-50/20 dark:hover:bg-slate-90/10 font-bold">
                          <td className="py-2.5 select-all text-slate-800 dark:text-slate-250 font-mono">{n.email}</td>
                          <td className="py-2.5 text-right font-mono text-[11px] text-slate-400">{new Date(n.createdAt).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-10 text-slate-400 border border-dashed rounded-3xl">No newsletter subscribers in catalogs.</div>
              )}
            </div>
          )}

        </div>

      </div>

      {/* ==========================================================================
         BLOG FORM MODAL OVERLAY
         ========================================================================== */}
      {isBlogFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-xs max-h-screen overflow-y-auto">
          <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-6 md:p-8 border border-slate-200 dark:border-slate-800">
            
            <h3 className="font-heading font-extrabold text-lg text-slate-900 dark:text-white mb-6 border-b pb-3 border-slate-100 dark:border-slate-800 pb-2">
              {editingBlogId ? "Modify Blog Article" : "Compose New Technical Post"}
            </h3>

            <form onSubmit={handleBlogFormSubmit} className="space-y-5">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold uppercase tracking-wide text-slate-400">Article Title</label>
                  <input
                    type="text"
                    value={blogTitle}
                    onChange={(e) => setBlogTitle(e.target.value)}
                    placeholder="e.g., JWT Authentication in React"
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-205 dark:border-slate-800/80 rounded-xl text-xs sm:text-sm text-slate-800 dark:text-slate-100 outline-none focus:border-teal-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold uppercase tracking-wide text-slate-400">Category Selection</label>
                  <select
                    value={blogCategory}
                    onChange={(e) => setBlogCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-205 dark:border-slate-800/80 rounded-xl text-xs sm:text-sm text-slate-800 dark:text-slate-100 outline-none focus:border-teal-500"
                  >
                    <option value="Web Development">Web Development</option>
                    <option value="Project Walkthroughs">Project Walkthroughs</option>
                    <option value="React Tips">React Tips</option>
                    <option value="Interview Prep">Interview Prep</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold uppercase tracking-wide text-slate-400">Tags (comma-separated)</label>
                  <input
                    type="text"
                    value={blogTags}
                    onChange={(e) => setBlogTags(e.target.value)}
                    placeholder="e.g., JWT, React, Security"
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-205 dark:border-slate-800/80 rounded-xl text-xs sm:text-sm text-slate-800 dark:text-slate-100 outline-none focus:border-teal-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold uppercase tracking-wide text-slate-400">Reading Duration (minutes)</label>
                  <input
                    type="text"
                    value={blogReadTime}
                    onChange={(e) => setBlogReadTime(e.target.value)}
                    placeholder="e.g., 10 min"
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-205 dark:border-slate-800/80 rounded-xl text-xs sm:text-sm text-slate-800 dark:text-slate-100 outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono font-bold uppercase tracking-wide text-slate-400">Short Excerpt (Summary)</label>
                <input
                  type="text"
                  value={blogExcerpt}
                  onChange={(e) => setBlogExcerpt(e.target.value)}
                  placeholder="Enter a 2-sentence summary of the article..."
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-205 dark:border-slate-800/80 rounded-xl text-xs sm:text-sm text-slate-800 dark:text-slate-100 outline-none focus:border-teal-500"
                />
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[10px] font-mono font-bold uppercase tracking-wide text-slate-400">Tutorial Content (Markdown is supported)</label>
                  <span className="text-[9px] text-slate-400 font-mono">Use ### Headers and \`\`\`code blocks</span>
                </div>
                <textarea
                  value={blogContent}
                  onChange={(e) => setBlogContent(e.target.value)}
                  placeholder="Paste your markdown or standard text publication details here..."
                  required
                  rows={8}
                  className="w-full p-4 bg-slate-50 dark:bg-slate-950 border border-slate-205 dark:border-slate-800/80 rounded-2xl text-xs sm:text-sm text-slate-800 dark:text-slate-100 outline-none focus:border-teal-500 font-mono resize-y"
                />
              </div>

              {/* Featured toggle */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="blog-featured"
                  checked={blogFeatured}
                  onChange={(e) => setBlogFeatured(e.target.checked)}
                  className="h-4.5 w-4.5 text-teal-500 focus:ring-teal-500 border-slate-200 dark:border-slate-800 rounded bg-transparent"
                />
                <label htmlFor="blog-featured" className="text-xs font-semibold text-slate-650 dark:text-slate-300">
                  Feature this article prominently on the homepage
                </label>
              </div>

              {formErrorMsg && (
                <div className="p-3 text-rose-500 text-xs font-bold text-center bg-rose-500/5 border border-rose-500/10 rounded-xl">
                  {formErrorMsg}
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-850">
                <button
                  type="button"
                  onClick={() => setIsBlogFormOpen(false)}
                  className="px-4 py-2 border rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-50 dark:border-slate-800 hover:text-slate-700 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="px-5 py-2 hover:bg-teal-650 rounded-xl text-xs font-extrabold text-white bg-teal-500 shadow flex items-center gap-1 transition"
                >
                  {formLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                  <span>Save Profile</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* ==========================================================================
         PROJECT FORM MODAL OVERLAY
         ========================================================================== */}
      {isProjectFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 processed-layer overflow-y-auto">
          <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-6 md:p-8 border border-slate-205 dark:border-slate-800">
            
            <h3 className="font-heading font-extrabold text-lg text-slate-900 dark:text-white mb-6 border-b pb-3 border-slate-100 dark:border-slate-800">
              {editingProjectId ? "Modify Portfolio Catalog Item" : "Create New Portfolio Project Entry"}
            </h3>

            <form onSubmit={handleProjFormSubmit} className="space-y-4">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold uppercase tracking-wide text-slate-400">Project Title</label>
                  <input
                    type="text"
                    value={projTitle}
                    onChange={(e) => setProjTitle(e.target.value)}
                    placeholder="e.g., ATS Resume Checker"
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-205 dark:border-slate-800/80 rounded-xl text-xs sm:text-sm text-slate-800 dark:text-slate-100 outline-none focus:border-teal-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold uppercase tracking-wide text-slate-400">Category Tags</label>
                  <select
                    value={projCategory}
                    onChange={(e) => setProjCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-205 dark:border-slate-800/80 rounded-xl text-xs sm:text-sm text-slate-800 dark:text-slate-100 outline-none focus:border-teal-500"
                  >
                    <option value="MERN Stack">MERN Stack</option>
                    <option value="AI Integration">AI Integration</option>
                    <option value="Real-Time Apps">Real-Time Apps</option>
                    <option value="IoT">IoT</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold uppercase tracking-wide text-slate-400">GitHub Code URL</label>
                  <input
                    type="url"
                    value={projGithub}
                    onChange={(e) => setProjGithub(e.target.value)}
                    placeholder="e.g., https://github.com/swarajpatil/ats-resume-checker"
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-205 dark:border-slate-800/80 rounded-xl text-xs sm:text-sm text-slate-800 dark:text-slate-100 outline-none focus:border-teal-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold uppercase tracking-wide text-slate-400">Live Application URL (Optional)</label>
                  <input
                    type="url"
                    value={projLive}
                    onChange={(e) => setProjLive(e.target.value)}
                    placeholder="e.g., https://ats-resume-checker-swaraj.vercel.app"
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-205 dark:border-slate-800/80 rounded-xl text-xs sm:text-sm text-slate-800 dark:text-slate-100 outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold uppercase tracking-wide text-slate-400">Teck Stack Baden (comma-separated)</label>
                  <input
                    type="text"
                    value={projTechStack}
                    onChange={(e) => setProjTechStack(e.target.value)}
                    placeholder="e.g., React, Node.js, Express, MongoDB"
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-205 dark:border-slate-800/80 rounded-xl text-xs sm:text-sm text-slate-800 dark:text-slate-100 outline-none focus:border-teal-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold uppercase tracking-wide text-slate-400">Portfolio Image URL</label>
                  <input
                    type="text"
                    value={projImage}
                    onChange={(e) => setProjImage(e.target.value)}
                    placeholder="e.g. Unsplash URL image links..."
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-205 dark:border-slate-800/80 rounded-xl text-xs sm:text-sm text-slate-800 dark:text-slate-100 outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono font-bold uppercase tracking-wide text-slate-400">Short Summary Card Excerpt</label>
                <input
                  type="text"
                  value={projShortDesc}
                  onChange={(e) => setProjShortDesc(e.target.value)}
                  placeholder="Enter a 1-sentence synopsis for list feeds..."
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-205 dark:border-slate-800/80 rounded-xl text-xs sm:text-sm text-slate-800 dark:text-slate-100 outline-none focus:border-teal-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono font-bold uppercase tracking-wide text-slate-400">Comprehensive Project Analysis description</label>
                <textarea
                  value={projDescription}
                  onChange={(e) => setProjDescription(e.target.value)}
                  placeholder="Draft full paragraphs detailing systems mechanics, layout challenges solved, or databases query integrations..."
                  required
                  rows={4}
                  className="w-full p-4 bg-slate-50 dark:bg-slate-950 border border-slate-205 dark:border-slate-800/80 rounded-2xl text-xs sm:text-sm text-slate-800 dark:text-slate-100 outline-none focus:border-teal-500 resize-none"
                />
              </div>

              {/* Featured toggle */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="proj-featured"
                  checked={projFeatured}
                  onChange={(e) => setProjFeatured(e.target.checked)}
                  className="h-4.5 w-4.5 text-teal-500 focus:ring-teal-500 border-slate-200 dark:border-slate-800 rounded bg-transparent"
                />
                <label htmlFor="proj-featured" className="text-xs font-semibold text-slate-650 dark:text-slate-300">
                  Feature this card prominently on the main homepage
                </label>
              </div>

              {formErrorMsg && (
                <div className="p-3 text-rose-500 text-xs font-bold text-center bg-rose-500/5 border border-rose-550/15 rounded-xl">
                  {formErrorMsg}
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-850">
                <button
                  type="button"
                  onClick={() => setIsProjectFormOpen(false)}
                  className="px-4 py-2 border rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-50 dark:border-slate-800 hover:text-slate-700 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="px-5 py-2 hover:bg-teal-650 rounded-xl text-xs font-extrabold text-white bg-teal-500 shadow flex items-center gap-1 transition"
                >
                  {formLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                  <span>Save Project</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
