import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
<<<<<<< HEAD

// Production error handlers - minimal logging
window.addEventListener("error", (event) => {
  // In production, errors should be sent to error tracking service
  // console.error("[Global Error]", event.error);
});

window.addEventListener("unhandledrejection", (event) => {
  // In production, errors should be sent to error tracking service
  // console.error("[Unhandled Promise Rejection]", event.reason);
});

// Root component
function RootApp() {
  return <App />;
}

// Root creation with error handling
try {
  const container = document.getElementById("root");
  if (!container) {
    throw new Error("Root container not found");
  }

  const root = createRoot(container);
  root.render(<RootApp />);
} catch (error) {
  // Fallback UI for critical errors
  document.body.innerHTML = `
    <div style="display:flex;align-items:center;justify-content:center;min-height:100vh;background:#0d0d0d;color:#f8f9fa;font-family:system-ui,sans-serif;">
      <div style="text-align:center;padding:2rem;">
        <h1 style="font-size:2rem;margin-bottom:1rem;">Application Error</h1>
        <p style="margin-bottom:1rem;">Failed to initialize the application.</p>
        <button 
          onclick="location.reload()" 
          style="margin-top:1rem;padding:0.5rem 1rem;background:#f8f9fa;color:#0d0d0d;border:none;border-radius:4px;cursor:pointer;">
          Reload Page
        </button>
      </div>
    </div>
  `;
}
=======
import { ErrorBoundary } from "./components/ErrorBoundary";

// Global error handlers for debugging
window.addEventListener("error", (event) => {
  console.error("[Global Error]", event.error);
});

window.addEventListener("unhandledrejection", (event) => {
  console.error("[Unhandled Promise Rejection]", event.reason);
});

createRoot(document.getElementById("root")!).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
