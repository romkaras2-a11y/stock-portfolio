// components/StockPortrait
import  { useState, useEffect, useMemo } from 'react';
import { fetchFundDetailsAndChart, FundResult } from '../services/fundApi';
import { useTranslation } from 'react-i18next';
import SearchBarTs from './SearchBar.tsx';
import TabBarTs from './TabBar.tsx';
import FundChartTabTs from './FundChartTab.tsx';
import FundPolicyTabTs from './FundPolicyTab.tsx';
import FundMetricsTabTs from './FundMetricsTab.tsx';
import LoadingOverlayTs from './LoadingOverlay.tsx';

interface WatchlistItem {
  code: string;
  name: string;
}

export default function StockPortrait() {
 const { t, i18n } = useTranslation();
  const [fundCode, setFundCode] = useState<string>("102885");
  const [rawData, setRawData] = useState<FundResult>({ details:{ name: '', scheme: '', isin: '' }, chartData: [] });
  const [activeTab, setActiveTab] = useState<string>('chart');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Watchlist State mit Initialisierung aus dem localStorage
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>(() => {
    const saved = localStorage.getItem('fund_watchlist');
    return saved ? JSON.parse(saved) : [
      { code: "102885", name: "Invesco India Growth Fund" } // Ein Standardfonds als Initialwert
    ];
  });
  // Watchlist im localStorage synchronisieren
  useEffect(() => {
    localStorage.setItem('fund_watchlist', JSON.stringify(watchlist));
  }, [watchlist]);  
  // Daten laden bei Wechsel der Fonds-ID
  useEffect(() => {
    const loadFundData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const result = await fetchFundDetailsAndChart(fundCode);
        setRawData(result);
        setActiveTab('chart');
      } catch (err:any) {
        setError(err.message || 'Fehler beim Laden');
      } finally {
        setIsLoading(false);
      }
    };
    loadFundData();
  }, [fundCode]);
  // Performance-Berechnung & Kursermittlung
  const perfData = useMemo(() => {
    const { chartData } = rawData;
    if (!chartData || chartData.length < 2) return { latest: 0, change: 0, percent: 0 };
    
    const latest = chartData[chartData.length - 1][1];
    const previous = chartData[chartData.length - 2][1];
    const change = latest - previous;
    const percent = ((change / previous) * 100).toFixed(2);
    
    return { latest, change, percent };
  }, [rawData.chartData]);

  // Funktion zum Hinzufügen/Entfernen von Favoriten
  const handleToggleWatchlist = () => {
    const exists = watchlist.some(f => f.code === fundCode);
    if (exists) {
      setWatchlist(watchlist.filter(f => f.code !== fundCode));
    } else {
      setWatchlist([...watchlist, { code: fundCode, name: rawData.details?.scheme || "Unbekannter Fonds" }]);
    }
  };  
  // Callback, wenn ein Fonds über die Suche ausgewählt wird
  const handleSelectFund = (code:string) => {
    setFundCode(code);
  };
  const isPositive = perfData.change >= 0;

  if (isLoading) return <LoadingOverlayTs />;
  if (error) return <div className="p-10 text-center text-red-600 font-bold">Fehler: {error}</div>;

  return (
    <div className="max-w-4xl mx-auto my-6 px-4 font-sans antialiased text-gray-900">      
        {/* CONTAINER FÜR SUCHLEISTE + SPRACHUMSCHALTER NEBENAND */}
        <div className="flex items-start gap-4 w-full">
          <div className="flex-1">
            <SearchBarTs onSelectFund={handleSelectFund} onToggleWatchlist={handleToggleWatchlist}
              watchlist={watchlist} currentFundCode={fundCode}
            />
          </div>
          
          {/* SPRACHUMSCHALTER DIREKT NEBEN DER SUCHE */}
          <div className="flex items-center gap-1.5 text-xs font-bold text-gray-400 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 shrink-0 shadow-xs">
            <button 
              onClick={() =>i18n.changeLanguage('de')} 
              className={`cursor-pointer transition-colors ${i18n.language === 'de' ? 'text-boerse font-black' : 'hover:text-gray-600'}`}
            >
              DE
            </button>
            <span className="text-gray-300 font-normal">|</span>
            <button 
              onClick={() => i18n.changeLanguage('en')} 
              className={`cursor-pointer transition-colors ${i18n.language === 'en' ? 'text-boerse font-black' : 'hover:text-gray-600'}`}
            >
              EN
            </button>
          </div>
        </div>
      {/* STAMMDATEN-KOPF */}
        <div className="flex justify-between items-end border-b border-gray-200 pb-4">
          <div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight leading-snug">{rawData.details?.scheme}</h1>
            <p className="mt-1 text-xs text-gray-500">
              {t('code')}: <span className="font-mono font-semibold text-gray-700">{rawData.details?.isin}</span> | {t('kag')}: <span className="font-semibold text-gray-700">{rawData.details?.name}</span>
            </p>
          </div>
          <div className="text-right shrink-0">
            <div className="text-2xl font-extrabold text-gray-900 tracking-tight">{perfData.latest.toFixed(2)} $</div>
            {/* Performance-Anzeige im boerse.de Stil */}
            <div className={`text-xs font-bold mt-1 flex justify-end items-center gap-1 ${isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
              <span>{isPositive ? '▲' : '▼'}</span>
              <span>{isPositive ? '+' : ''}{perfData.change.toFixed(2)} ({isPositive ? '+' : ''}{perfData.percent}%)</span>
              <span className="text-gray-400 font-normal ml-1">{t('vortag')}</span>
            </div>
          </div>
        </div>
      {/* TAB-NAVIGATION */}
      <TabBarTs activeTab={activeTab} onTabChange={setActiveTab} />
      {/* INHALTS-WECHSEL */}
        <main className="mt-5">
        { activeTab === 'chart' && (
          <FundChartTabTs rawChartData={rawData.chartData} />
        )}

        { activeTab === 'policy' && (
           <FundPolicyTabTs fundHouse={rawData.details?.name} />
        )}

        {activeTab === 'metrics' && (
          <FundMetricsTabTs fundCode={fundCode} />
        )}
        </main>
    </div>
  );
}

