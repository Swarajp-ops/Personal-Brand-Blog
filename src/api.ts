import { Blog, Project, Contact, Newsletter } from "./types";

const BASE_URL = ""; // Relative paths will proxy to port 3000

export class ApiClient {
  private static getToken(): string | null {
    return localStorage.getItem("swaraj_admin_token");
  }

  public static setToken(token: string) {
    localStorage.setItem("swaraj_admin_token", token);
  }

  public static clearToken() {
    localStorage.removeItem("swaraj_admin_token");
  }

  private static getHeaders(contentType: string = "application/json"): HeadersInit {
    const headers: HeadersInit = {};
    if (contentType) {
      headers["Content-Type"] = contentType;
    }
    const token = this.getToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    return headers;
  }

  // Auth Api handlers
  public static async login(email: string, password: string) {
    const res = await fetch(`${BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || "Login credentials rejected.");
    }
    return res.json();
  }

  public static async getMe() {
    const res = await fetch(`${BASE_URL}/api/auth/me`, {
      method: "GET",
      headers: this.getHeaders(),
    });
    if (!res.ok) {
      this.clearToken();
      throw new Error("Session expired.");
    }
    return res.json();
  }

  // Blog Api handlers
  public static async getBlogs(): Promise<Blog[]> {
    const res = await fetch(`${BASE_URL}/api/blogs`);
    if (!res.ok) throw new Error("Failed to load blogs.");
    return res.json();
  }

  public static async getBlog(idOrSlug: string): Promise<Blog> {
    const res = await fetch(`${BASE_URL}/api/blogs/${encodeURIComponent(idOrSlug)}`);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || "Blog post not found.");
    }
    return res.json();
  }

  public static async createBlog(blogData: Partial<Blog>): Promise<Blog> {
    const res = await fetch(`${BASE_URL}/api/blogs`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify(blogData),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || "Failed to create blog post.");
    }
    return res.json();
  }

  public static async updateBlog(id: string, blogData: Partial<Blog>): Promise<Blog> {
    const res = await fetch(`${BASE_URL}/api/blogs/${encodeURIComponent(id)}`, {
      method: "PUT",
      headers: this.getHeaders(),
      body: JSON.stringify(blogData),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || "Failed to update blog.");
    }
    return res.json();
  }

  public static async deleteBlog(id: string): Promise<void> {
    const res = await fetch(`${BASE_URL}/api/blogs/${encodeURIComponent(id)}`, {
      method: "DELETE",
      headers: this.getHeaders(),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || "Failed to delete blog.");
    }
  }

  // Project Api handlers
  public static async getProjects(): Promise<Project[]> {
    const res = await fetch(`${BASE_URL}/api/projects`);
    if (!res.ok) throw new Error("Failed to load projects.");
    return res.json();
  }

  public static async createProject(projectData: Partial<Project>): Promise<Project> {
    const res = await fetch(`${BASE_URL}/api/projects`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify(projectData),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || "Failed to compile project creation.");
    }
    return res.json();
  }

  public static async updateProject(id: string, projectData: Partial<Project>): Promise<Project> {
    const res = await fetch(`${BASE_URL}/api/projects/${encodeURIComponent(id)}`, {
      method: "PUT",
      headers: this.getHeaders(),
      body: JSON.stringify(projectData),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || "Failed to edit project parameters.");
    }
    return res.json();
  }

  public static async deleteProject(id: string): Promise<void> {
    const res = await fetch(`${BASE_URL}/api/projects/${encodeURIComponent(id)}`, {
      method: "DELETE",
      headers: this.getHeaders(),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || "Failed to delete project.");
    }
  }

  // Contacts handlers
  public static async submitContact(name: string, email: string, message: string): Promise<any> {
    const res = await fetch(`${BASE_URL}/api/contacts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, message }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to submit message details.");
    return data;
  }

  public static async getContacts(): Promise<Contact[]> {
    const res = await fetch(`${BASE_URL}/api/contacts`, {
      method: "GET",
      headers: this.getHeaders(),
    });
    if (!res.ok) throw new Error("Failed to retrieve client messages.");
    return res.json();
  }

  public static async updateContactStatus(id: string, status: "unread" | "read" | "replied"): Promise<Contact> {
    const res = await fetch(`${BASE_URL}/api/contacts/${encodeURIComponent(id)}`, {
      method: "PATCH",
      headers: this.getHeaders(),
      body: JSON.stringify({ status }),
    });
    if (!res.ok) throw new Error("Failed to alter message status flags.");
    return res.json();
  }

  // Newsletter handlers
  public static async subscribeNewsletter(email: string): Promise<any> {
    const res = await fetch(`${BASE_URL}/api/newsletters`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Subscription failure.");
    return data;
  }

  public static async getNewsletters(): Promise<Newsletter[]> {
    const res = await fetch(`${BASE_URL}/api/newsletters`, {
      method: "GET",
      headers: this.getHeaders(),
    });
    if (!res.ok) throw new Error("Could not download newsletter addresses.");
    return res.json();
  }

  // AI Chat integration
  public static async askAICoach(messages: { role: "user" | "assistant"; content: string }[]): Promise<any> {
    const res = await fetch(`${BASE_URL}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || "Chat companion response error.");
    }
    return res.json();
  }
}
