import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import ReportApp from './daily_site_report_module.tsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ReportApp />
  </StrictMode>,
)
