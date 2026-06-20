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
  role: "admin" | "user";
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

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}
