import React, { useState, useEffect } from "react";
import { ProjectCard } from "../components/ProjectCard";
import { ApiClient } from "../api";
import { Project } from "../types";
import { Search, SlidersHorizontal, Loader2, Sparkles } from "lucide-react";

interface PortfolioProps {
  onViewProject: (project: Project) => void;
}

export const Portfolio: React.FC<PortfolioProps> = ({ onViewProject }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", "MERN Stack", "AI Integration", "Real-Time Apps", "IoT"];

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await ApiClient.getProjects();
        setProjects(data);
      } catch (err) {
        console.error("Failed to load projects inside portfolio page", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  // Filter logic on title/description/techstack
  const filteredProjects = projects.filter((proj) => {
    const matchesCategory = selectedCategory === "All" || proj.category === selectedCategory;
    
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = 
      proj.title.toLowerCase().includes(searchLower) ||
      proj.shortDesc.toLowerCase().includes(searchLower) ||
      proj.techStack.some((tech) => tech.toLowerCase().includes(searchLower)) ||
      proj.category.toLowerCase().includes(searchLower);

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-12 pb-16 animate-fade-in text-slate-800 dark:text-slate-100 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Page Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
          Innovative Projects Portfolio
        </h1>
        <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
          Explore a curated selection of full stack deployments, secure tools, WebRTC meeting rooms, and intelligent AI models designed by Swaraj Patil.
        </p>
      </div>

      {/* Filter and Search Layout Grid */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4 justify-between bg-slate-50 dark:bg-slate-900/10 p-4 border border-gray-200 dark:border-slate-800/60 rounded-2xl">
        {/* Search Input Box */}
        <div className="relative flex items-center bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-850 rounded-xl px-3.5 flex-1 max-w-md focus-within:border-[#7c3aed] transition-colors">
          <Search className="h-4.5 w-4.5 text-slate-400 mr-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search details, tech stacks (e.g. JWT, WebRTC)..."
            className="w-full py-2.5 bg-transparent text-sm border-none outline-none text-slate-800 dark:text-slate-100 placeholder-slate-455"
          />
        </div>

        {/* Categories filters scrollbox */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          <SlidersHorizontal className="h-4 w-4 text-slate-400 hidden sm:block mr-1" />
          {categories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`py-1.5 px-3.5 text-xs font-semibold rounded-full tracking-tight transition whitespace-nowrap whitespace-pre ${
                  isActive
                    ? "bg-[#1e3a8a] dark:bg-[#7c3aed] text-white shadow-sm"
                    : "bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800/50 text-slate-600 dark:text-slate-300 hover:border-[#1e3a8a] dark:hover:border-[#7c3aed] hover:text-[#1e3a8a] dark:hover:text-white"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Project Card Bento Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Loader2 className="h-8 w-8 text-[#7c3aed] animate-spin" />
          <span className="text-sm text-slate-400 dark:text-slate-500 font-mono">Retrieving project catalogs...</span>
        </div>
      ) : filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onViewDetails={onViewProject}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-24 border border-dashed border-slate-300 dark:border-slate-800 rounded-3xl max-w-xl mx-auto space-y-4">
          <Sparkles className="h-8 w-8 text-teal-400 mx-auto animate-pulse" />
          <h3 className="font-heading font-extrabold text-lg text-slate-700 dark:text-white tracking-tight">
            No matching projects found
          </h3>
          <p className="text-xs text-slate-400 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
            Try adjusting your query inputs, resetting the slider filters, or check back of admin updates!
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("All");
            }}
            className="px-4 py-2 bg-slate-50 border rounded-xl hover:bg-slate-100 text-xs font-semibold text-slate-550"
          >
            Reset Filters
          </button>
        </div>
      )}

    </div>
  );
};
