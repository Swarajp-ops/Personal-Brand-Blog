import React, { createContext, useContext, useEffect, useState } from "react";

interface RouterContextType {
  path: string;
  navigate: (toPath: string) => void;
}

const RouterContext = createContext<RouterContextType | undefined>(undefined);

export const RouterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [path, setPath] = useState(() => {
    // Read clean URL pathname or default to "/"
    return window.location.pathname || "/";
  });

  useEffect(() => {
    const handlePopState = () => {
      setPath(window.location.pathname || "/");
    };

    // Register popstate listener for back/forward clicks
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const navigate = (toPath: string) => {
    if (window.location.pathname === toPath) return;
    
    window.history.pushState(null, "", toPath);
    setPath(toPath);
    // Scroll to top of window on page changes
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <RouterContext.Provider value={{ path, navigate }}>
      {children}
    </RouterContext.Provider>
  );
};

export const useRouter = () => {
  const context = useContext(RouterContext);
  if (!context) {
    throw new Error("useRouter must be consumed inside a RouterProvider");
  }
  return context;
};

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  to: string;
  children: React.ReactNode;
}

export const Link: React.FC<LinkProps> = ({ to, children, className, ...props }) => {
  const { navigate } = useRouter();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    navigate(to);
  };

  return (
    <a href={to} onClick={handleClick} className={className} {...props}>
      {children}
    </a>
  );
};
