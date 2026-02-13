import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { DiagnosticOverlay } from "./components/DiagnosticOverlay";
import { useState, useEffect } from "react";

// Enhanced global error handlers
window.addEventListener("error", (event) => {
  console.error("[Global Error]", event.error);
  console.error("[Error Location]", event.filename, event.lineno, event.colno);
});

window.addEventListener("unhandledrejection", (event) => {
  console.error("[Unhandled Promise Rejection]", event.reason);
});

// Root component with diagnostics
function RootApp() {
  console.log("[Main] RootApp rendering");
  
  return (
    <div>
      <App />
    </div>
  );
}

// Enhanced root creation with error handling
try {
  const container = document.getElementById("root");
  if (!container) {
    throw new Error("Root container not found");
  }

  const root = createRoot(container);
  root.render(<RootApp />);
  
  console.log("[App] React root created successfully");
} catch (error) {
  console.error("[App] Failed to initialize:", error);
  
  // Fallback UI
  document.body.innerHTML = `
    <div style="display:flex;align-items:center;justify-content:center;min-height:100vh;background:#0d0d0d;color:#f8f9fa;font-family:system-ui,sans-serif;">
      <div style="text-align:center;padding:2rem;">
        <h1 style="font-size:2rem;margin-bottom:1rem;">Application Error</h1>
        <p style="margin-bottom:1rem;">Failed to initialize the application.</p>
        <p style="font-size:0.9rem;color:#adb5bd;">Check the console for details.</p>
        <button 
          onclick="location.reload()" 
          style="margin-top:1rem;padding:0.5rem 1rem;background:#f8f9fa;color:#0d0d0d;border:none;border-radius:4px;cursor:pointer;">
          Reload Page
        </button>
      </div>
    </div>
  `;
}
