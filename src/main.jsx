/* Foreign dependencies */
import React from 'react'
import ReactDOM from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css';

/* Local dependencies */
import App from './App';
import { NotificationProvider } from './core/notificationContext';
import { OverlayProvider } from './core/overlayContext';
import { DataProvider } from './core/dataContext';
import './styles/layouts.css'
import './styles/components.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
    <NotificationProvider>
      <OverlayProvider>
        <DataProvider>
          <App />
        </DataProvider>
      </OverlayProvider>
    </NotificationProvider>
  // </React.StrictMode>
)
 