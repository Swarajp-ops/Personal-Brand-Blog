import React from "react";
import { Project } from "../types";
import { Github, ExternalLink, ArrowRight, Eye } from "lucide-react";

interface ProjectCardProps {
  project: Project;
  onViewDetails: (project: Project) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onViewDetails }) => {
  return (
    <div className="group relative flex flex-col justify-between h-full bg-white dark:bg-slate-900/40 rounded-2xl border border-gray-200 dark:border-slate-800/80 overflow-hidden hover:border-[#7c3aed] dark:hover:border-[#7c3aed]/50 shadow-sm hover:shadow-md hover:shadow-blue-900/10 transition-all duration-300">
      
      {/* Visual Header Image */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
        <img
          src={project.image}
          alt={project.title}
          loading="lazy"
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-4">
          <button
            onClick={() => onViewDetails(project)}
            className="px-3.5 py-1.5 rounded-full bg-white/95 text-slate-800 font-bold text-[11px] flex items-center gap-1.5 shadow backdrop-blur hover:bg-white transition"
          >
            <Eye className="h-3.5 w-3.5" />
            <span>Discover Details</span>
          </button>
        </div>

        {/* Category sticker */}
        <div className="absolute top-4 left-4">
          <span className="px-2.5 py-1 rounded-full text-[9px] font-mono leading-none font-bold tracking-wider text-white bg-[#1e3a8a] uppercase shadow">
            {project.category}
          </span>
        </div>

        {/* Featured Sticker */}
        {project.featured && (
          <div className="absolute top-4 right-4 animate-pulse">
            <span className="px-2 py-0.5 text-[9px] font-mono font-extrabold tracking-wider bg-[#7c3aed] text-white rounded-full uppercase border border-[#a78bfa] shadow">
              Featured
            </span>
          </div>
        )}
      </div>

      {/* Content Details */}
      <div className="p-6 space-y-4">
        <div>
          <h3 className="font-sans font-bold text-base text-[#1e3a8a] dark:text-white tracking-tight leading-snug group-hover:text-[#7c3aed] dark:group-hover:text-[#a78bfa] transition-colors">
            {project.title}
          </h3>
        </div>

        {/* Small Excerpt */}
        <p className="text-xs line-clamp-2 text-gray-500 dark:text-slate-400 leading-relaxed">
          {project.shortDesc}
        </p>

        {/* Tech Badges */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {project.techStack.slice(0, 4).map((tech) => (
            <span
              key={tech}
              className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-gray-50 dark:bg-slate-850 text-gray-600 dark:text-slate-350 border border-gray-100 dark:border-slate-800/60"
            >
              {tech}
            </span>
          ))}
          {project.techStack.length > 4 && (
            <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 text-slate-400">
              +{project.techStack.length - 4} more
            </span>
          )}
        </div>
      </div>

      {/* External Anchors Footer */}
      <div className="mt-auto px-6 pb-6 pt-4 border-t border-gray-150 dark:border-slate-800/50 flex items-center justify-between">
        <button
          onClick={() => onViewDetails(project)}
          className="text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-[#7c3aed] dark:hover:text-[#a78bfa] flex items-center gap-1 transition"
        >
          <span>More Details</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>

        <div className="flex items-center gap-2.5">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="p-1 px-2.5 text-xs text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-50 dark:bg-slate-800 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition flex items-center gap-1.5 font-semibold border border-slate-200/45 dark:border-slate-700/45"
              title="GitHub Repository"
            >
              <Github className="h-4 w-4" />
              <span>Code</span>
            </a>
          )}
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer"
              className="p-1 px-2.5 text-xs text-[#1e3a8a] dark:text-[#a78bfa] hover:text-[#1e40af] dark:hover:text-white bg-blue-50 dark:bg-[#7c3aed]/10 rounded-lg hover:bg-blue-100 dark:hover:bg-[#7c3aed]/20 transition flex items-center gap-1.5 font-bold border border-blue-100 dark:border-[#7c3aed]/10"
              title="Live Application Demo"
            >
              <ExternalLink className="h-4 w-4" />
              <span>Demo</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
};
