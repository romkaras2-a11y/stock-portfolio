//FundMetricsTable.jsx
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

interface FundMetricsTableProps {
  fundCode: string;
}

export default function FundMetricsTabTs({ fundCode }: FundMetricsTableProps) {

  const { t } = useTranslation(); 
  const metrics = useMemo(() => {
    const codeNum = parseInt(fundCode) || 0;
    return {
      dividendeProzent: (2.45 + (codeNum % 3) * 0.4).toFixed(2),
      exDatum: "15.05.2026",
      zahlungsDatum: "22.05.2026",
      fondsvolumen: (120.5 + (codeNum % 10) * 45).toFixed(1) + " Mio. USD",
      ter: (0.75 + (codeNum % 5) * 0.15).toFixed(2) + " %",
      risikoklasse: (3 + (codeNum % 3)),
    };
  }, [fundCode]);

  const rows = [
    { label: t('divYield'), value: `${metrics.dividendeProzent} %` },
    { label: t('exDate'), value: metrics.exDatum },
    { label: t('payDate'), value: metrics.zahlungsDatum },
    { label: t('volume'), value: metrics.fondsvolumen },
    { label: t('ter'), value: metrics.ter },
    { label: t('riskClass'), value: `${metrics.risikoklasse} von 7` },
  ];

  return (
    <div className="border border-gray-200 rounded-xl p-5 bg-white shadow-xs">
      <h3 className="text-sm font-bold uppercase tracking-wider text-boerse border-b border-gray-100 pb-2.5 mb-4">
         {t('metricsTitle')} 
      </h3>
      <div className="overflow-hidden rounded-lg border border-gray-100">
        <table className="w-full border-collapse text-sm text-left">
          <tbody>
            {rows.map((row, idx) => (
              <tr 
                key={idx} 
                className={`transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'} hover:bg-gray-50`}
              >
                <td className="p-3 text-gray-500 font-medium border-b border-gray-100">{row.label}</td>
                <td className="p-3 font-bold text-gray-900 text-right border-b border-gray-100">{row.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
