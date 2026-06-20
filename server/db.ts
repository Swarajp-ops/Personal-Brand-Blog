import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";

export interface Blog {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  category: string;
  tags: string[];
  author: string;
  createdAt: string;
  updatedAt: string;
  readTime: string;
  featured: boolean;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  shortDesc: string;
  image: string;
  githubUrl: string;
  liveUrl: string;
  techStack: string[];
  category: string;
  createdAt: string;
  featured: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: "admin" | "user";
  createdAt: string;
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
  status: "unread" | "read" | "replied";
}

export interface Newsletter {
  id: string;
  email: string;
  createdAt: string;
}

interface DatabaseSchema {
  blogs: Blog[];
  projects: Project[];
  users: User[];
  contacts: Contact[];
  newsletters: Newsletter[];
}

const DB_FOLDER = path.join(process.cwd(), "server", "data");
const DB_FILE = path.join(DB_FOLDER, "db.json");

function ensureDirectoryExistence(filePath: string) {
  const dirname = path.dirname(filePath);
  if (!fs.existsSync(dirname)) {
    fs.mkdirSync(dirname, { recursive: true });
  }
}

export class LocalDB {
  private data: DatabaseSchema = {
    blogs: [],
    projects: [],
    users: [],
    contacts: [],
    newsletters: []
  };

  constructor() {
    this.load();
  }

  private load() {
    try {
      ensureDirectoryExistence(DB_FILE);
      if (fs.existsSync(DB_FILE)) {
        const fileContent = fs.readFileSync(DB_FILE, "utf-8");
        this.data = JSON.parse(fileContent);
      } else {
        this.seedInitialData();
      }
    } catch (error) {
      console.error("LocalDB failed to load, initializing blank structure", error);
    }
  }

  private save() {
    try {
      ensureDirectoryExistence(DB_FILE);
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), "utf-8");
    } catch (error) {
      console.error("LocalDB failed to save data", error);
    }
  }

  private seedInitialData() {
    console.log("Seeding initial local database...");

    const salt = bcrypt.genSaltSync(10);
    const adminPasswordHash = bcrypt.hashSync("admin123", salt);

    // Seed 1 Admin User
    this.data.users = [
      {
        id: "usr_1",
        name: "Swaraj Patil",
        email: "pilly2702@gmail.com",
        passwordHash: adminPasswordHash,
        role: "admin",
        createdAt: new Date().toISOString()
      }
    ];

    // Seed 8 Projects
    this.data.projects = [
      {
        id: "proj_1",
        title: "ATS Resume Checker - AI Job Matching Platform",
        description: "An intelligent, AI-powered resume analyzer matching resumes to real job descriptions, scoring applicant tracking compatibility (ATS), parsing skill hierarchies, and generating targeted optimization metrics dynamically using large language model prompts.",
        shortDesc: "AI-powered resume analyzer that checks ATS compatibility and suggests improvements for job applications",
        image: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=600&auto=format&fit=crop",
        githubUrl: "https://github.com/swarajpatil/ats-resume-checker",
        liveUrl: "https://ats-resume-checker-swaraj.vercel.app",
        techStack: ["React", "Node.js", "Express", "MongoDB", "OpenAI API", "Tailwind CSS"],
        category: "AI Integration",
        createdAt: "2026-01-10T10:00:00.000Z",
        featured: true
      },
      {
        id: "proj_2",
        title: "Job Portal - Full-Stack Job Marketplace",
        description: "A comprehensive developer job marketplace platform containing dual client workflows for job hunters and recruiters. Features custom recruiter listing panels, interactive resume submissions, live search filtering with complex database aggregations, and WebSockets-supported notification logs.",
        shortDesc: "Complete job platform with user auth, job posting, application tracking, and real-time notifications",
        image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?q=80&w=600&auto=format&fit=crop",
        githubUrl: "https://github.com/swarajpatil/job-portal",
        liveUrl: "https://job-portal-swaraj.vercel.app",
        techStack: ["React", "Node.js", "Express", "MongoDB", "JWT", "Socket.io", "Tailwind"],
        category: "MERN Stack",
        createdAt: "2025-11-15T09:30:00.000Z",
        featured: true
      },
      {
        id: "proj_3",
        title: "Password Manager - Encrypted Credential Storage",
        description: "A hardened, local credential safe secure utility applying local AES-256 client decrypt tools, automatic secure passcode generators, categorized credential folders, and dual-layer authorization mechanics for credential security.",
        shortDesc: "Secure password manager with encryption, generation, and copying features",
        image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=600&auto=format&fit=crop",
        githubUrl: "https://github.com/swarajpatil/password-manager",
        liveUrl: "https://password-manager-swaraj.vercel.app",
        techStack: ["React", "Node.js", "Express", "MongoDB", "JWT", "Crypto.js"],
        category: "MERN Stack",
        createdAt: "2025-08-20T14:15:00.000Z",
        featured: false
      },
      {
        id: "proj_4",
        title: "Food Delivery AI Platform - Smart Restaurant App",
        description: "AI-boosted local dining delivery interface featuring customized culinary item recommend engines driven by flavor profiles, active driver geolocation simulators, and direct technical client-support assistants replying in real-time.",
        shortDesc: "AI-powered food delivery app with recommendations, real-time order tracking, and chat support",
        image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=600&auto=format&fit=crop",
        githubUrl: "https://github.com/swarajpatil/food-delivery-ai",
        liveUrl: "https://food-delivery-ai.vercel.app",
        techStack: ["React", "Node.js", "Express", "MongoDB", "OpenAI API", "Socket.io", "Tailwind CSS"],
        category: "AI Integration",
        createdAt: "2025-12-05T11:45:00.000Z",
        featured: true
      },
      {
        id: "proj_5",
        title: "Video Conferencing Platform - Real-Time Video Chat",
        description: "A high-fidelity WebRTC workspace video platform handling direct peer connection audio/video channels, persistent room creation hubs, screen shares, and room participant text message chats.",
        shortDesc: "Multi-user video calling app with chat, screen sharing, and room management",
        image: "https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?q=80&w=600&auto=format&fit=crop",
        githubUrl: "https://github.com/swarajpatil/video-conferencing",
        liveUrl: "https://video-conferencing-swaraj.vercel.app",
        techStack: ["React", "Node.js", "Socket.io", "Peer.js", "WebRTC", "Tailwind"],
        category: "Real-Time Apps",
        createdAt: "2025-06-25T16:00:00.000Z",
        featured: true
      },
      {
        id: "proj_6",
        title: "Event Management System - Ticket Booking Platform",
        description: "Comprehensive reservation hub supporting custom event scheduling, guest registration databases, instant QR check-in email relays, dynamic tickets tracker, and payment confirmations.",
        shortDesc: "Create events, manage ticket sales, send notifications, and track attendees",
        image: "https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=600&auto=format&fit=crop",
        githubUrl: "https://github.com/swarajpatil/event-management",
        liveUrl: "https://event-management-swaraj.vercel.app",
        techStack: ["React", "Node.js", "Express", "MongoDB", "JWT", "Email.js"],
        category: "MERN Stack",
        createdAt: "2025-04-12T10:00:00.000Z",
        featured: false
      },
      {
        id: "proj_7",
        title: "Expense Tracker - Budget Management App",
        description: "An analytical visual ledger to input daily expenditures, chart financial trends over custom metrics, configure threshold limits alert grids, and export summaries.",
        shortDesc: "Track expenses, categorize spending, view charts, and set budget limits",
        image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=600&auto=format&fit=crop",
        githubUrl: "https://github.com/swarajpatil/expense-tracker",
        liveUrl: "https://expense-tracker-swaraj.vercel.app",
        techStack: ["React", "Node.js", "Express", "MongoDB", "Chart.js", "Tailwind"],
        category: "MERN Stack",
        createdAt: "2025-03-01T08:00:00.000Z",
        featured: false
      },
      {
        id: "proj_8",
        title: "Bluetooth Home Automation - IoT Arduino Project",
        description: "A hardware engineering solution applying an HC-05 serial Bluetooth chip paired to an Arduino microcontroller relaying custom micro-commands to toggle AC lighting systems remotely via serial telemetry.",
        shortDesc: "Control home devices via Bluetooth HC-05 with Arduino microcontroller",
        image: "https://images.unsplash.com/photo-1558002038-1055907df827?q=80&w=600&auto=format&fit=crop",
        githubUrl: "https://github.com/swarajpatil/bluetooth-home-automation",
        liveUrl: "",
        techStack: ["Arduino", "C++", "HC-05 Bluetooth", "Mobile App"],
        category: "IoT",
        createdAt: "2025-01-15T12:00:00.000Z",
        featured: false
      }
    ];

    // Seed 8 Blog Posts
    this.data.blogs = [
      {
        id: "blog_1",
        title: "How to Build Full-Stack App with MERN + AI in 2026",
        slug: "how-to-build-full-stack-app-with-mern-ai-in-2026",
        excerpt: "Learn how to integrate OpenAI/Gemini APIs into your MERN stack apps with streaming, state management, and reliable server-sided architectures.",
        category: "Web Development",
        tags: ["MERN", "AI", "OpenAI", "React", "Node.js"],
        author: "Swaraj Patil",
        createdAt: "2026-06-12T14:30:00.000Z",
        updatedAt: "2026-06-12T14:30:00.000Z",
        readTime: "15 min",
        featured: true,
        content: `### Integrating Large Language Model APIs in the MERN Stack

Artificial Intelligence integrated features are no longer just optional enhancements; they are becoming standard pillars of modern full-stack engineering. This comprehensive tutorial walks you through establishing an Express server calling high-performance AI APIs securely, routing streaming prompt packages, and consuming them inside smooth React interfaces.

#### Why Proxied Server APIs Matter

Always avoid calling commercial AI endpoints directly from the client side. Embedding secret keys directly in browser bundles exposes your billable APIs to attackers in seconds. Instead, deploy server-sided REST pipelines guarding your API secrets.

Here is a secure Node.js + Express proxy handler communicating with modern LLM SDK architectures:

\`\`\`javascript
// server/routes/ai.js
import express from 'express';
import { GoogleGenAI } from "@google/genai";

const router = express.Router();
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

router.post('/generate', async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
    });

    res.json({ result: response.text });
  } catch (error) {
    console.error('AI Processing Failure:', error);
    res.status(500).json({ error: 'Server key processing failed' });
  }
});

export default router;
\`\`\`

#### React Client Integration

In React, compile a clean form handling this prompt state gracefully:

\`\`\`jsx
import React, { useState } from 'react';

export default function AISynthesizer() {
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });
      const data = await response.json();
      setResult(data.result || data.error);
    } catch (err) {
      setResult("Connection error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-surface border border-outline-variant rounded-lg">
      <h3 className="font-headline-md text-primary mb-4">Prompt Synthesizer</h3>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Ask Swaraj's AI..."
          className="p-3 border rounded border-outline-variant bg-white"
        />
        <button type="submit" disabled={loading} className="bg-primary text-white p-2 rounded">
          {loading ? 'Thinking...' : 'Synthesize Insights'}
        </button>
      </form>
      {result && <div className="mt-4 p-4 bg-white border rounded border-outline-variant font-mono text-sm">{result}</div>}
    </div>
  );
}
\`\`\``
      },
      {
        id: "blog_2",
        title: "JWT Authentication in React: Complete Guide",
        slug: "jwt-authentication-in-react-complete-guide",
        excerpt: "Implement secure authentication with JWT tokens in React apps including protected routes, persistent sessions, and secure backend middleware.",
        category: "Web Development",
        tags: ["JWT", "React", "Authentication", "Security"],
        author: "Swaraj Patil",
        createdAt: "2026-05-18T11:00:00.000Z",
        updatedAt: "2026-05-18T11:00:00.000Z",
        readTime: "12 min",
        featured: true,
        content: `### Securing MERN Stack Apps using JWT Authentication

User Session management is a core foundation of production systems. This article shows how to program secure JSON Web Token (JWT) authorizations. We'll implement high-performance token issuance from Node, register persistent browser sessions inside React Context buffers, and shield administrative paths from unauthorized entry.

#### The Architecture Flow

1. Admin inputs secret parameters inside a login form.
2. Express validates credentials against stored, bcrypt-encrypted hashes.
3. If successful, Express signs a JWT holding user information (e.g., ID, role, status), and sends it to the client.
4. React caches this token, persisting session markers on local containers.
5. React attaches this signed authorization header with subsequent API calls.
6. Server-side middleware decodes payloads, checking role levels before committing secure database updates.

#### Issuing JWT on Express Backends

Here's an authorization middleware decoding authorization envelopes:

\`\`\`javascript
// server/middleware/auth.js
import jwt from 'jsonwebtoken';

export const verifyAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Access Denied. Authorization Header missing.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    if (verified.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden. Admin role required.' });
    }
    req.user = verified;
    next();
  } catch (error) {
    res.status(400).json({ error: 'Invalid Token' });
  }
};
\`\`\`

#### React client side Context and Hook

Establish a global React context ensuring simple access to login functions:

\`\`\`jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('admin_token') || null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (token) {
      // Decode user structure from token payload
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUser(payload);
      } catch (err) {
        logout();
      }
    }
  }, [token]);

  const login = (jwtToken) => {
    localStorage.setItem('admin_token', jwtToken);
    setToken(jwtToken);
  };

  const logout = () => {
    localStorage.removeItem('admin_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
\`\`\``
      },
      {
        id: "blog_3",
        title: "Building Real-Time Apps with Socket.io",
        slug: "building-real-time-apps-with-socket-io",
        excerpt: "Create high-performance chat apps, live collaborative counters, and asynchronous server-side notification feeds.",
        category: "Web Development",
        tags: ["Socket.io", "Real-Time", "React", "Node.js"],
        author: "Swaraj Patil",
        createdAt: "2026-04-20T09:15:00.000Z",
        updatedAt: "2026-04-20T09:15:00.000Z",
        readTime: "10 min",
        featured: false,
        content: `### Embracing Full-Duplex Web Client Interaction with WebSockets

REST operations follow basic request-reply timelines. For real-time applications like instant multi-user logs, dynamic charts, or live document shares, we establish direct two-way channels. This walk-through details wrapping Socket.io pipelines over basic Node Express instances.

#### Socket.io Server Architecture

Combine Express and standard Node HTTP servers to run concurrently inside a unified port bind:

\`\`\`javascript
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: "*" }
});

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('broadcast_message', (data) => {
    // Relay notification arrays to all active rooms on network
    io.emit('new_message_alert', data);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

httpServer.listen(3000);
\`\`\`

Implementing full duplex pipelines allows direct server integrations, updating dynamic resume checks and form submission reports as they arrive!`
      },
      {
        id: "blog_4",
        title: "ATS Resume Checker: Building AI-Powered Job Matching",
        slug: "ats-resume-checker-building-ai-powered-job-matching",
        excerpt: "An architectural guide to deploying text scanners, matching algorithms, and LLM rating frameworks.",
        category: "Project Walkthroughs",
        tags: ["Portfolio", "AI", "Job Matching", "MERN"],
        author: "Swaraj Patil",
        createdAt: "2026-03-12T16:00:00.000Z",
        updatedAt: "2026-03-12T16:00:00.000Z",
        readTime: "18 min",
        featured: true,
        content: `### Transforming Resume Profiles into Optimization Datagrams

Landing a software internship requires passing Applicant Tracking Systems (ATS). This detailed post details our custom portfolio utility analyzing resumes, highlighting target phrase inclusions, rating overall skill coverage, and generating actionable suggestions.

#### Inside the AI Rating Algorithm

The checker compares raw resume strings with provided job listings using a structured Gemini API call. The prompt converts text into clean JSON schema results handling:
- **Match Score**: 0 to 100 percentage.
- **Missing Skills**: List of libraries or methodologies missing from the resume.
- **Aesthetic Guidelines**: Formatting, typo detections, and action-verb improvements.

\`\`\`json
{
  "score": 75,
  "missingKeywords": ["Docker", "TypeScript", "Redis"],
  "parsingFeedback": "Replace passive verbs like 'helped building' with high-impact action declarations like 'Architected and deployed...'"
}
\`\`\`

This utility provides real developer feedback, allowing Pune students to polish applications dynamically.`
      },
      {
        id: "blog_5",
        title: "Redux Toolkit vs Context API: When to Use Each",
        slug: "redux-toolkit-vs-context-api-when-to-use-each",
        excerpt: "Understand when to use Redux Toolkit or Context API for state management in modern React apps.",
        category: "React Tips",
        tags: ["React", "Redux", "Context", "State Management"],
        author: "Swaraj Patil",
        createdAt: "2026-02-14T10:00:00.000Z",
        updatedAt: "2026-02-14T10:00:00.000Z",
        readTime: "8 min",
        featured: false,
        content: `### Navigating the Complexity of React State Management

React projects need efficient state management. Developers often debate between using Redux Toolkit (RTK) and the native Context API. This guide compares these approaches to help you choose the right pattern for your application.

#### Context API: Localized, Low-Friction State

The Context API is ideal for static or low-frequency updates, such as user themes, internationalization locales, or simple JWT login sessions.

- **Vibe:** Minimal, elegant, built into React.
- **Drawback:** Updates trigger re-renders across all nested consumers, which can impact performance in high-frequency data flows.

#### Redux Toolkit: Global, Scalable, Predictable

Redux Toolkit excels in complex tracking scenarios, such as managing a multi-step job board form, handling real-time WebSockets feeds, or orchestrating interactive dashboards with heavy state actions.

- **Vibe:** Robust, middleware-driven, highly optimized.
- **Drawback:** Requires boilerplates and introduces learning curves for smaller projects.`
      },
      {
        id: "blog_6",
        title: "Preparing for Technical Interviews as a Fresher",
        slug: "preparing-for-technical-interviews-as-a-fresher",
        excerpt: "A practical strategy for landing competitive software internships through rigorous portfolio building.",
        category: "Interview Prep",
        tags: ["Interviews", "Fresher", "Career", "Resume"],
        author: "Swaraj Patil",
        createdAt: "2026-01-05T09:00:00.000Z",
        updatedAt: "2026-01-05T09:00:00.000Z",
        readTime: "10 min",
        featured: false,
        content: `### Navigating Technical Internship Interviews

Landing full-stack roles as a student requires standing out from the crowd. Grounding your preparation in actual project execution creates an impressive presentation during technical evaluations.

#### Three pillars of interview preparation

1. **Portfolio Projects:** Build actual, functional production systems rather than basic, cloned interfaces. Be prepared to explain your architectural choices, database structures, and environment settings.
2. **Core DSA Concepts:** Practice common algorithmic questions (such as arrays, tree traversals, and dynamic hash lookups) using clean, readable TypeScript patterns.
3. **System Design Basics:** Learn how frontends and backends communicate, database caching principles, and secure JWT verification paths.`
      },
      {
        id: "blog_7",
        title: "Structuring Large Node.js APIs",
        slug: "structuring-large-node-js-apis",
        excerpt: "Discover modern architectural patterns, modular structures, and clean folder layouts for Node applications.",
        category: "Web Development",
        tags: ["Architecture", "Express", "Node.js", "Clean Code"],
        author: "Swaraj Patil",
        createdAt: "2025-10-12T08:30:00.000Z",
        updatedAt: "2025-10-12T08:30:00.000Z",
        readTime: "8 min",
        featured: false,
        content: `### Designing Highly Scalable Node.js Backends

Small Express experiments can fit into a single file. However, larger personal projects require modular layouts to remain maintainable. This visual walkthrough implements structured separation of concerns on server backends.

#### Scalable Architecture Layout

Organize your backend folder structures by domain/responsibility:

\`\`\`text
/server
  /models       <-- Define schemas
  /controllers  <-- Business logic handlers
  /routes       <-- HTTP path mappings
  /middleware   <-- JWT auth, error handles
  /data         <-- Local file databases
\`\`\`

Separating routing declarations from controller logic makes verifying individual components straightforward.`
      },
      {
        id: "blog_8",
        title: "Mastering React Custom Hooks",
        slug: "mastering-react-custom-hooks",
        excerpt: "Learn how to extract complex UI behaviors into clean, testable, and reusable custom React hooks.",
        category: "Web Development",
        tags: ["React", "Hooks", "Frontend", "Clean Code"],
        author: "Swaraj Patil",
        createdAt: "2025-09-28T14:00:00.000Z",
        updatedAt: "2025-09-28T14:00:00.000Z",
        readTime: "6 min",
        featured: false,
        content: `### Refactoring Component Logic into Reusable Hooks

React components should focus on rendering interfaces. Business logic, API communication, and state handlers are best extracted into reusable custom hooks. This guide creates modular React hooks to simplify your code.

#### Creating a Secure API Fetch Hook

Extract standard loading, state, and error handling behaviors into a single, clean hook:

\`\`\`jsx
import { useState, useEffect } from 'react';

export function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    fetch(url)
      .then(res => res.json())
      .then(result => {
        if (active) {
          setData(result);
          setLoading(false);
        }
      })
      .catch(err => {
        if (active) {
          setError(err);
          setLoading(false);
        }
      });
    return () => { active = false; };
  }, [url]);

  return { data, loading, error };
}
\`\`\``
      }
    ];

    // Seed 2 Sample Contact Submissions
    this.data.contacts = [
      {
        id: "contact_1",
        name: "Rohit Deshmukh",
        email: "rohit.deshmukh@tcs.local",
        message: "Hey Swaraj! Looking for full-stack React students in Pune for a 6-month developer internship starting next month. Your ATS Checker project looks outstanding!",
        createdAt: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
        status: "unread"
      },
      {
        id: "contact_2",
        name: "Anjali Gupta",
        email: "anjali@technovate.tech",
        message: "Hi Swaraj, would love to recruit you for a short contract or part-time internship building AI chatbots with Express and React. Excellent portfolio design!",
        createdAt: new Date(Date.now() - 120 * 3600 * 1000).toISOString(),
        status: "read"
      }
    ];

    this.save();
  }

  // Blog getters
  getBlogs() {
    return this.data.blogs;
  }

  getBlogById(id: string) {
    return this.data.blogs.find((b) => b.id === id);
  }

  getBlogBySlug(slug: string) {
    return this.data.blogs.find((b) => b.slug === slug);
  }

  createBlog(blogData: Omit<Blog, "id" | "createdAt" | "updatedAt">) {
    const id = "blog_" + Math.random().toString(36).substr(2, 9);
    const newBlog: Blog = {
      ...blogData,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.data.blogs.push(newBlog);
    this.save();
    return newBlog;
  }

  updateBlog(id: string, blogData: Partial<Omit<Blog, "id" | "createdAt" | "updatedAt">>) {
    const blogIndex = this.data.blogs.findIndex((b) => b.id === id);
    if (blogIndex === -1) return null;

    const updatedBlog: Blog = {
      ...this.data.blogs[blogIndex],
      ...blogData,
      updatedAt: new Date().toISOString()
    };
    this.data.blogs[blogIndex] = updatedBlog;
    this.save();
    return updatedBlog;
  }

  deleteBlog(id: string) {
    const initialLength = this.data.blogs.length;
    this.data.blogs = this.data.blogs.filter((b) => b.id !== id);
    if (this.data.blogs.length < initialLength) {
      this.save();
      return true;
    }
    return false;
  }

  // Project getters
  getProjects() {
    return this.data.projects;
  }

  getProjectById(id: string) {
    return this.data.projects.find((p) => p.id === id);
  }

  createProject(projectData: Omit<Project, "id" | "createdAt">) {
    const id = "proj_" + Math.random().toString(36).substr(2, 9);
    const newProject: Project = {
      ...projectData,
      id,
      createdAt: new Date().toISOString()
    };
    this.data.projects.push(newProject);
    this.save();
    return newProject;
  }

  updateProject(id: string, projectData: Partial<Omit<Project, "id" | "createdAt">>) {
    const projectIndex = this.data.projects.findIndex((p) => p.id === id);
    if (projectIndex === -1) return null;

    const updatedProject: Project = {
      ...this.data.projects[projectIndex],
      ...projectData
    };
    this.data.projects[projectIndex] = updatedProject;
    this.save();
    return updatedProject;
  }

  deleteProject(id: string) {
    const initialLength = this.data.projects.length;
    this.data.projects = this.data.projects.filter((p) => p.id !== id);
    if (this.data.projects.length < initialLength) {
      this.save();
      return true;
    }
    return false;
  }

  // User and Auth getters
  getUsers() {
    return this.data.users;
  }

  getUserByEmail(email: string) {
    return this.data.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  createUser(userData: Omit<User, "id" | "createdAt">) {
    const id = "usr_" + Math.random().toString(36).substr(2, 9);
    const newUser: User = {
      ...userData,
      id,
      createdAt: new Date().toISOString()
    };
    this.data.users.push(newUser);
    this.save();
    return newUser;
  }

  // Contact getters
  getContacts() {
    return this.data.contacts;
  }

  createContact(contactData: Omit<Contact, "id" | "createdAt" | "status">) {
    const id = "contact_" + Math.random().toString(36).substr(2, 9);
    const newContact: Contact = {
      ...contactData,
      id,
      status: "unread",
      createdAt: new Date().toISOString()
    };
    this.data.contacts.push(newContact);
    this.save();
    return newContact;
  }

  updateContactStatus(id: string, status: "unread" | "read" | "replied") {
    const contact = this.data.contacts.find((c) => c.id === id);
    if (!contact) return null;
    contact.status = status;
    this.save();
    return contact;
  }

  // Newsletter
  getNewsletterEmails() {
    return this.data.newsletters;
  }

  addNewsletterEmail(email: string) {
    const normalizedEmail = email.trim().toLowerCase();
    const exists = this.data.newsletters.some((n) => n.email === normalizedEmail);
    if (exists) return { email: normalizedEmail, status: "already_subscribed" };

    const newSub = {
      id: "news_" + Math.random().toString(36).substr(2, 9),
      email: normalizedEmail,
      createdAt: new Date().toISOString()
    };

    this.data.newsletters.push(newSub);
    this.save();
    return { email: normalizedEmail, status: "success" };
  }
}

export const db = new LocalDB();
