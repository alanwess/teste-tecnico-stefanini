import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { Toaster } from 'sonner'
import { UserProvider } from "@/contexts/UserContext";

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <UserProvider>
      <App />
      <Toaster />
    </UserProvider>
  </React.StrictMode>,
)