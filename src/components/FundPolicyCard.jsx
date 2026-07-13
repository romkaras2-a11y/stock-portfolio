//FundPolicyCard.jsx
//import React from 'react';

export default function FundPolicyCard({ fundHouse }) {
  return (
    <div className="border border-gray-200 rounded-xl p-5 bg-white shadow-xs">
      <h3 className="text-sm font-bold uppercase tracking-wider text-boerse border-b border-gray-100 pb-2.5 mb-3">
        Anlagepolitik & Strategie
      </h3>
      <p className="text-sm text-gray-600 leading-relaxed">
        Der Fonds strebt ein langfristiges Kapitalwachstum an. Hierzu investiert das Management 
        aktiv in ein diversifiziertes Portfolio aus Substanzwerten, Wachstumstiteln und ausgewählten 
        Blue-Chip-Unternehmen im Zielmarkt <span className="font-semibold text-gray-800">{fundHouse || 'Global'}</span>. 
        Der Investmentprozess basiert auf einer fundamentalen Bottom-Up-Analyse.
      </p>
    </div>
  );
}
