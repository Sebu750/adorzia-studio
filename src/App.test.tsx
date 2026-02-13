import { useState } from "react";

export default function App() {
  const [count, setCount] = useState(0);
  
  console.log("Test App rendering");
  
  return (
    <div style={{ padding: '2rem', textAlign: 'center', background: '#0d0d0d', color: '#f8f9fa' }}>
      <h1>Adorzia Test App</h1>
      <p>React is working!</p>
      <button 
        onClick={() => setCount(count + 1)}
        style={{ padding: '0.5rem 1rem', background: '#f8f9fa', color: '#0d0d0d', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
      >
        Count: {count}
      </button>
    </div>
  );
}