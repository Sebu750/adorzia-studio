import { createRoot } from "react-dom/client";
import React from "react";

// Simple test component
const TestApp = () => {
  return (
    <div style={{ 
      padding: '50px', 
      backgroundColor: '#f0f8ff',
      textAlign: 'center',
      fontSize: '24px',
      fontFamily: 'Arial, sans-serif',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <h1 style={{ color: '#333', marginBottom: '20px' }}>Adorzia Test</h1>
      <p style={{ color: '#666' }}>If you can see this, React is working!</p>
      <div style={{ marginTop: '20px', fontSize: '16px', color: '#888' }}>
        Current time: {new Date().toLocaleTimeString()}
      </div>
    </div>
  );
};

// Global error handlers
window.addEventListener("error", (event) => {
  console.error("[Global Error]", event.error);
  const errorDiv = document.createElement('div');
  errorDiv.style.cssText = 'position:fixed;top:0;left:0;right:0;background:red;color:white;padding:10px;z-index:9999;';
  errorDiv.textContent = `Error: ${event.error.message}`;
  document.body.appendChild(errorDiv);
});

window.addEventListener("unhandledrejection", (event) => {
  console.error("[Unhandled Promise Rejection]", event.reason);
  const errorDiv = document.createElement('div');
  errorDiv.style.cssText = 'position:fixed;top:40px;left:0;right:0;background:orange;color:white;padding:10px;z-index:9999;';
  errorDiv.textContent = `Promise Error: ${event.reason}`;
  document.body.appendChild(errorDiv);
});

try {
  const container = document.getElementById("root");
  if (!container) {
    throw new Error("Root element not found");
  }
  
  const root = createRoot(container);
  root.render(React.createElement(TestApp));
  console.log("Test app rendered successfully");
} catch (error) {
  console.error("Failed to render app:", error);
  document.body.innerHTML = `
    <div style="padding:50px;background:#ffebee;color:#c62828;text-align:center;">
      <h1>Failed to load application</h1>
      <p>Error: ${error.message}</p>
      <p>Please check the console for more details.</p>
    </div>
  `;
}