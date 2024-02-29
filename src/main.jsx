import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { createClient } from '@supabase/supabase-js'
import { SessionContextProvider } from '@supabase/auth-helpers-react'

export const supabase = createClient(
  "https://itemvbbxygksydixnugd.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml0ZW12YmJ4eWdrc3lkaXhudWdkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDgwMTEwMTUsImV4cCI6MjAyMzU4NzAxNX0.8MpGKG06LLnHMPuHwc4wGTEnr2GqRcDbmOxQLg7ArXM"
)
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
  <SessionContextProvider supabaseClient={supabase}>
    <App />
  </SessionContextProvider>
  </React.StrictMode>,
)
