
import "./i18n"; //jābūt pirms create root, lai i18n būtu inicializēts pirms React komponentu renderēšanas
import { createRoot } from 'react-dom/client'
import { StrictMode } from 'react'


import App from './App.jsx'
import {BrowserRouter as Router} from 'react-router-dom'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      
      <App />
      
    </Router>
  </StrictMode>
)