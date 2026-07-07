import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Analytics } from '@vercel/analytics/react'
import Landing from './pages/Landing'
import DemoRequestPage from './pages/DemoRequestPage'
import DemoPage from './pages/DemoPage'
import ClientPortalPage from './pages/ClientPortalPage'
import AdminPage from './pages/AdminPage'
import { ErrorBoundary } from './components/ErrorBoundary'
import { ClarityScript } from './components/ClarityScript'

export default function App() {
  return (
    <BrowserRouter>
      <ClarityScript />
      <Routes>
        <Route path="/" element={<ErrorBoundary><Landing /></ErrorBoundary>} />
        <Route path="/pide-tu-demo" element={<ErrorBoundary><DemoRequestPage /></ErrorBoundary>} />
        <Route path="/demo" element={<ErrorBoundary><DemoPage /></ErrorBoundary>} />
        <Route path="/cliente/:slug" element={<ClientPortalPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
      <Analytics />
    </BrowserRouter>
  )
}
