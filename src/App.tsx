import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import DemoRequestPage from './pages/DemoRequestPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/pide-tu-demo" element={<DemoRequestPage />} />
      </Routes>
    </BrowserRouter>
  )
}
