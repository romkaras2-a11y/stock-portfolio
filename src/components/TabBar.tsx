// components/TabBar.tsx
//import React from 'react';
import { useTranslation } from 'react-i18next';

interface TabBarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function TabBarTs({ activeTab, onTabChange }:TabBarProps) {

    const { t } = useTranslation();
    const btnCls="px-5 py-2.5 font-bold text-sm rounded-t-lg transition-colors cursor-pointer";
    const inaktiveCls = 'bg-gray-100 text-gray-600 hover:bg-gray-200';
    const activeCls ='bg-boerse text-white';

  return (
    <div className="flex border-b-2 border-boerse mt-6 gap-1">
        <button onClick={() => onTabChange('chart')} 
            className={`${btnCls} ${activeTab === 'chart' ? activeCls : inaktiveCls}`}
        >
            {t('tabChart')}
        </button>
        <button onClick={() => onTabChange('policy')} 
            className={`${btnCls} ${activeTab === 'policy' ? activeCls : inaktiveCls}`}
        >
             {t('tabPolicy')}
        </button>        
        <button onClick={() => onTabChange('metrics')} 
            className={`${btnCls} ${ activeTab === 'metrics' ? activeCls : inaktiveCls}`}
        >
             {t('tabMetrics')}
        </button>
    </div>
  );
}
