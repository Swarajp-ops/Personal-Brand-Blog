import React, { useState } from "react";
import { ThemeProvider } from "./components/ThemeContext";
import { RouterProvider, useRouter } from "./components/RouterContext";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { AIChatbot } from "./components/AIChatbot";
import { ProjectDetailModal } from "./components/ProjectDetailModal";

// Pages
import { Home } from "./pages/Home";
import { Portfolio } from "./pages/Portfolio";
import { Blog } from "./pages/Blog";
import { BlogPost } from "./pages/BlogPost";
import { Resume } from "./pages/Resume";
import { AdminDashboard } from "./pages/AdminDashboard";

// Types
import { Project } from "./types";

const MainLayout: React.FC = () => {
  const { path } = useRouter();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Quick navigation routing switch
  const renderPage = () => {
    // Exact routes
    if (path === "/") {
      return <Home onViewProject={(p) => setSelectedProject(p)} />;
    }
    
    if (path === "/projects") {
      return <Portfolio onViewProject={(p) => setSelectedProject(p)} />;
    }
    
    if (path === "/blog") {
      return <Blog />;
    }
    
    if (path === "/resume") {
      return <Resume />;
    }
    
    if (path === "/admin") {
      return <AdminDashboard />;
    }

    // Dynamic Parameterized routes matchers
    if (path.startsWith("/blog/")) {
      return <BlogPost />;
    }

    // Fallback 404 page
    return (
      <div className="max-w-md mx-auto py-24 text-center px-4 space-y-4">
        <h2 className="text-3xl font-heading font-black tracking-tight text-slate-800 dark:text-white">
          404 - Page Not Found
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
          The developers coordinates you entered don't point to mapped files. Let's redirect you back to Swaraj's main feed board!
        </p>
        <button
          onClick={() => window.history.pushState({}, "", "/")}
          className="px-4.5 py-2.5 font-semibold text-xs tracking-tight bg-teal-500 text-white rounded-xl active:scale-95 transition"
        >
          Return Home
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950 text-slate-850 dark:text-slate-100 transition-colors duration-300">
      {/* 1. Brand Header */}
      <Navbar />

      {/* 2. Main Content Canvas */}
      <main className="flex-grow pt-8">
        {renderPage()}
      </main>

      {/* 3. Helper chatbot support prompt */}
      <AIChatbot />

      {/* 4. Project Details interactive overlay modal */}
      {selectedProject && (
        <ProjectDetailModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}

      {/* 5. Brand footer */}
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <RouterProvider>
        <MainLayout />
      </RouterProvider>
    </ThemeProvider>
  );
}
