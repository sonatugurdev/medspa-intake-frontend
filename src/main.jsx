import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { PracticeProvider } from './contexts/PracticeContext'
import App from './App'
import './styles/global.css'

/**
 * Routing layout:
 *   /:slug   → main intake flow for a given practice
 *   /        → redirects to /demo-clinic for development
 */
function AppWithPractice() {
  return (
    <PracticeProvider>
      <App />
    </PracticeProvider>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/:slug" element={<AppWithPractice />} />
        <Route path="/" element={<Navigate to="/demo-clinic" replace />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)
