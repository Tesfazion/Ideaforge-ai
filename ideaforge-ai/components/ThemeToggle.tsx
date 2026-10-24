"use client";

import { useEffect } from "react";
import { setTheme, useIsDarkTheme } from "@/lib/theme";

export default function ThemeToggle() {
  // The server snapshot keeps the first client render stable; stored preference follows hydration.
  const dark = useIsDarkTheme();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    document.documentElement.classList.toggle("light", !dark);
    document.documentElement.dataset.theme = dark ? "dark" : "light";
  }, [dark]);

  function toggle() {
    setTheme(!dark);
  }

  return <button type="button" onClick={toggle} aria-label={`Switch to ${dark ? "light" : "dark"} mode`} title={`Switch to ${dark ? "light" : "dark"} mode`} className="theme-toggle">
    {dark ? (
      <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4"><circle cx="12" cy="12" r="4" /><path strokeLinecap="round" d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42" /></svg>
    ) : (
      <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4"><path strokeLinecap="round" strokeLinejoin="round" d="M20.3 15.3A8.5 8.5 0 018.7 3.7 8.5 8.5 0 1020.3 15.3z" /></svg>
    )}<span>{dark ? "Light" : "Dark"}</span>
  </button>;
}
