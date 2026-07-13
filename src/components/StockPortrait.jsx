// components/StockPortrait
import  { useState, useEffect } from 'react';
import { fetchFundDetailsAndChart, searchFunds } from '../services/fundApi';

import FundChartTab from './FundChartTab';
import FundPolicyCard from './FundPolicyCard';
import FundMetricsTable from './FundMetricsTable';
import FundSkeleton from './FundSkeleton';

export default function StockPortrait() {
  const [fundCode, setFundCode] = useState("102885");
  const [rawData, setRawData] = useState({ details: null, chartData: [] });
  const [activeTab, setActiveTab] = useState('chart');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // States für das Suchfeld und den Debounce-Wert
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  // 1. NEU: Debounce-Logik für die Tastatur-Eingabe
  useEffect(() => {
    // Setze einen Timer, der nach 300ms den debouncedQuery-State aktualisiert
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);

    // Cleanup-Funktion: Löscht den alten Timer, wenn der Nutzer weiterstippt
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // 2. Daten laden bei Fonds-Wechsel (Nutzt jetzt den Service-Cache)
  useEffect(() => {
    const loadFundData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const result = await fetchFundDetailsAndChart(fundCode);
        setRawData(result);
        setActiveTab('chart');
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    loadFundData();
  }, [fundCode]);

  // 3. NEU: API-Suche reagiert NUR noch auf den verzögerten debouncedQuery
  useEffect(() => {
    const triggerSearch = async () => {
      if (debouncedQuery.length >= 3) {
        const results = await searchFunds(debouncedQuery);
        setSearchResults(results.slice(0, 5));
      } else {
        setSearchResults([]);
      }
    };
    triggerSearch();
  }, [debouncedQuery]); // HIER GEÄNDERT auf debouncedQuery

  const { details, chartData } = rawData;
  const latestPrice = chartData.length > 0 ? parseFloat(chartData[chartData.length - 1]) : 0.00;

  if (isLoading) return <FundSkeleton />;
  if (error) return <div className="p-10 text-center text-red-600 font-bold">Fehler: {error}</div>;

  return (
    <div className="max-w-4xl mx-auto my-6 px-4 font-sans antialiased text-gray-900">
      
      {/* SUCHLEISTE */}
      <div className="relative mb-6">
        <input 
          type="text" 
          placeholder="Fonds suchen (z.B. Tata, SBI, Invesco)..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-3.5 bg-white border border-gray-300 rounded-lg text-sm shadow-sm focus:outline-hidden focus:ring-2 focus:ring-boerse focus:border-transparent transition-all"
        />
        {searchResults.length > 0 && (
          <div className="absolute w-full bg-white border border-gray-200 rounded-lg shadow-xl z-50 mt-1 max-h-64 overflow-y-auto divide-y divide-gray-100">
            {searchResults.map((item) => (
              <div 
                key={item.schemeCode} 
                onClick={() => {
                  setFundCode(item.schemeCode);
                  setSearchQuery("");
                  setSearchResults([]);
                }}
                className="p-3 cursor-pointer text-sm text-gray-700 hover:bg-gray-50 hover:text-boerse transition-colors"
              >
                {item.schemeName}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* STAMMDATEN-KOPF */}
      <div className="flex justify-between items-end border-b border-gray-200 pb-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900 tracking-tight leading-snug">{details?.scheme}</h1>
          <p className="mt-1 text-xs text-gray-500">
            Code: <span className="font-mono font-semibold text-gray-700">{details?.isin}</span> | KAG: <span className="font-semibold text-gray-700">{details?.name}</span>
          </p>
        </div>
        <div className="text-right shrink-0">
          <div className="text-2xl font-extrabold text-gray-900 tracking-tight">{latestPrice.toFixed(2)} $</div>
        </div>
      </div>

      {/* BOERSE.DE TAB-NAVIGATION */}
      <div className="flex border-b-2 border-boerse mt-6 gap-1">
        <button 
          onClick={() => setActiveTab('chart')} 
          className={`px-5 py-2.5 font-bold text-sm rounded-t-lg transition-colors cursor-pointer ${
            activeTab === 'chart' ? 'bg-boerse text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          📈 Kursverlauf
        </button>
        <button 
          onClick={() => setActiveTab('facts')} 
          className={`px-5 py-2.5 font-bold text-sm rounded-t-lg transition-colors cursor-pointer ${
            activeTab === 'facts' ? 'bg-boerse text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          📄 Daten & Fakten
        </button>
      </div>

      {/* INHALTS-WECHSEL */}
      {activeTab === 'chart' ? (
        <FundChartTab rawChartData={chartData} />
      ) : (
        <div className="mt-5 flex flex-col gap-5">
          <FundPolicyCard fundHouse={details?.name} />
          <FundMetricsTable fundCode={fundCode} />
        </div>
      )}

    </div>
  );
}

