/* Foreign dependencies */
import React from 'react'
import ReactDOM from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css';

/* Local dependencies */
import App from './App';
import { ConfigsProvider } from './core/configsContext';
import { NotificationProvider } from './core/notificationContext';
import { OverlayProvider } from './core/overlayContext';
import { DataProvider } from './core/dataContext';
import { FormProvider } from './core/formContext';
import './styles/root.css'
import './styles/fonts.css'
import './styles/keyframes.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
    <NotificationProvider>
      <OverlayProvider>
        <DataProvider>
          <ConfigsProvider>
            <FormProvider>
              <App />
            </FormProvider>
          </ConfigsProvider>
        </DataProvider>
      </OverlayProvider>
    </NotificationProvider>
  // </React.StrictMode>
)
 