import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import DemoRequestPage from './pages/DemoRequestPage'
import DemoPage from './pages/DemoPage'
import { ErrorBoundary } from './components/ErrorBoundary'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ErrorBoundary><Landing /></ErrorBoundary>} />
        <Route path="/pide-tu-demo" element={<ErrorBoundary><DemoRequestPage /></ErrorBoundary>} />
        <Route path="/demo" element={<ErrorBoundary><DemoPage /></ErrorBoundary>} />
      </Routes>
    </BrowserRouter>
  )
}
