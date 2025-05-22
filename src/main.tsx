import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter, Route, Routes } from 'react-router'
import DashboardPage from './pages/Dashboard/DashboardPage.tsx'
import LogsPage from './pages/LogsPage/LogsPage.tsx'
import AnomaliesPage from './pages/AnomaliesPage/page.tsx'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />}>
        <Route index element={<DashboardPage />} />
        <Route path="anomalies" element={<AnomaliesPage />} />
        <Route path="logs" element={<LogsPage />} />
      </Route>
    </Routes>
  </BrowserRouter>
)
