import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import BloodDropCursor from './components/animations/BloodDropCursor'
import './i18n'
import './index.css'
import { Buffer } from "buffer";

window.Buffer = Buffer;
window.global = window;

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <BloodDropCursor />
      <App />
    </BrowserRouter>
  </React.StrictMode>
)
