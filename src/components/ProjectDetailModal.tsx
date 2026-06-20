import React from "react";
import { Project } from "../types";
import { X, Github, ExternalLink, Calendar, CheckSquare } from "lucide-react";

interface ProjectDetailModalProps {
  project: Project | null;
  onClose: () => void;
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({ project, onClose }) => {
  if (!project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-fade-in no-print">
      {/* Modal Dialog */}
      <div className="relative w-full max-w-3xl max-h-[85vh] overflow-y-auto bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 transition-all duration-300">
        
        {/* Header Hero Cover */}
        <div className="relative h-64 md:h-72 w-full bg-slate-100 dark:bg-slate-800">
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/30 to-transparent flex items-end p-6">
            <div className="space-y-1">
              <span className="px-3 py-1 text-[10px] font-mono leading-none font-bold tracking-widest text-[#22d3ee] bg-slate-950/80 rounded-lg uppercase shadow">
                {project.category}
              </span>
              <h2 className="text-xl md:text-2xl font-heading font-extrabold text-white mt-1.5 tracking-tight leading-snug">
                {project.title}
              </h2>
            </div>
          </div>

          {/* Close button top right */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-slate-950/60 text-white hover:bg-slate-950/80 transition shadow-lg backdrop-blur"
            aria-label="Close project modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content detail layout */}
        <div className="p-6 md:p-8 space-y-6">
          {/* Main Description */}
          <div className="space-y-3">
            <h4 className="text-sm font-mono font-bold tracking-wider text-slate-400 uppercase">
              Project Description
            </h4>
            <p className="text-sm md:text-base leading-relaxed text-slate-600 dark:text-slate-300">
              {project.description}
            </p>
          </div>

          {/* Technical Specs checklist */}
          <div className="space-y-3">
            <h4 className="text-sm font-mono font-bold tracking-wider text-slate-400 uppercase">
              Technology Stack Specs
            </h4>
            <div className="flex flex-wrap gap-2 pt-1">
              {project.techStack.map((tech) => (
                <span
                  key={tech}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-teal-500/5 dark:bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/10"
                >
                  <CheckSquare className="h-3.5 w-3.5 text-teal-500" />
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Quick info boxes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-100 dark:border-slate-800/80">
            <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400 text-sm">
              <Calendar className="h-4 w-4 text-slate-400" />
              <span>Project Released: <strong>{new Date(project.createdAt).toLocaleDateString("en-US", { month: 'long', year: 'numeric' })}</strong></span>
            </div>
            
            <div className="flex justify-start md:justify-end gap-3">
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-5 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 font-semibold text-xs flex items-center gap-2 border border-slate-200 dark:border-slate-700 transition"
                >
                  <Github className="h-4 w-4" />
                  <span>GitHub Repository</span>
                </a>
              )}
              {project.liveUrl ? (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-sky-500 hover:from-teal-600 hover:to-sky-600 text-white font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-teal-500/15 hover:shadow-teal-500/25 transition"
                >
                  <ExternalLink className="h-4 w-4" />
                  <span>Launch Live Demo</span>
                </a>
                ) : (
                <span className="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 font-mono text-xs flex items-center gap-1">
                  Local/IoT deployment only
                </span>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
