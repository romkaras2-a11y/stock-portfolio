// services/fundApi.ts
// Typen für die API-Antwort definieren
interface ApiMeta {
  fund_house: string;
  scheme_name: string;
  scheme_code: number;
}

interface ApiDataItem {
  date: string;
  nav: string;
}

interface ApiResponse {
  meta: ApiMeta;
  data: ApiDataItem[];
}

export interface FundDetails {
  name: string;
  scheme: string;
  isin: string;
}

// Typ für ein Highcharts-Datenpaar: [Timestamp, Wert]
export type ChartDataPoint = [number, number];

export interface FundResult {
  details: FundDetails;
  chartData: ChartDataPoint[];
}

export interface SearchResultItem {
  schemeCode: string;
  schemeName: string;
}

const fundCache: Record<string, FundResult> = {};


const env = (import.meta as any).env;
const apiUrl = env.VITE_API_URL;

export const fetchFundDetailsAndChart = async (fundCode: string): Promise<FundResult> => {
  if (fundCache[fundCode]) {
    return fundCache[fundCode];
  }

  try {
    const response = await fetch(`${apiUrl}${fundCode}`);
    if (!response.ok) throw new Error(`API-Fehler: Status ${response.status}`);
    
    const json: ApiResponse = await response.json();
    if (!json.data || json.data.length === 0) throw new Error('Keine Kursdaten gefunden.');

    const details: FundDetails = {
      name: json.meta.fund_house,
      scheme: json.meta.scheme_name,
      isin: String(json.meta.scheme_code), 
    };

    const chartData: ChartDataPoint[] = json.data.map((item) => {
      const [day, month, year] = item.date.split('-');
      const timestamp = new Date(Number(year), Number(month) - 1, Number(day)).getTime();
      return [timestamp, parseFloat(item.nav)];
    });

    chartData.reverse();
    const result: FundResult = { details, chartData };
    fundCache[fundCode] = result;
    
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const searchFunds = async (query: string): Promise<SearchResultItem[]> => {
  if (!query || query.length < 3) return [];
  try {
    const response = await fetch(`${apiUrl}search?q=${encodeURIComponent(query)}`);
    if (!response.ok) return [];
    const json: SearchResultItem[] = await response.json();
    return json;
  } catch (error) {
    console.error("Fehler bei der Fondssuche:", error);
    return [];
  }
};
