import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

const root = document.getElementById('root')

if (!root) {
  console.error('Root element not found!')
} else {
  try {
    createRoot(root).render(
      <StrictMode>
        <App />
      </StrictMode>,
    )
    console.log('App mounted successfully')
  } catch (error) {
    console.error('Error mounting app:', error)
    root.innerHTML = '<div style="padding: 20px; color: red; font-family: monospace;">Error mounting app: ' + String(error) + '</div>'
  }
}
