import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Bot, Sparkles, Loader2, ArrowRight } from "lucide-react";
import { ApiClient } from "../api";
import { ChatMessage } from "../types";

export const AIChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "👋 Hi! I'm Swaraj's AI Portfolio Assistant & Resume Coach. I'm trained on Swaraj's real-world resume, experiences, and technical blog posts.\n\nHow can I support you today? You can ask me about his project architectures, school credentials, or even ask me for feedback on your own student resume!",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestionChips = [
    { text: "What projects did Swaraj build?", type: "projects" },
    { text: "Is Swaraj hiring ready?", type: "internships" },
    { text: "Review my resume description", type: "coaching" },
  ];

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text) return;

    if (!textToSend) {
      setInputText("");
    }

    // Add user message
    const userMsg: ChatMessage = {
      id: "msg_" + Math.random().toString(36).substr(2, 9),
      role: "user",
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      // Fetch response using ApiClient API proxy
      const apiMessages = [...messages, userMsg].map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await ApiClient.askAICoach(apiMessages);
      
      const assistantMsg: ChatMessage = {
        id: "msg_" + Math.random().toString(36).substr(2, 9),
        role: "assistant",
        content: res.text,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: "error_" + Math.random().toString(36).substr(2, 9),
        role: "assistant",
        content: "Oops! I encountered an issue connecting to Swaraj's backend APIs. Please verify your internet connection or reload the preview container!",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 no-print flex flex-col items-end">
      
      {/* Expanded Chat Box overlay */}
      {isOpen && (
        <div 
          id="ai-chatbot-window" 
          className="w-[90vw] sm:w-[400px] h-[550px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-2xl flex flex-col overflow-hidden shadow-2xl animate-fade-in mb-4"
        >
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-teal-500 to-sky-500 text-white flex items-center justify-between shadow-md">
            <div className="flex items-center gap-2.5">
              <div className="bg-white/10 p-1.5 rounded-lg backdrop-blur">
                <Bot className="h-4.5 w-4.5 text-white" />
              </div>
              <div>
                <h3 className="font-heading font-extrabold text-sm tracking-tight leading-none">
                  Swaraj's AI Coach
                </h3>
                <span className="text-[10px] opacity-80 flex items-center gap-1 font-mono tracking-wider mt-1 uppercase">
                  <Sparkles className="h-2.5 w-2.5 antialiased text-amber-300" />
                  <span>Powered by Gemini 3.5</span>
                </span>
              </div>
            </div>
            
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition"
              aria-label="Collapse chatbot"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Conversation Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-slate-950/20">
            {messages.map((m) => {
              const isUser = m.role === "user";
              return (
                <div key={m.id} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[85%] rounded-2xl p-3 text-sm shadow-sm leading-relaxed ${
                    isUser
                      ? "bg-teal-500 text-white rounded-br-none"
                      : "bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200/50 dark:border-slate-800/40 rounded-bl-none whitespace-pre-wrap"
                  }`}>
                    {m.content}
                    <div className={`text-[9px] mt-1.5 opacity-60 text-right font-mono ${
                      isUser ? "text-white/85" : "text-slate-400 dark:text-slate-500"
                    }`}>
                      {m.timestamp}
                    </div>
                  </div>
                </div>
              );
            })}
            
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white dark:bg-slate-800 border border-slate-200/55 dark:border-slate-800/55 rounded-2xl rounded-bl-none p-3 shadow-sm flex items-center gap-2">
                  <Loader2 className="h-4 w-4 text-teal-500 animate-spin" />
                  <span className="text-xs text-slate-400 dark:text-slate-500 font-mono">Assistant is thinking...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Prompt suggestions wrapper */}
          <div className="px-4 py-2 bg-slate-50 dark:bg-slate-950/20 border-t border-slate-100 dark:border-slate-850 flex flex-wrap gap-1.5">
            {suggestionChips.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(chip.text)}
                disabled={loading}
                className="text-[11px] font-medium px-2.5 py-1.5 bg-white dark:bg-slate-800 hover:bg-teal-50 dark:hover:bg-slate-700/70 text-slate-600 dark:text-slate-300 rounded-xl border border-slate-200/40 dark:border-slate-700/40 shadow-xs flex items-center gap-1 transition-all active:scale-95 disabled:opacity-50"
              >
                <span>{chip.text}</span>
                <ArrowRight className="h-3 w-3 text-slate-400" />
              </button>
            ))}
          </div>

          {/* Form input controls */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 border-t border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900 flex gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask me something..."
              disabled={loading}
              className="flex-1 px-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800/80 rounded-xl text-sm text-slate-800 dark:text-slate-100 placeholder-slate-450 focus:outline-none focus:border-teal-500 disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={loading || !inputText.trim()}
              className="p-2.5 bg-teal-500 hover:bg-teal-600 active:scale-95 text-white rounded-xl shadow-md transition disabled:opacity-40"
              aria-label="Send message"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}

      {/* Floating launcher trigger circle bubble */}
      <button
        id="ai-chatbot-trigger"
        onClick={() => setIsOpen(!isOpen)}
        className={`p-4 rounded-full text-white shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 bg-gradient-to-r ${
          isOpen
            ? "from-slate-700 to-slate-800"
            : "from-teal-500 to-sky-500 shadow-teal-500/10 hover:shadow-teal-500/20"
        } transition-all duration-300 group`}
        aria-label="Open portfolio companion chatbot"
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageSquare className="h-6 w-6 group-hover:rotate-6 transition-transform" />}
      </button>

    </div>
  );
};
