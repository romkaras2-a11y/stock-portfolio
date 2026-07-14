//FundPolicyTab.jsx
//import React from 'react';
import { useTranslation } from 'react-i18next';

export default function FundPolicyTab({ fundHouse }) {

   const { t } = useTranslation(); 

  return (
    <div className="border border-gray-200 rounded-xl p-5 bg-white shadow-xs">
      <h3 className="text-sm font-bold uppercase tracking-wider text-boerse border-b border-gray-100 pb-2.5 mb-3">
       {t('policyTitle')}
      </h3>
      <p className="text-sm text-gray-600 leading-relaxed">
        {t('policyText')}
        <span className="font-semibold text-gray-800">{fundHouse || 'Global'}</span>.         
      </p>
    </div>
  );
}
