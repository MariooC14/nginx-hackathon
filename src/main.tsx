import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router'
import NetworkLogsProvider from './NetworkLogsProvider.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <NetworkLogsProvider>
        <App />
      </NetworkLogsProvider>
    </BrowserRouter>
  </StrictMode>,
)
