// Simple test to check if React is working
import React from 'react';
import { createRoot } from 'react-dom/client';

const TestApp = () => {
  return React.createElement('div', { 
    style: { 
      padding: '20px', 
      backgroundColor: '#f0f0f0',
      textAlign: 'center',
      fontSize: '24px',
      fontFamily: 'Arial, sans-serif'
    } 
  }, 'React is working!');
};

const root = createRoot(document.getElementById('root'));
root.render(React.createElement(TestApp));