import React, { useState } from "react";
import { Link } from "./RouterContext";
import { ApiClient } from "../api";
import { Mail, Github, Linkedin, Send, Terminal, Loader2 } from "lucide-react";

export const Footer: React.FC = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setMsg("");
    setErrorMsg("");
    try {
      const res = await ApiClient.subscribeNewsletter(email);
      setMsg(res.message || "Subscribed successfully!");
      setEmail("");
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to subscribe to newsletter.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="bg-slate-50 dark:bg-slate-950 border-t border-slate-200/50 dark:border-slate-800/50 pt-16 pb-8 transition-colors duration-300 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8 pb-12 border-b border-slate-200/50 dark:border-slate-800/50">
          
          {/* Col 1: Bio */}
          <div className="col-span-1 md:col-span-5 space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <span className="text-lg font-sans font-bold tracking-tight text-[#1e3a8a] dark:text-white transition-colors">
                Swaraj<span className="text-[#7c3aed]">Patil</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400 max-w-sm">
              Electronics and Telecommunication Engineering Student at Sant Gajanan Maharaj College of Engineering (SSGMCE). 
              Crafting scalable full-stack web architectures integrated with helpful AI components.
            </p>
            <div className="flex gap-4 pt-1">
              <a
                href="https://github.com/Swarajp-ops"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition"
                title="Swaraj on GitHub"
              >
                <Github className="h-4 w-4" />
              </a>
              <a
                href="https://www.linkedin.com/in/swaraj-patil-a9b477376/"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition"
                title="Swaraj on LinkedIn"
              >
                <Linkedin className="h-4 w-4" />
              </a>
              <a
                href="mailto:pilly2702@gmail.com"
                className="p-2 rounded-xl text-slate-400 hover:text-slate-905 dark:hover:text-white bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition"
                title="Email Swaraj"
              >
                <Mail className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Useful links */}
          <div className="col-span-1 md:col-span-3 space-y-4">
            <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-[#1e3a8a] dark:text-[#a78bfa]">
              Quick Navigation
            </h4>
            <ul className="space-y-2.5 text-xs font-semibold">
              <li>
                <Link to="/" className="text-slate-600 dark:text-slate-300 hover:text-[#7c3aed] dark:hover:text-[#a78bfa] transition">
                  Home Portfolio
                </Link>
              </li>
              <li>
                <Link to="/projects" className="text-slate-600 dark:text-slate-300 hover:text-[#7c3aed] dark:hover:text-[#a78bfa] transition">
                  My Projects
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-slate-600 dark:text-slate-300 hover:text-[#7c3aed] dark:hover:text-[#a78bfa] transition">
                  Technical Blog
                </Link>
              </li>
              <li>
                <Link to="/resume" className="text-slate-600 dark:text-slate-300 hover:text-[#7c3aed] dark:hover:text-[#a78bfa] transition">
                  CV / Resume Details
                </Link>
              </li>
              <li>
                <Link to="/admin" className="text-slate-600 dark:text-slate-300 hover:text-[#7c3aed] dark:hover:text-[#a78bfa] transition">
                  Admin Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Newsletter */}
          <div className="col-span-1 md:col-span-4 space-y-4">
            <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-slate-400 dark:text-slate-400">
              Substack / Newsletter
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Subscribe to get Swaraj's weekly coding guide updates, ATS optimization tips, and full-stack insights!
            </p>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="relative flex rounded-xl overflow-hidden border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus-within:border-[#7c3aed] transition-colors">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@email.com"
                  required
                  className="w-full px-4 py-2.5 bg-transparent border-none outline-none text-slate-800 dark:text-slate-100 placeholder-slate-400 text-sm focus:ring-0"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 bg-[#1e3a8a] text-white hover:bg-[#1e40af] dark:bg-[#7c3aed] dark:hover:bg-[#6d28d9] font-medium text-xs flex items-center gap-1 transition-colors"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <Send className="h-3 w-3" />
                      <span>Join</span>
                    </>
                  )}
                </button>
              </div>
              {msg && <p className="text-xs text-emerald-500 font-medium animate-fade-in">{msg}</p>}
              {errorMsg && <p className="text-xs text-rose-500 font-medium animate-fade-in">{errorMsg}</p>}
            </form>
          </div>
        </div>

        {/* Brand credit */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-8 text-xs text-slate-400 space-y-4 md:space-y-0 font-mono">
          <div>
            &copy; {new Date().getFullYear()} Swaraj Patil. All Rights Reserved.
          </div>
          <div className="flex items-center gap-1">
            <Terminal className="h-3.5 w-3.5 text-[#7c3aed]" />
            <span>Built with MERN Stack + Google Gemini API</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
