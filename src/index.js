import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/globals.css';
import App from './MainApp';
import { AuthProvider } from './contexts/AuthContext';
import { EventProvider } from './contexts/EventContext'; // Importamos el nuevo Contexto de Eventos

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <AuthProvider>
      <EventProvider>
        <App />
      </EventProvider>
    </AuthProvider>
  </React.StrictMode>
);
