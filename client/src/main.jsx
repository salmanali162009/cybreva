// src/main.jsx
import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { warmupBackend } from './services/api'

// Wake up Render backend in background as soon as the visitor visits the website
warmupBackend();

const rootElement = document.getElementById('root');
if (rootElement && rootElement.hasChildNodes()) {
  hydrateRoot(
    rootElement,
    <StrictMode>
      <App />
    </StrictMode>
  );
} else if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}
