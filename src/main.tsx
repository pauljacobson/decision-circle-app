/**
 * Application Entry Point
 *
 * This file initializes the React application and mounts it to the DOM.
 * It wraps the app with StrictMode for development checks and ErrorBoundary
 * for production-grade error handling.
 */

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import DecisionWheelApp from './App'
import ErrorBoundary from './components/ErrorBoundary'

// Get root element from DOM
const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('Failed to find root element. Make sure index.html has a div with id="root"')
}

// Create React root and render app
createRoot(rootElement).render(
  <StrictMode>
    <ErrorBoundary>
      <DecisionWheelApp />
    </ErrorBoundary>
  </StrictMode>,
)
