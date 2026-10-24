"use client";

import { useSyncExternalStore } from "react";

const THEME_CHANGE_EVENT = "ideaforge:theme-change";

export function subscribeToTheme(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(THEME_CHANGE_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(THEME_CHANGE_EVENT, onChange);
  };
}

function getThemeSnapshot() {
  try {
    const savedTheme = localStorage.getItem("ideaforge-theme");
    if (savedTheme) return savedTheme !== "light";
  } catch {
    // Fall back to the theme already applied to the document.
  }
  return document.documentElement.classList.contains("dark");
}

function getServerThemeSnapshot() {
  return true;
}

export function useIsDarkTheme() {
  return useSyncExternalStore(subscribeToTheme, getThemeSnapshot, getServerThemeSnapshot);
}

export function useChartTheme() {
  const isDark = useIsDarkTheme();
  return isDark
    ? { grid: "#475569", axis: "#94a3b8", tooltip: "#1e293b", tooltipBorder: "#334155", text: "#f1f5f9" }
    : { grid: "#dce5ed", axis: "#64748b", tooltip: "#ffffff", tooltipBorder: "#cbd5e1", text: "#172033" };
}

export function setTheme(dark: boolean) {
  document.documentElement.classList.toggle("dark", dark);
  document.documentElement.classList.toggle("light", !dark);
  document.documentElement.dataset.theme = dark ? "dark" : "light";

  try {
    localStorage.setItem("ideaforge-theme", dark ? "dark" : "light");
  } catch {
    // Keep the current session responsive when persistent storage is unavailable.
  }

  window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
}
