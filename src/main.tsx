import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import App from './App';
import './index.css'
import './i18n/i18nContext.tsx' 


const root = document.getElementById('root');
if(root !== null){
  createRoot( root).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )  
}else{
   throw new Error('Das Root-Element mit der ID "root" wurde im HTML nicht gefunden.');
}
