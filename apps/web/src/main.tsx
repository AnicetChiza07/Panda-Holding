import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css' // On va recréer un index.css vide ou de base juste après

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
</React.StrictMode>,
)