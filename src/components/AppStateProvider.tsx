"use client";

import { createContext, useContext, useState, useEffect } from "react";
import dynamic from "next/dynamic";

const LoadingScreen = dynamic(() => import("@/components/LoadingScreen"), {
  ssr: false,
});

type AppState = {
  hasLoaded: boolean;
};

const AppStateContext = createContext<AppState>({ hasLoaded: false });

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const navEntries = window.performance.getEntriesByType("navigation") as PerformanceNavigationTiming[];
      const isReload = navEntries.length > 0 && navEntries[0].type === "reload";

      if (isReload) {
        // If the user explicitly reloaded the page (F5/Cmd+R), clear the memory so loading screen shows again
        sessionStorage.removeItem("app_hasLoaded");
      } else if (sessionStorage.getItem("app_hasLoaded")) {
        // Otherwise, if it's a soft navigation or returning from another tab, skip loading
        setHasLoaded(true);
      }
    }
  }, []);

  const handleDone = () => {
    sessionStorage.setItem("app_hasLoaded", "true");
    setHasLoaded(true);
  };

  return (
    <AppStateContext.Provider value={{ hasLoaded }}>
      {!hasLoaded && <LoadingScreen onDone={handleDone} />}
      {children}
    </AppStateContext.Provider>
  );
}

export const useAppState = () => useContext(AppStateContext);
