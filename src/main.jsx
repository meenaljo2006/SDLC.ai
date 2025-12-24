import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom' 
import App from './App.jsx'
import { ProjectProvider } from './Context/ProjectContext';
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter> 
      <ProjectProvider> {/* <-- Wrap App with this */}
        <App />
      </ProjectProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
