import express from "express";
import path from "path";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import { db } from "./server/db";

// Use lazy initialization for the Gemini API Client to prevent startup errors or build key requirements
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is required");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

const JWT_SECRET = process.env.JWT_SECRET || "swaraj_developer_secret_key_2026_brand";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Body parsers
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Add simple request logger for status checks
  app.use((req, _res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
  });

  // Admin Verification Middleware
  const verifyAdmin = (req: any, res: any, next: any) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Access denied. Token missing or malformed." });
    }
    const token = authHeader.split(" ")[1];
    try {
      const decoded: any = jwt.verify(token, JWT_SECRET);
      if (decoded.role !== "admin") {
        return res.status(403).json({ error: "Forbidden. Admin clearance required." });
      }
      req.user = decoded;
      next();
    } catch (err) {
      return res.status(401).json({ error: "Invalid or expired session token." });
    }
  };

  /* ==========================================================================
     AUTHENTICATION ENDPOINTS
     ========================================================================== */

  // POST /api/auth/login - authenticate user and return JWT
  app.post("/api/auth/login", (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required." });
      }

      const user = db.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ error: "Invalid email or password credentials." });
      }

      const isMatch = bcrypt.compareSync(password, user.passwordHash);
      if (!isMatch) {
        return res.status(401).json({ error: "Invalid email or password credentials." });
      }

      // Sign JWT
      const token = jwt.sign(
        {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        JWT_SECRET,
        { expiresIn: "7d" }
      );

      return res.json({
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } catch (err: any) {
      return res.status(500).json({ error: err.message || "Authentication failed." });
    }
  });

  // GET /api/auth/me - check token and return user details
  app.get("/api/auth/me", (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const token = authHeader.split(" ")[1];
    try {
      const decoded: any = jwt.verify(token, JWT_SECRET);
      const user = db.getUsers().find(u => u.email === decoded.email);
      if (!user) return res.status(404).json({ error: "User not found" });

      return res.json({
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        }
      });
    } catch (err) {
      return res.status(401).json({ error: "Session expired" });
    }
  });

  /* ==========================================================================
     BLOG ENDPOINTS
     ========================================================================== */

  // GET /api/blogs - Fetch all blogs (public)
  app.get("/api/blogs", (_req, res) => {
    try {
      const blogs = db.getBlogs();
      // Sort: newest first
      const sorted = [...blogs].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      return res.json(sorted);
    } catch (err: any) {
      return res.status(500).json({ error: "Failed to retrieve blog listings." });
    }
  });

  // GET /api/blogs/:idOrSlug - Fetch single blog details (public)
  app.get("/api/blogs/:idOrSlug", (req, res) => {
    try {
      const { idOrSlug } = req.params;
      let blog = db.getBlogById(idOrSlug);
      if (!blog) {
        blog = db.getBlogBySlug(idOrSlug);
      }

      if (!blog) {
        return res.status(404).json({ error: "Requested blog article could not be located." });
      }

      return res.json(blog);
    } catch (err: any) {
      return res.status(500).json({ error: "Failed to retrieve the blog post." });
    }
  });

  // POST /api/blogs - Create new blog (admin only)
  app.post("/api/blogs", verifyAdmin, (req, res) => {
    try {
      const { title, content, excerpt, category, tags, readTime, featured } = req.body;
      if (!title || !content || !excerpt || !category) {
        return res.status(400).json({ error: "Missing required fields: title, content, excerpt, category." });
      }

      // Generate slug automatically
      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");

      const newBlog = db.createBlog({
        title,
        slug,
        content,
        excerpt,
        category,
        tags: Array.isArray(tags) ? tags : [],
        author: "Swaraj Patil",
        readTime: readTime || "5 min",
        featured: !!featured,
      });

      return res.status(201).json(newBlog);
    } catch (err: any) {
      return res.status(500).json({ error: "Failed to create blog post." });
    }
  });

  // PUT /api/blogs/:id - Update blog article (admin only)
  app.put("/api/blogs/:id", verifyAdmin, (req, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;

      if (updateData.title) {
        updateData.slug = updateData.title
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, "")
          .replace(/\s+/g, "-")
          .replace(/-+/g, "-");
      }

      const updated = db.updateBlog(id, updateData);
      if (!updated) {
        return res.status(404).json({ error: "Blog article not found to update." });
      }

      return res.json(updated);
    } catch (err: any) {
      return res.status(500).json({ error: "Failed to modify the blog article." });
    }
  });

  // DELETE /api/blogs/:id - Delete blog article (admin only)
  app.delete("/api/blogs/:id", verifyAdmin, (req, res) => {
    try {
      const { id } = req.params;
      const success = db.deleteBlog(id);
      if (!success) {
        return res.status(404).json({ error: "Blog article not found to delete." });
      }
      return res.json({ message: "Blog post deleted successfully." });
    } catch (err: any) {
      return res.status(500).json({ error: "Failed to delete target blog." });
    }
  });

  /* ==========================================================================
     PROJECT ENDPOINTS
     ========================================================================== */

  // GET /api/projects - Retrieve list of projects (public)
  app.get("/api/projects", (_req, res) => {
    try {
      const projects = db.getProjects();
      const sorted = [...projects].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      return res.json(sorted);
    } catch (err: any) {
      return res.status(500).json({ error: "Failed to load projects." });
    }
  });

  // POST /api/projects - Create new portfolio project (admin only)
  app.post("/api/projects", verifyAdmin, (req, res) => {
    try {
      const { title, description, shortDesc, image, githubUrl, liveUrl, techStack, category, featured } = req.body;
      if (!title || !description || !shortDesc || !category) {
        return res.status(400).json({ error: "Required project info is missing." });
      }

      const newProj = db.createProject({
        title,
        description,
        shortDesc,
        image: image || "https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=600&auto=format&fit=crop",
        githubUrl: githubUrl || "https://github.com/swarajpatil",
        liveUrl: liveUrl || "",
        techStack: Array.isArray(techStack) ? techStack : [],
        category,
        featured: !!featured,
      });

      return res.status(201).json(newProj);
    } catch (err: any) {
      return res.status(500).json({ error: "Failed to create project." });
    }
  });

  // PUT /api/projects/:id - Update portfolio project (admin only)
  app.put("/api/projects/:id", verifyAdmin, (req, res) => {
    try {
      const { id } = req.params;
      const updated = db.updateProject(id, req.body);
      if (!updated) {
        return res.status(404).json({ error: "Project could not be found to edit." });
      }
      return res.json(updated);
    } catch (err: any) {
      return res.status(500).json({ error: "Failed to modify project parameters." });
    }
  });

  // DELETE /api/projects/:id - Delete project (admin only)
  app.delete("/api/projects/:id", verifyAdmin, (req, res) => {
    try {
      const { id } = req.params;
      const success = db.deleteProject(id);
      if (!success) {
        return res.status(404).json({ error: "Project could not be found to delete." });
      }
      return res.json({ message: "Project deleted successfully." });
    } catch (err: any) {
      return res.status(500).json({ error: "Failed to delete project item." });
    }
  });

  /* ==========================================================================
     CONTACT MESSAGES ENDPOINTS
     ========================================================================== */

  // POST /api/contacts - Submit contact message from public form
  app.post("/api/contacts", (req, res) => {
    try {
      const { name, email, message } = req.body;
      if (!name || !email || !message) {
        return res.status(400).json({ error: "Please input your name, email, and description message." });
      }

      const submission = db.createContact({ name, email, message });
      return res.status(201).json({
        message: "Your message has been delivered to Swaraj successfully! Thank you.",
        submission,
      });
    } catch (err: any) {
      return res.status(500).json({ error: "Failed to record message submission." });
    }
  });

  // GET /api/contacts - Retrieve message submissions (admin only)
  app.get("/api/contacts", verifyAdmin, (_req, res) => {
    try {
      const contacts = db.getContacts();
      const sorted = [...contacts].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      return res.json(sorted);
    } catch (err: any) {
      return res.status(500).json({ error: "Retrieval rejected." });
    }
  });

  // PATCH /api/contacts/:id - Set reading/reply flag status of submission (admin only)
  app.patch("/api/contacts/:id", verifyAdmin, (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      if (!status || !["unread", "read", "replied"].includes(status)) {
        return res.status(400).json({ error: "Invalid status parameters." });
      }

      const updated = db.updateContactStatus(id, status);
      if (!updated) {
        return res.status(404).json({ error: "Target contact submission not found." });
      }

      return res.json(updated);
    } catch (err: any) {
      return res.status(500).json({ error: "Failed to update contact state." });
    }
  });

  /* ==========================================================================
     NEWSLETTER ENDPOINTS
     ========================================================================== */

  // POST /api/newsletters - Submit newsletter email capture (public)
  app.post("/api/newsletters", (req, res) => {
    try {
      const { email } = req.body;
      if (!email || !email.includes("@")) {
        return res.status(400).json({ error: "Please submit a valid email address." });
      }

      const outcome = db.addNewsletterEmail(email);
      if (outcome.status === "already_subscribed") {
        return res.json({ message: "You are already registered on our newsletter list!" });
      }

      return res.status(201).json({
        message: "Successfully joined Swaraj's newsletter alerts!",
        email: outcome.email,
      });
    } catch (err: any) {
      return res.status(500).json({ error: "Failed to subscribe email." });
    }
  });

  // GET /api/newsletters - Fetch newsletter list (admin only)
  app.get("/api/newsletters", verifyAdmin, (_req, res) => {
    try {
      const subs = db.getNewsletterEmails();
      return res.json(subs);
    } catch (err) {
      return res.status(500).json({ error: "Access failed." });
    }
  });

  /* ==========================================================================
     GEMINI CHAT ASSISTANT ENDPOINT
     ========================================================================== */

  // POST /api/chat - Swaraj's Interactive Portfolio/Resume Coach Assistant (Gemini API)
  app.post("/api/chat", async (req, res) => {
    try {
      const { messages } = req.body;
      if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: "A sequence of conversation messages array is required." });
      }

      // Check if GEMINI_API_KEY environment helper exists (handle missing gracefully)
      if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "MY_GEMINI_API_KEY") {
        return res.json({
          text: "Swaraj's AI Coach is running in simulation mode because the GEMINI_API_KEY secret is not configured yet. Set it in the Secrets panel on AI Studio to enable live responses! Here is a supportive system hint: Swaraj Patil specializes in modern React, Express.js, TypeScript development, and goes to PICT, Pune. He's actively hunting for summer web internships!",
        });
      }

      // Build system instruction with Swaraj's personal details and portfolio context
      const systemInstruction = `You are Swaraj's AI Portfolio Assistant & Resume Coach. Your mission is to represent Swaraj Patil and help visitors understand his work, skills, and experience, while providing expert resume coaching to other students based on Swaraj's excellent track record.

ABOUT SWARAJ PATIL:
- Bio: Swaraj Patil is a highly motivated Bachelor of Technology (B.Tech) Electronics and Telecommunication Engineering student at Sant Gajanan Maharaj College of Engineering, Maharashtra, India. He is actively seeking a full-stack development internship.
- Focus: Full-stack MERN stack, TypeScript services, and generative AI APIs integration. He loves building functional interactive products.
- Tech Stack Skills:
  * Languages: JavaScript (ES6+), TypeScript, Java, SQL, C++
  * Frontend: ReactJS, Next.js, HTML5, CSS3, Tailwind CSS
  * Backend: Node.js, Express.js, REST API Development
  * Database: MongoDB, Mongoose ODM
  * Tools & Platforms: Git, GitHub, VS Code, Postman, Vercel, Railway
  * Core Concepts: JWT Authentication, CRUD Operations, Third-Party API Integration, Responsive Web Design, Real-Time Features, MVC Architecture
- Projects:
  1. AI ATS Resume Checker: AI compatibility scanner using LLM reasoning (React, Node, Express, MongoDB, Tailwind)
  2. MERN Job Portal: Job board role hunter (MERN, JWT, Mongo)
  3. Password Manager: Local crypto credential safe (HTML5, CSS3, JS)
  4. Movie Search Web App: Movie discovery platform with REST API fetches (HTML5, CSS3, JS)

COACHING DIRECTIONS:
- Welcome the visitor! Act as a professional, polite, and enthusiastic portfolio spokesperson.
- If they ask about Swaraj's hiring availability, encourage them to submit the Contact form or email Swaraj, and proudly summarize his credentials!
- If the visitor wants resume coaching, use Swaraj's details to evaluate their ideas or give professional advice on how to build high-impact projects (just like Swaraj's portfolio) to beat ATS, add metrics, and list core technologies.
- Keep responses friendly, structured in markdown, concise, and focused on Swaraj's strengths. Do not hallucinate contact info outside "pilly2702@gmail.com", LinkedIn (https://www.linkedin.com/in/swaraj-patil-a9b477376/), GitHub (https://github.com/Swarajp-ops), or Swaraj's live resume.`;

      // Translate chat history into content format required by GoogleGenAI SDK
      // Using 'gemini-3.5-flash' model for text chat dialog as instructed in SKILL.md
      const chatMessages = messages.map((m: any) => ({
        role: m.role === "user" ? "user" : "model",
        parts: [{ text: m.content }],
      }));

      const modelName = "gemini-3.5-flash";
      const response = await getGeminiClient().models.generateContent({
        model: modelName,
        contents: chatMessages,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      const responseText = response.text || "I was unable to synthesize a response. Let me consult my training!";
      return res.json({ text: responseText });
    } catch (err: any) {
      console.error("Gemini Assistant Failure:", err);
      return res.status(500).json({ error: "Swaraj's Assistant had an issue connecting to Gemini. Please try again!" });
    }
  });

  /* ==========================================================================
     DEV VS PRODUCTION STATIC ASSET ROUTING
     ========================================================================== */

  if (process.env.NODE_ENV !== "production") {
    // Mount Vite dev server middleware
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Vite Development Middleware loaded successfully.");
  } else {
    // Serve static files in production from dist
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log("Static files directory loaded for production routing.");
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`=============================================================`);
    console.log(` Swaraj Patil's MERN Stack Blog Server running at http://0.0.0.0:${PORT}`);
    console.log(` Run mode: ${process.env.NODE_ENV || "development"}`);
    console.log(`=============================================================`);
  });
}

startServer().catch((error) => {
  console.error("Startup server failed critical crash:", error);
});
