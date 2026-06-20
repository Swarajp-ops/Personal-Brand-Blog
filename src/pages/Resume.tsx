import React from "react";
import { 
  Printer, Briefcase, GraduationCap, Code, 
  Settings, Award, Phone, Mail, Globe, MapPin, Linkedin, Github
} from "lucide-react";

export const Resume: React.FC = () => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="pb-24 animate-fade-in text-slate-800 dark:text-slate-100 max-w-4xl mx-auto px-4 relative">
      
      {/* Download / Print Trigger button - Hidden during printing */}
      <div className="flex justify-between items-center py-6 border-b border-gray-200 dark:border-slate-800 mb-8 max-w-4xl mx-auto no-print">
        <div>
          <h1 className="text-xl font-heading font-extrabold tracking-tight text-[#1e3a8a] dark:text-white">
            Swaraj Patil's Professional CV
          </h1>
          <p className="text-xs text-slate-400">
            Interactive printable document formatted for ATS and recruiting reviewers
          </p>
        </div>
        
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-4.5 py-2.5 rounded-full bg-[#1e3a8a] hover:bg-[#1e40af] dark:bg-[#7c3aed] dark:hover:bg-[#6d28d9] text-white font-extrabold text-xs shadow-md shadow-blue-900/10 hover:shadow-blue-900/20 active:scale-95 transition-all duration-200"
          title="Print or Save Resume as PDF"
        >
          <Printer className="h-4 w-4" />
          <span>Download PDF / Print Resume</span>
        </button>
      </div>

      {/* Resume Container Sheet */}
      <div className="print-container bg-white dark:bg-slate-900 p-8 md:p-12 border border-gray-200 dark:border-slate-800 rounded-3xl shadow-xl space-y-8 select-text">
        {/* Header Block */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center pb-8 border-b border-gray-200 dark:border-slate-850 gap-4">
          <div className="space-y-1.5">
            <h2 className="text-3xl font-sans font-black text-slate-900 dark:text-white tracking-tight">
              Swaraj Patil
            </h2>
            <p className="text-[#1e3a8a] dark:text-[#a78bfa] font-mono text-xs tracking-wider font-bold uppercase">
              Full-Stack Developer (MERN)
            </p>
            <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-xs font-semibold">
              <MapPin className="h-3.5 w-3.5 text-slate-450" />
              <span>Maharashtra, India (Open to relocate and remote)</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-2.5 text-xs font-semibold text-slate-650 dark:text-slate-300 bg-gray-50 dark:bg-slate-950 p-4.5 rounded-2xl border border-gray-250/50 dark:border-slate-800/60 w-full md:w-auto">
            <a href="mailto:pilly2702@gmail.com" className="flex items-center gap-2.5 hover:text-[#7c3aed] dark:hover:text-[#a78bfa] transition">
              <Mail className="h-4 w-4 text-[#1e3a8a] dark:text-[#a78bfa]" />
              <span>pilly2702@gmail.com</span>
            </a>
            <a href="https://github.com/Swarajp-ops" target="_blank" rel="noreferrer" className="flex items-center gap-2.5 hover:text-[#7c3aed] dark:hover:text-[#a78bfa] transition">
              <Github className="h-4 w-4 text-[#1e3a8a] dark:text-[#a78bfa]" />
              <span>github.com/Swarajp-ops</span>
            </a>
            <a href="https://www.linkedin.com/in/swaraj-patil-a9b477376/" target="_blank" rel="noreferrer" className="flex items-center gap-2.5 hover:text-[#7c3aed] dark:hover:text-[#a78bfa] transition">
              <Linkedin className="h-4 w-4 text-[#1e3a8a] dark:text-[#a78bfa]" />
              <span>linkedin.com/in/swaraj-patil-a9b477376/</span>
            </a>
            <div className="flex items-center gap-2.5">
              <Phone className="h-4 w-4 text-[#1e3a8a] dark:text-[#a78bfa]" />
              <span>+91 7058650218</span>
            </div>
          </div>
        </div>

        {/* Dynamic Professional Summary */}
        <div className="space-y-3">
          <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-[#1e3a8a] dark:text-[#a78bfa] border-b border-gray-100 dark:border-slate-800 pb-1.5">
            Professional Summary
          </h3>
          <p className="text-xs md:text-sm text-slate-650 dark:text-slate-300 leading-relaxed font-semibold">
            Full-Stack MERN Developer with hands-on experience designing, developing, and deploying scalable web applications using ReactJS, Node.js, ExpressJS, and MongoDB. Proficient in REST API development, JWT authentication, and AI-integrated product workflows. Seeking a full-stack development internship to apply expertise in end-to-end application development, responsive UI design, and cloud deployment.
          </p>
        </div>

        {/* Education History Block */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-slate-900 dark:text-white border-b border-gray-100 dark:border-slate-800 pb-2">
            <GraduationCap className="h-5 w-5 text-[#7c3aed] dark:text-[#a78bfa]" />
            <h3 className="font-heading font-extrabold text-lg tracking-tight">Education</h3>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div>
              <h4 className="font-bold text-slate-800 dark:text-slate-100 text-base">
                Sant Gajanan Maharaj College of Engineering
              </h4>
              <p className="text-sm text-slate-500 dark:text-slate-450 font-semibold">
                Bachelor of Technology (B.Tech) in Electronics and Telecommunication Engineering
              </p>
            </div>
            <div className="text-left sm:text-right">
              <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-blue-50 dark:bg-slate-850 text-[#1e3a8a] dark:text-white">
                CGPA: 8.2 / 10
              </span>
              <p className="text-[11px] font-mono text-slate-400 mt-1">2023 – 2027</p>
            </div>
          </div>
        </div>

        {/* Technical Skills Table */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-slate-900 dark:text-white border-b border-gray-100 dark:border-slate-800 pb-2">
            <Settings className="h-5 w-5 text-[#7c3aed]" />
            <h3 className="font-heading font-extrabold text-lg tracking-tight">Technical Skills</h3>
          </div>

          <div className="space-y-3.5 text-xs md:text-sm">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-2 md:gap-4 border-b border-gray-50 dark:border-slate-850 pb-2.5">
              <span className="font-bold text-[#1e3a8a] dark:text-[#a78bfa]">Languages:</span>
              <span className="col-span-3 text-slate-650 dark:text-slate-355 font-semibold">JavaScript (ES6+), TypeScript, Java, SQL, C++</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-2 md:gap-4 border-b border-gray-50 dark:border-slate-850 pb-2.5">
              <span className="font-bold text-[#1e3a8a] dark:text-[#a78bfa]">Frontend:</span>
              <span className="col-span-3 text-slate-650 dark:text-slate-355 font-semibold">ReactJS, Next.js, HTML5, CSS3, Tailwind CSS</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-2 md:gap-4 border-b border-gray-50 dark:border-slate-850 pb-2.5">
              <span className="font-bold text-[#1e3a8a] dark:text-[#a78bfa]">Backend:</span>
              <span className="col-span-3 text-slate-650 dark:text-slate-355 font-semibold">Node.js, Express.js, REST API Development</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-2 md:gap-4 border-b border-gray-50 dark:border-slate-850 pb-2.5">
              <span className="font-bold text-[#1e3a8a] dark:text-[#a78bfa]">Database:</span>
              <span className="col-span-3 text-slate-650 dark:text-slate-355 font-semibold">MongoDB, Mongoose ODM</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-2 md:gap-4 border-b border-gray-50 dark:border-slate-850 pb-2.5">
              <span className="font-bold text-[#1e3a8a] dark:text-[#a78bfa]">Tools & Platforms:</span>
              <span className="col-span-3 text-slate-650 dark:text-slate-355 font-semibold">Git, GitHub, VS Code, Postman, Vercel, Railway</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-2 md:gap-4 pb-1">
              <span className="font-bold text-[#1e3a8a] dark:text-[#a78bfa]">Core Concepts:</span>
              <span className="col-span-3 text-slate-650 dark:text-slate-355 font-semibold">JWT Authentication, CRUD Operations, Third-Party API Integration, Responsive Web Design, Real-Time Features, MVC Architecture</span>
            </div>
          </div>
        </div>

        {/* Key Projects Block */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-slate-900 dark:text-white border-b border-gray-100 dark:border-slate-800 pb-2">
            <Briefcase className="h-5 w-5 text-[#7c3aed]" />
            <h3 className="font-heading font-extrabold text-lg tracking-tight">Academic & Personal Projects</h3>
          </div>

          <div className="space-y-6">
            {/* Project 1 */}
            <div className="space-y-1.5">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm md:text-base">
                  AI ATS Resume Checker
                </h4>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-slate-850 text-[#1e3a8a] dark:text-[#a78bfa] mt-1 sm:mt-0 font-mono">
                  React, Node.js, Express.js, MongoDB
                </span>
              </div>
              <ul className="list-disc pl-5 text-xs md:text-sm text-slate-600 dark:text-slate-350 space-y-1">
                <li>Engineered a full-stack AI-powered SaaS application enabling users to upload resumes, receive automated ATS compatibility scores, and generate actionable improvement suggestions.</li>
                <li>Designed and implemented modular backend services for resume parsing, scoring logic, and personalized feedback generation, reducing manual resume review effort.</li>
                <li>Deployed a production-ready application on Railway with end-to-end data flow from file upload to AI-driven analysis and structured user feedback.</li>
              </ul>
            </div>

            {/* Project 2 */}
            <div className="space-y-1.5">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm md:text-base">
                  MERN Job Portal
                </h4>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-slate-850 text-[#1e3a8a] dark:text-[#a78bfa] mt-1 sm:mt-0 font-mono">
                  MongoDB, Express.js, React, Node.js, JWT
                </span>
              </div>
              <ul className="list-disc pl-5 text-xs md:text-sm text-slate-600 dark:text-slate-355 space-y-1">
                <li>Developed a production-grade full-stack job portal supporting dual user roles (candidate and recruiter) with role-based access control, job posting, and application tracking workflows.</li>
                <li>Implemented secure JWT-based authentication, ownership-based content controls, and advanced job filtering to replicate real-world hiring platform functionality.</li>
                <li>Built a fully responsive, component-based React frontend integrated with a scalable RESTful Express.js backend and MongoDB data layer.</li>
              </ul>
            </div>

            {/* Project 3 */}
            <div className="space-y-1.5">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm md:text-base">
                  Password Manager
                </h4>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-slate-850 text-[#1e3a8a] dark:text-[#a78bfa] mt-1 sm:mt-0 font-mono">
                  HTML5, CSS3, JavaScript
                </span>
              </div>
              <ul className="list-disc pl-5 text-xs md:text-sm text-slate-600 dark:text-slate-355 space-y-1">
                <li>Developed a secure, browser-based credential management tool featuring structured data storage, intuitive CRUD operations, and a clean user interface following web security best practices.</li>
              </ul>
            </div>

            {/* Project 4 */}
            <div className="space-y-1.5">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm md:text-base">
                  Movie Search Web App
                </h4>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-slate-850 text-[#1e3a8a] dark:text-[#a78bfa] mt-1 sm:mt-0 font-mono">
                  HTML5, CSS3, JavaScript, REST API
                </span>
              </div>
              <ul className="list-disc pl-5 text-xs md:text-sm text-slate-600 dark:text-slate-355 space-y-1">
                <li>Built a dynamic movie discovery application integrating a third-party REST API for real-time data fetching, implementing search functionality and responsive UI rendering.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Achievements & Activities */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-slate-900 dark:text-white border-b border-gray-100 dark:border-slate-800 pb-2">
            <Award className="h-5 w-5 text-[#7c3aed]" />
            <h3 className="font-heading font-extrabold text-lg tracking-tight">Achievements & Activities</h3>
          </div>
          <ul className="list-disc pl-5 text-xs md:text-sm text-slate-650 dark:text-slate-350 space-y-2 font-semibold leading-relaxed">
            <li>Delivered <strong>5+ full-stack MERN projects</strong> demonstrating end-to-end development skills spanning frontend, backend, database design, authentication, and cloud deployment.</li>
            <li>Awarded <strong>Reader of the Year</strong> by Dnyandeep Vachnalay Kalkundri, recognizing outstanding reading habits and commitment to continuous learning.</li>
            <li>Maintained an active <strong>GitHub profile</strong> showcasing consistent project-based learning and version-controlled development workflows.</li>
            <li>Completed <strong>AI workshop by NextWave</strong> and participated in Kaggle coding challenges, strengthening applied machine learning and problem-solving skills.</li>
          </ul>
        </div>
      </div>

    </div>
  );
};
