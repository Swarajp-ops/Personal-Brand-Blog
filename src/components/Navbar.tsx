import React, { useState } from "react";
import { useTheme } from "./ThemeContext";
import { useRouter, Link } from "./RouterContext";
import { Menu, X, Sun, Moon, Code, Terminal, FileText, Layout, BookOpen, ShieldCheck } from "lucide-react";

export const Navbar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { path } = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: "Home", href: "/", icon: Terminal },
    { name: "Projects", href: "/projects", icon: Layout },
    { name: "Blog", href: "/blog", icon: BookOpen },
    { name: "CV / Resume", href: "/resume", icon: FileText },
    { name: "Admin Portal", href: "/admin", icon: ShieldCheck },
  ];

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border-b border-gray-200 dark:border-slate-800/80 transition-all duration-300 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Brand */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 bg-[#1e3a8a] rounded-lg flex items-center justify-center text-white font-bold text-lg group-hover:scale-105 transition-all duration-300 shadow-md shadow-blue-900/10">
              S
            </div>
            <div className="flex flex-col">
              <span className="font-sans font-bold text-md tracking-tight text-[#1e3a8a] dark:text-white transition-colors">
                Swaraj<span className="text-[#7c3aed]">Patil</span>
              </span>
              <span className="text-[9px] font-mono tracking-wider text-slate-500 dark:text-slate-400 uppercase -mt-0.5 font-bold">
                Full-Stack Web Developer
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1.5">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = path === link.href || (link.href !== "/" && path.startsWith(link.href));
              
              return (
                <Link
                  key={link.name}
                  to={link.href}
                  className={`relative flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-xs tracking-tight transition-all duration-250 ${
                    isActive
                      ? "text-[#1e3a8a] dark:text-[#a78bfa] bg-[#1e3a8a]/5 dark:bg-[#7c3aed]/10"
                      : "text-gray-600 dark:text-slate-300 hover:text-[#1e3a8a] dark:hover:text-[#a78bfa] hover:bg-gray-50 dark:hover:bg-slate-800/50"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {link.name}
                  {isActive && (
                    <span 
                      id={`nav-indicator-${link.name.toLowerCase().replace(/\s+/g,'-')}`} 
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-[2.5px] bg-[#1e3a8a] dark:bg-[#7c3aed] rounded-full" 
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Utility Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {/* Theme Toggle */}
            <button
              id="theme-toggle"
              onClick={toggleTheme}
              className="p-2 rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-[#1e3a8a] dark:hover:text-amber-400 hover:bg-slate-50 dark:hover:bg-slate-700 transition"
              aria-label="Toggle dark mode"
            >
              {theme === "dark" ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-blue-500" />}
            </button>
            
            {/* Call To Action button */}
            <Link
              to="/resume"
              className="px-4 py-2 text-xs font-semibold tracking-tight text-white bg-[#1e3a8a] hover:bg-[#1e40af] rounded-full shadow-md shadow-blue-900/15 hover:shadow-blue-900/25 active:scale-95 transition-all duration-200"
            >
              Hire Me
            </Link>
          </div>

          {/* Mobile Buttons */}
          <div className="flex md:hidden items-center gap-2">
            {/* Theme Toggle Mobile */}
            <button
              id="theme-toggle-mobile"
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Toggle dark mode"
            >
              {theme === "dark" ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-blue-500" />}
            </button>

            {/* Hamburger Toggle */}
            <button
              id="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div id="mobile-menu" className="md:hidden border-t border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-4 space-y-2 animate-fade-in">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = path === link.href || (link.href !== "/" && path.startsWith(link.href));
            
            return (
              <Link
                key={link.name}
                to={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all ${
                  isActive
                    ? "text-[#1e3a8a] bg-blue-50 dark:text-[#a78bfa] dark:bg-slate-900 font-semibold"
                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                }`}
              >
                <Icon className="h-4 w-4" />
                {link.name}
              </Link>
            );
          })}
          <div className="pt-2 border-t border-gray-200/50 dark:border-slate-800/50">
            <Link
              to="/resume"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-center w-full px-4 py-2.5 text-sm font-semibold text-white bg-[#1e3a8a] rounded-xl"
            >
              Hire Me
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
