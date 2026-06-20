import React from "react";
import { Link } from "./RouterContext";
import { Blog } from "../types";
import { Calendar, Clock, ArrowRight, Tag } from "lucide-react";

interface BlogCardProps {
  blog: Blog;
}

export const BlogCard: React.FC<BlogCardProps> = ({ blog }) => {
  const formattedDate = new Date(blog.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <article className="group relative flex flex-col justify-between h-full bg-white dark:bg-slate-900/50 hover:bg-slate-50 dark:hover:bg-slate-950/40 rounded-2xl border border-gray-200 dark:border-slate-800/80 hover:border-[#7c3aed] dark:hover:border-[#7c3aed]/50 shadow-sm hover:shadow-md hover:shadow-blue-900/10 transition-all duration-300">
      <div className="p-6 space-y-4">
        {/* Category & Badge */}
        <div className="flex flex-wrap items-center justify-between gap-2.5">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full bg-purple-50 dark:bg-[#7c3aed]/10 text-[#7c3aed] dark:text-[#a78bfa] border border-purple-100 dark:border-[#7c3aed]/20">
            <Tag className="h-3 w-3" />
            {blog.category}
          </span>
          {blog.featured && (
            <span className="px-2 py-0.5 text-[10px] font-mono leading-none tracking-wider text-amber-600 dark:text-amber-400 bg-amber-500/10 rounded uppercase font-extrabold border border-amber-500/10">
              Featured
            </span>
          )}
        </div>

        {/* Title */}
        <Link to={`/blog/${blog.slug || blog.id}`} className="block">
          <h3 className="font-sans font-bold text-base leading-snug tracking-tight text-slate-800 dark:text-white group-hover:text-[#1e3a8a] dark:group-hover:text-[#a78bfa] transition-colors">
            {blog.title}
          </h3>
        </Link>

        {/* Excerpt */}
        <p className="text-xs line-clamp-3 text-gray-500 dark:text-slate-400 leading-relaxed">
          {blog.excerpt}
        </p>

        {/* Tags */}
        {blog.tags && blog.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {blog.tags.map((tag) => (
              <span key={tag} className="text-[11px] font-mono font-medium text-slate-400 dark:text-slate-500">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Meta bottom */}
      <div className="mt-auto px-6 pb-6 pt-4 border-t border-gray-150 dark:border-slate-800/50 flex items-center justify-between text-xs text-slate-400 dark:text-slate-500">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            {formattedDate}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {blog.readTime || "5m"}
          </span>
        </div>

        <Link
          to={`/blog/${blog.slug || blog.id}`}
          className="flex items-center gap-1 font-bold text-[#7c3aed] dark:text-[#a78bfa] group-hover:translate-x-1 transition-transform"
        >
          <span>Read</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </article>
  );
};
