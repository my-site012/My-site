"use client";

import { useEffect } from "react";

export default function SecurityProvider() {
  useEffect(() => {
    // Only run in production to avoid blocking developer workflows in local dev
    if (process.env.NODE_ENV === "development") return;

    // 1. Disable Right Click
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    // 2. Disable standard inspection shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      // F12
      if (e.key === "F12") {
        e.preventDefault();
        return false;
      }

      // Ctrl+Shift+I / Ctrl+Shift+J / Ctrl+Shift+C (Developer tools)
      if (
        e.ctrlKey &&
        e.shiftKey &&
        (e.key === "I" || e.key === "i" || e.key === "J" || e.key === "j" || e.key === "C" || e.key === "c")
      ) {
        e.preventDefault();
        return false;
      }

      // Ctrl+U (View Source)
      if (e.ctrlKey && (e.key === "U" || e.key === "u")) {
        e.preventDefault();
        return false;
      }

      // Ctrl+S (Save Page)
      if (e.ctrlKey && (e.key === "S" || e.key === "s")) {
        e.preventDefault();
        return false;
      }
    };

    // 3. Simple console loop to deter tools opening (debug-trap)
    const trapDebugger = () => {
      try {
        (function anonymous() {
          // eslint-disable-next-line no-debugger
          debugger;
        })();
      } catch (err) {
        // ignore
      }
    };

    const interval = setInterval(trapDebugger, 1000);

    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      clearInterval(interval);
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return null;
}
