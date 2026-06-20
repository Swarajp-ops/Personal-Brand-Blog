import React, { useState, useEffect } from "react";
import { useRouter, Link } from "../components/RouterContext";
import { MarkdownRenderer } from "../components/MarkdownRenderer";
import { ApiClient } from "../api";
import { Blog } from "../types";
import { 
  ArrowLeft, Calendar, User, Clock, Share2, 
  Twitter, Linkedin, Link2, Check, Loader2, Sparkles 
} from "lucide-react";

export const BlogPost: React.FC = () => {
  const { path } = useRouter();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [scrollProgress, setScrollProgress] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);

  // Extract ID or Slug from path. URL is /blog/:slug
  // Our Router Context stores pathname e.g., `/blog/jwt-authentication`
  const slug = path.split("/")[2];

  useEffect(() => {
    const fetchBlogPost = async () => {
      setLoading(true);
      setError("");
      try {
        if (!slug) throw new Error("Blog post slug not specified.");
        const data = await ApiClient.getBlog(slug);
        setBlog(data);
      } catch (err: any) {
        setError(err.message || "Failed to load blog post.");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogPost();
  }, [slug]);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        setScrollProgress((window.scrollY / totalScroll) * 100);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleShareCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-3">
        <Loader2 className="h-8 w-8 text-teal-500 animate-spin" />
        <span className="text-sm text-slate-400 dark:text-slate-500 font-mono">Loading full-text article...</span>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="max-w-xl mx-auto py-24 text-center space-y-4 px-4">
        <div className="text-red-500 bg-red-500/5 p-4 rounded-2xl border border-red-500/10 font-medium">
          {error || "We could not find the requested technical article."}
        </div>
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-sm font-semibold text-teal-500 hover:text-teal-650"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to blog feed</span>
        </Link>
      </div>
    );
  }

  const formattedDate = new Date(blog.createdAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="relative pb-24 animate-fade-in text-slate-800 dark:text-slate-100 max-w-4xl mx-auto px-4">
      
      {/* Scroll Reading Progress Tracker Bar */}
      <div className="fixed top-16 left-0 right-0 h-1.5 bg-slate-100 dark:bg-slate-900 z-50 no-print">
        <div 
          className="h-full bg-gradient-to-r from-teal-400 via-teal-500 to-sky-500 transition-all duration-75"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Navigation and Actions Row */}
      <div className="flex items-center justify-between py-6 border-b border-slate-100 dark:border-slate-900 mb-8 no-print">
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-white transition"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Articles Archive</span>
        </Link>

        {/* Share simulations container */}
        <div className="flex items-center gap-2 text-slate-400">
          <span className="text-xs font-semibold mr-1 flex items-center gap-1">
            <Share2 className="h-3.5 w-3.5" />
            <span>Share:</span>
          </span>
          <button
            onClick={handleShareCopy}
            className="p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-300 transition border border-slate-200/30 dark:border-slate-700/30"
            title="Copy URL Link"
          >
            {copiedLink ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Link2 className="h-3.5 w-3.5" />}
          </button>
          <a
            href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(blog.title)}`}
            target="_blank"
            rel="noreferrer"
            className="p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-400 hover:text-sky-500 transition border border-slate-200/30 dark:border-slate-700/30"
            title="Twitter Share"
          >
            <Twitter className="h-3.5 w-3.5" />
          </a>
          <a
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`}
            target="_blank"
            rel="noreferrer"
            className="p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-400 hover:text-blue-600 transition border border-slate-200/30 dark:border-slate-700/30"
            title="LinkedIn Share"
          >
            <Linkedin className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>

      {/* Main Core Blog Article details */}
      <article className="space-y-8">
        
        {/* Banner Details */}
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2.5">
            <span className="px-3 py-1 text-xs font-semibold rounded-lg bg-teal-500/5 dark:bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/10">
              {blog.category}
            </span>
            {blog.featured && (
              <span className="px-2 py-0.5 text-[10px] font-mono leading-normal tracking-wide text-amber-500 bg-amber-500/10 rounded uppercase font-bold border border-amber-500/10">
                Featured Article
              </span>
            )}
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
            {blog.title}
          </h1>

          {/* Author info & Metadata */}
          <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-500 dark:text-slate-400 pt-2 border-b border-slate-100 dark:border-slate-900 pb-6">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-full bg-gradient-to-tr from-teal-500 to-sky-500 text-white font-heading font-extrabold flex items-center justify-center text-xs shadow-sm">
                SP
              </div>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{blog.author}</span>
            </div>
            
            <div className="h-1 w-1 rounded-full bg-slate-300 dark:bg-slate-700 hidden sm:block" />

            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              {formattedDate}
            </span>

            <div className="h-1 w-1 rounded-full bg-slate-300 dark:bg-slate-700" />

            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {blog.readTime || "5 min"} read
            </span>
          </div>
        </div>

        {/* Detailed prose content */}
        <div className="markdown-body max-w-none">
          <MarkdownRenderer content={blog.content} />
        </div>

        {/* Floating suggestion bottom info */}
        <div className="mt-16 p-6 md:p-8 bg-slate-50 dark:bg-slate-900/30 border border-slate-200/50 dark:border-slate-800/55 rounded-3xl space-y-4 no-print shadow-sm">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-teal-500" />
            <h3 className="font-heading font-extrabold text-base tracking-tight text-slate-900 dark:text-white">
              Reader Insights
            </h3>
          </div>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            Welcome to Swaraj's writing archive. This post was authored inside Pune, PICT. Want to ask direct follow-up questions? Simply press the collapsible floating helper assistant in the corner and prompt away!
          </p>
        </div>

      </article>

    </div>
  );
};
