import React, { useState, useEffect } from "react";
import { Link } from "../components/RouterContext";
import { ProjectCard } from "../components/ProjectCard";
import { BlogCard } from "../components/BlogCard";
import { ApiClient } from "../api";
import { Project, Blog } from "../types";
import { 
  ArrowRight, FileText, Code2, Server, Globe2, Wrench, 
  Send, Sparkles, Mail, User, MessageSquare, Loader2 
} from "lucide-react";

interface HomeProps {
  onViewProject: (project: Project) => void;
}

export const Home: React.FC<HomeProps> = ({ onViewProject }) => {
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>([]);
  const [latestBlogs, setLatestBlogs] = useState<Blog[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [loadingBlogs, setLoadingBlogs] = useState(true);

  // Contact form state
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [contactSending, setContactSending] = useState(false);
  const [contactSuccessMsg, setContactSuccessMsg] = useState("");
  const [contactErrorMsg, setContactErrorMsg] = useState("");

  useEffect(() => {
    // Load projects and blogs from proxy backend APIs
    const loadData = async () => {
      try {
        const projs = await ApiClient.getProjects();
        // filter featured, limit 3
        setFeaturedProjects(projs.filter((p) => p.featured).slice(0, 3));
      } catch (err) {
        console.error("Failed to load projects for homepage", err);
      } finally {
        setLoadingProjects(false);
      }

      try {
        const articles = await ApiClient.getBlogs();
        // limit latest 3
        setLatestBlogs(articles.slice(0, 3));
      } catch (err) {
        console.error("Failed to load blogs for homepage", err);
      } finally {
        setLoadingBlogs(false);
      }
    };

    loadData();
  }, []);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactEmail || !contactMessage) return;
    setContactSending(true);
    setContactSuccessMsg("");
    setContactErrorMsg("");

    try {
      const res = await ApiClient.submitContact(contactName, contactEmail, contactMessage);
      setContactSuccessMsg(res.message || "Thank you! Your message was delivered successfully.");
      setContactName("");
      setContactEmail("");
      setContactMessage("");
    } catch (err: any) {
      setContactErrorMsg(err.message || "Failed to deliver contact message.");
    } finally {
      setContactSending(false);
    }
  };

  const skillGroups = [
    {
      name: "Frontend Libraries",
      icon: Code2,
      color: "from-cyan-400 to-teal-500",
      skills: ["React.js", "TypeScript", "Redux Toolkit", "Context API", "Tailwind CSS", "Framer Motion", "HTML5 & CSS3"],
    },
    {
      name: "Backend & DBs",
      icon: Server,
      color: "from-teal-500 to-sky-500",
      skills: ["Node.js", "Express.js", "MongoDB", "RESTful APIs", "JWT Auth", "WebRTC", "Socket.io"],
    },
    {
      name: "Core Languages",
      icon: Globe2,
      color: "from-sky-500 to-blue-600",
      skills: ["JavaScript (ES6)", "TypeScript", "C++ (DSA)", "Python (AI)", "SQL", "Java (OOPs)"],
    },
    {
      name: "Dev Tools & Services",
      icon: Wrench,
      color: "from-blue-600 to-indigo-500",
      skills: ["Git & GitHub", "Vercel & Railway", "Postman APIs", "MongoDB Atlas", "VS Code", "CLI Terminal"],
    },
  ];

  return (
    <div className="space-y-24 pb-16 animate-fade-in text-slate-800 dark:text-slate-100">
      
      {/* 1. DYNAMIC HERO SECTION */}
      <section className="relative overflow-hidden py-20 sm:py-24 border-b border-gray-200 dark:border-slate-800/60 leading-normal">
        <div className="absolute inset-0 -z-10 bg-grid-slate-150 dark:bg-grid-slate-900/10 [mask-image:radial-gradient(ellipse_at_center,white,transparent)]" />
        <div className="absolute top-20 right-10 w-72 h-72 rounded-full bg-[#1e3a8a]/5 dark:bg-[#1e3a8a]/3 blur-3xl -z-10" />
        <div className="absolute bottom-10 left-10 w-96 h-96 rounded-full bg-[#7c3aed]/5 dark:bg-[#7c3aed]/3 blur-3xl -z-10" />

        <div className="text-center space-y-6 max-w-4xl mx-auto px-4">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 text-xs font-semibold tracking-wide rounded-full bg-blue-50 dark:bg-[#1e3a8a]/20 text-[#1e3a8a] dark:text-[#a78bfa] border border-blue-100 dark:border-[#7c3aed]/20 uppercase">
            <Sparkles className="h-3.5 w-3.5 antialiased text-amber-500 animate-spin-slow" />
            Seeking 6-Month / Summer Internships
          </span>

          <h2 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight text-slate-900 dark:text-white leading-[1.05] max-w-3xl mx-auto">
            Hi, I'm{" "}
            <span className="bg-gradient-to-r from-[#1e3a8a] to-[#7c3aed] bg-clip-text text-transparent">
              Swaraj Patil
            </span>
          </h2>

          <p className="text-base sm:text-lg text-gray-500 dark:text-slate-400 max-w-2xl mx-auto">
            Student developer at <span className="text-[#1e3a8a] dark:text-[#a78bfa] font-bold">SSGMCE, Maharashtra</span>. 
            Crafting highly responsive, scalable full-stack web architectures integrated with helpful AI capabilities.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to="/projects"
              className="w-full sm:w-auto px-6 py-3 font-semibold rounded-full text-xs text-white bg-[#1e3a8a] hover:bg-[#1e40af] dark:bg-[#7c3aed] dark:hover:bg-[#6d28d9] shadow-md shadow-blue-900/10 hover:shadow-blue-900/20 active:scale-95 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <span>Explore My Work</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            
            <Link
              to="/resume"
              className="w-full sm:w-auto px-6 py-3 font-semibold rounded-full text-xs bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800/80 text-slate-700 dark:text-slate-200 border border-gray-200 dark:border-slate-850 flex items-center justify-center gap-2 hover:border-[#1e3a8a] dark:hover:border-[#7c3aed] active:scale-95 transition-all duration-200"
            >
              <FileText className="h-3.5 w-3.5 text-slate-400" />
              <span>Interactive CV / Resume</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. INTERACTIVE SKILLS MATRIX */}
      <section className="space-y-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-sans font-bold tracking-tight text-slate-900 dark:text-white flex items-center justify-center gap-2">
            <span className="w-1.5 h-6 bg-[#1e3a8a] dark:bg-[#7c3aed] rounded-full"></span>
            Technical Expertise
          </h2>
          <p className="text-gray-500 dark:text-slate-400 text-xs max-w-md mx-auto">
            Disciplined skill sets and tools honed through robust project development and course specialization.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {skillGroups.map((group) => {
            const Icon = group.icon;
            // Map skill color classes to theme palette
            let iconBgColor = "bg-blue-50 text-[#1e3a8a]";
            if (group.name.includes("Backend")) iconBgColor = "bg-purple-50 text-[#7c3aed]";
            if (group.name.includes("Core")) iconBgColor = "bg-green-50 text-green-700";
            if (group.name.includes("Tools")) iconBgColor = "bg-orange-50 text-orange-700";

            return (
              <div
                key={group.name}
                className="p-6 bg-white dark:bg-slate-900/60 rounded-2xl border border-gray-200 dark:border-slate-800/80 hover:shadow-md hover:border-[#7c3aed] dark:hover:border-[#7c3aed] transition duration-300 group"
              >
                <div className="flex items-center gap-3.5 mb-5">
                  <div className={`p-2.5 rounded-xl ${iconBgColor} shadow-inner group-hover:scale-105 transition duration-300`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-sans font-bold text-[#1e3a8a] dark:text-white text-sm tracking-tight">
                    {group.name}
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {group.skills.map((skill) => (
                    <span
                      key={skill}
                      className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-gray-50 dark:bg-slate-800/80 hover:bg-purple-100/50 dark:hover:bg-[#7c3aed]/20 text-gray-600 dark:text-slate-300 transition duration-200 border border-gray-100 dark:border-slate-800/50"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. FEATURED PROJECTS SHOWCASE */}
      <section className="space-y-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-1.5 h-6 bg-[#1e3a8a] rounded-full"></span>
              Featured Projects
            </h2>
            <p className="text-gray-500 dark:text-slate-400 text-xs">
              Handcrafted open-source web solutions integrated with backend APIs and production features.
            </p>
          </div>
          <Link
            to="/projects"
            className="group flex items-center gap-1.5 text-xs font-bold text-[#7c3aed] dark:text-[#a78bfa] hover:underline"
          >
            <span>View All Projects →</span>
          </Link>
        </div>

        {loadingProjects ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-80 bg-slate-100 dark:bg-slate-850 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : featuredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onViewDetails={onViewProject}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-10 border border-dashed rounded-2xl text-slate-400">
            No projects available yet. Initialize seed data on the dashboard or login as Admin!
          </div>
        )}
      </section>

      {/* 4. LATEST BLOG POSTS FEED */}
      <section className="space-y-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-1.5 h-6 bg-[#7c3aed] rounded-full"></span>
              Recent Blog Posts
            </h2>
            <p className="text-gray-500 dark:text-slate-400 text-xs">
              Articles and coding guidelines covering full-stack strategies and core engineering.
            </p>
          </div>
          <Link
            to="/blog"
            className="group flex items-center gap-1.5 text-xs font-bold text-[#7c3aed] dark:text-[#a78bfa] hover:underline"
          >
            <span>Explore Blog →</span>
          </Link>
        </div>

        {loadingBlogs ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-64 bg-slate-100 dark:bg-slate-850 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : latestBlogs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {latestBlogs.map((blog) => (
              <BlogCard key={blog.id} blog={blog} />
            ))}
          </div>
        ) : (
          <div className="text-center py-10 border border-dashed rounded-2xl text-slate-400">
            No articles posted yet. Sign in as admin to author custom technical articles.
          </div>
        )}
      </section>

      {/* 5. CALL TO ACTION (CONTACT ME) */}
      <section id="contact-panel" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800/80 rounded-2xl p-8 md:p-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-center shadow-sm">
          
          <div className="col-span-1 md:col-span-5 space-y-4">
            <span className="p-2.5 inline-block bg-blue-50 dark:bg-[#1e3a8a]/20 text-[#1e3a8a] dark:text-[#a78bfa] rounded-2xl">
              <Mail className="h-6 w-6" />
            </span>
            <h2 className="text-2xl md:text-3xl font-sans font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
              Get In Touch!
            </h2>
            <p className="text-xs text-gray-500 dark:text-slate-400 leading-relaxed">
              Have an internship opening, software project query, or a collaboration proposal? Reach out directly! I respond quickly to Pune-based and remote work inquiries.
            </p>
          </div>

          <form onSubmit={handleContactSubmit} className="col-span-1 md:col-span-7 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Name */}
              <div className="relative flex items-center bg-gray-50 dark:bg-slate-800/50 rounded-xl border border-gray-200 dark:border-slate-850 px-3.5 focus-within:border-[#7c3aed] transition-colors">
                <User className="h-4 w-4 text-slate-400 mr-2" />
                <input
                  type="text"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="Your Name"
                  required
                  className="w-full py-3 bg-transparent text-sm border-none outline-none text-slate-800 dark:text-slate-100"
                />
              </div>

              {/* Email */}
              <div className="relative flex items-center bg-gray-50 dark:bg-slate-800/50 rounded-xl border border-gray-200 dark:border-slate-850 px-3.5 focus-within:border-[#7c3aed] transition-colors">
                <Mail className="h-4 w-4 text-slate-400 mr-2" />
                <input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="Your Email"
                  required
                  className="w-full py-3 bg-transparent text-sm border-none outline-none text-slate-800 dark:text-slate-100"
                />
              </div>
            </div>

            {/* Message */}
            <div className="relative flex items-start bg-gray-50 dark:bg-slate-800/50 rounded-xl border border-gray-200 dark:border-slate-850 px-3.5 py-2.5 focus-within:border-[#7c3aed] transition-colors">
              <MessageSquare className="h-4 w-4 text-slate-400 mr-2 mt-1.5" />
              <textarea
                value={contactMessage}
                onChange={(e) => setContactMessage(e.target.value)}
                placeholder="How can I help you build or automate your next idea?"
                required
                rows={4}
                className="w-full bg-transparent text-sm border-none outline-none text-slate-800 dark:text-slate-100 resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={contactSending}
              className="w-full px-5 py-3 font-semibold rounded-full text-xs text-white bg-[#1e3a8a] hover:bg-[#1e40af] dark:bg-[#7c3aed] dark:hover:bg-[#6d28d9] shadow-md shadow-blue-900/10 hover:shadow-blue-900/20 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {contactSending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Submitting message details...</span>
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  <span>Send Message</span>
                </>
              )}
            </button>

            {contactSuccessMsg && (
              <p className="text-xs text-emerald-500 font-semibold p-2.5 bg-emerald-500/5 border border-emerald-500/10 rounded-xl text-center">
                {contactSuccessMsg}
              </p>
            )}
            {contactErrorMsg && (
              <p className="text-xs text-rose-500 font-semibold p-2.5 bg-rose-500/5 border border-rose-550/10 rounded-xl text-center">
                {contactErrorMsg}
              </p>
            )}
          </form>

        </div>
      </section>

    </div>
  );
};
