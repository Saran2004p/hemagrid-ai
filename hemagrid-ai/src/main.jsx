import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import BloodDropCursor from './components/animations/BloodDropCursor'
import './i18n'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <BloodDropCursor />
      <App />
    </BrowserRouter>
  </React.StrictMode>
)
