// components/SearchBar.jsx
import { useState, useEffect } from 'react';
import { searchFunds } from '../services/fundApi';
import { useTranslation } from 'react-i18next';

export default function SearchBar({ onSelectFund, watchlist, onToggleWatchlist, currentFundCode }) {

  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showWatchlist, setShowWatchlist] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(searchQuery), 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    const triggerSearch = async () => {
      if (debouncedQuery.length >= 3) {
        const results = await searchFunds(debouncedQuery);
        setSearchResults(results.slice(0, 5));
        setShowWatchlist(false);
      } else {
        setSearchResults([]);
      }
    };
    triggerSearch();
  }, [debouncedQuery]);

  const isCurrentFavorite = watchlist.some(f => f.code === currentFundCode);

  return (
    <div className="relative mb-8">
      <div className="flex gap-2">
        <input type="text"  value={searchQuery}
          placeholder={t('searchPlaceholder')}          
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => searchQuery.length < 3 && setShowWatchlist(true)}
          onBlur={() => setTimeout(() => setShowWatchlist(false), 200)}
          className="w-full p-1.5 bg-white border border-gray-300 rounded-lg text-sm shadow-xs focus:outline-hidden focus:ring-2 focus:ring-boerse focus:border-transparent transition-all mr-2"
        />
        <button
          onClick={onToggleWatchlist}
          className={`px-2 border rounded-lg cursor-pointer transition-colors text-lg h-[32px]  ${
            isCurrentFavorite 
              ? 'bg-amber-500 border-amber-500 text-white hover:bg-amber-600' 
              : 'bg-white border-gray-300 text-gray-400 hover:bg-gray-50'
          }`}
          title={isCurrentFavorite ? "Aus Favoriten entfernen" : "Zu Favoriten hinzufügen"}
        >
          ★
        </button>
      </div>

      {/* Dropdown für Suchergebnisse */}
      {searchResults.length > 0 && (
        <div className="absolute w-full bg-white border border-gray-200 rounded-lg shadow-xl z-50 mt-1 max-h-64 overflow-y-auto divide-y divide-gray-100">
          {searchResults.map((item) => (
            <div 
              key={item.schemeCode} 
              onClick={() => {
                onSelectFund(item.schemeCode, item.schemeName);
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

      {/* Dropdown für Watchlist (Favoriten) */}
      {showWatchlist && watchlist.length > 0 && searchQuery.length < 3 && (
        <div className="absolute w-full bg-white border border-gray-200 rounded-lg shadow-xl z-50 mt-1 max-h-64 overflow-y-auto">
          <div className="p-2 bg-gray-50 text-xs font-bold text-gray-500 border-b border-gray-100"> {t('watchlistTitle')}  ★</div>
          {watchlist.map((item) => (
            <div 
              key={item.code}
              onMouseDown={() => {
                onSelectFund(item.code, item.name);
                setShowWatchlist(false);
              }}
              className="p-3 cursor-pointer text-sm text-gray-700 hover:bg-amber-50 hover:text-amber-700 transition-colors flex justify-between"
            >
              <span>{item.name}</span>
              <span className="text-gray-400 font-mono text-xs">({item.code})</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
