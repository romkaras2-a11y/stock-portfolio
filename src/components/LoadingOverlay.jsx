//LoadingOverlay.jsx
//import React from 'react';

export default function LoadingOverlay() {

    return (
      <div role="alert"  aria-live="assertive" aria-busy="true"
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex flex-col items-center justify-center z-50 animate-fade-in"
      >
        <div className="bg-white p-6 rounded-xl shadow-xl flex flex-col items-center space-y-4 max-w-xs text-center border border-slate-100">
          <svg className="animate-spin h-10 w-10 text-blue-600" xmlns="http://w3.org" fill="none" viewBox="0 0 24 24" >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>        
          <div>
            <p className="text-sm font-bold text-slate-800">Diagramm wird generiert... </p>         
          </div>
        </div>
      </div>
    );
}
