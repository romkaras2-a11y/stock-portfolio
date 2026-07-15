# 📈 React Wertpapier-Porträt (boerse.de Style)

Ein modulares, performantes React-Frontend zur Visualisierung von Investmentfonds-Porträts im klassischen Stil von boerse.de. Das Projekt bündelt ein interaktives Highcharts-Diagramm, granulare Kennzahlen-Tabs, eine Live-Suchfunktion sowie ein lokales Favoriten-System.

## 🚀 Features

- **Highcharts-Finanzchart**: Interaktiver `area`-Linienverlauf inklusive responsivem Zeitraum-Umschalter (1M, 6M, 1Y, MAX).
- **Separation of Concerns**: Saubere Architektur durch Aufteilung in spezialisierte Sub-Komponenten (`SearchBar`, `TabBar`, `FundChartTab`, etc.).
- **Tailwind CSS v4 Engine**: Modernes, ultraschnelles Styling über die neue v4-Plugin-Architektur (Konfiguration rein via CSS-Variablen).
- **Performance-Optimiert**: 
  - *Debounced Search*: API-Schonung durch 300ms Eingabeverzögerung.
  - *In-Memory Caching*: Kein doppelter Netzwerk-Traffic beim Hin- und Herwechseln von Wertpapieren.
  - *Cascading-Render-Schutz*: Zustandsberechnung über `useMemo` anstelle von doppelten `useEffect`-States.
- **Watchlist-System**: Speicherung von Favoriten-Fonds direkt im clientseitigen `localStorage`.
- **UX & i18n**: Visuell saubere Lademaske (Skeleton-Loader) gegen Layout-Shifts sowie integrierter nativer Sprachumschalter (DE/EN).

## 🛠️ Tech-Stack

- **Framework**: React 18+ (Vite Bundler)
- **Charts**: Highcharts & `highcharts-react-official`
- **Styles**: Tailwind CSS v4
- **API**: Offene REST-Schnittstelle von `api.mfapi.in` (NAV-Fondsdaten Zeitreihen)

## 💻 Installation & Lokaler Start

### 1. Repository klonen & Abhängigkeiten installieren
```bash
git clone <dein-repository-url>
cd stock-portfolio
npm install
```

### 2. Lokaler Dev-Proxy (Bereits in Vite vorkonfiguriert)
Das Projekt nutzt in der `vite.config.js` einen integrierten Proxy, um CORS-Restriktionen im Browser zu umgehen. Alle Anfragen an `/api/*` werden automatisch an den API-Server weitergeleitet.

### 3. Entwicklungsserver starten
```bash
npm run dev
```
Öffne anschließend [http://localhost:5173](http://localhost:5173) in deinem Browser.

## 📁 Projektstruktur

```text

src/
├── i18n/
│   ├── locales/
│   │   ├── de.json           # Deutsche Übersetzungen
│   │   └── en.json           # Englische Übersetzungen
│   └── i18nContext.tsx       # Internationalisierung Context (DE/EN)
|
├── components/
│   ├── FundChartTab.tsx      # Highcharts Rendering & Zeitreihen-Filter
│   ├── FundMetricsTable.tsx  # Tabelle für Fundamentaldaten & Dividenden
│   ├── FundPolicyCard.tsx    # Textkarte für die Anlagepolitik
│   ├── FundSkeleton.tsx      # Pulsierender Skeleton-Loader für die UX
│   ├── SearchBar.tsx         # Debounced Suchfeld inkl. Favoriten-Dropdown
│   ├── TabBar.tsx            # boerse.de Reiter-Steuerung
│   └── StockPortrait.tsx     # Hauptkomponente & State-Zentrale
├── services/
│   └── fundApi.ts            # API Fetching & In-Memory Cache
│         
├── index.css                 # Tailwind v4 Direktiven & Theme-Variablen
├── App.tsx                   # Globales Layout & State-Sync
└── main.tsx                  # React Applikations-Root
```

## 📝 Lizenz

MIT License - Freie Nutzung für private und kommerzielle Zwecke.

## Author

Roman Karas

