// FundChartTab.jsx
import { useState, useMemo } from 'react';
import Highcharts from 'highcharts';
import _HighchartsReact from 'highcharts-react-official';
import { ChartDataPoint } from '../services/fundApi';

const HighchartsReact = _HighchartsReact || _HighchartsReact;

interface FundChartTabProps {
  rawChartData: ChartDataPoint[];
}

export default function FundChartTabTs({ rawChartData }:FundChartTabProps) {
  const [timeframe, setTimeframe] = useState('MAX');

  const filteredChartData = useMemo(() => {
    if (!rawChartData.length) return [];
    const now = new Date();
    let cutoffTimestamp = 0;

    if (timeframe === '1M') cutoffTimestamp = new Date().setMonth(now.getMonth() - 1);
    else if (timeframe === '6M') cutoffTimestamp = new Date().setMonth(now.getMonth() - 6);
    else if (timeframe === '1Y') cutoffTimestamp = new Date().setFullYear(now.getFullYear() - 1);
    else return rawChartData;

    return rawChartData.filter(([timestamp]) => timestamp >= cutoffTimestamp);
  }, [timeframe, rawChartData]);

  const chartOptions = {
    title: { text: '' },
    chart: { type: 'area', height: 350 },
    xAxis: { type: 'datetime' },
    yAxis: { 
      title: { text: 'Wert in Währung' },
      labels: { 
            formatter: function (this: Highcharts.AxisLabelsFormatterContextObject) {
                const val = typeof this.value === 'number' ? this.value : parseFloat(this.value);
               return val.toFixed(2) + ' €'; 
            } 
        }
    },
    credits: { enabled: false },
    series: [{
      name: 'Wert',
      data: filteredChartData,
      color: '#00569d',
      fillColor: {
        linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
        stops: [[0, 'rgba(0, 86, 157, 0.3)'], [1, 'rgba(0, 86, 157, 0.0)']]
      }
    }]
  };

  return (
    <div className="mt-5 border border-gray-200 rounded-xl p-4 bg-white shadow-xs">
      <div className="flex justify-between items-center mb-4">
        <span className="font-bold text-gray-700 text-sm">Historischer Verlauf</span>
        <div className="flex gap-1.5">
          {['1M', '6M', '1Y', 'MAX'].map((t) => (           
            <button
              key={t}
              onClick={() => setTimeframe(t)}
              className={`px-3 py-1 border rounded-md text-xs font-bold transition-all cursor-pointer ${
                timeframe === t 
                  ? 'bg-boerse text-white border-boerse shadow-xs' 
                  : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>
      <HighchartsReact highcharts={Highcharts} options={chartOptions} />
    </div>
  );
}

