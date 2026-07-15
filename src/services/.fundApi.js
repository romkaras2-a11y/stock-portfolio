//
/**
 * Holt Fondsdaten von der API und formatiert sie für Highcharts.
 * @param {string} fundCode - Die ID oder das Symbol des Fonds
 * @returns {Promise<{details: Object, chartData: Array}>}
 */
const fundCache = {};

export const fetchFundDetailsAndChart = async (fundCode) => {

    if (fundCache[fundCode]) {
    return fundCache[fundCode];
  }

  try {
     const response = await fetch(`/api/mf/${fundCode}`);    
    if (!response.ok) {
      throw new Error(`API-Fehler: Server antwortete mit Status ${response.status}`);
    }
    
    const json = await response.json();
    if (!json.data || json.data.length === 0) {
      throw new Error('Keine Kursdaten für diesen Fonds gefunden.');
    }
    //  Stammdaten für das Porträt extrahieren
    const details = {
      name: json.meta.fund_house,
      scheme: json.meta.scheme_name,
      isin: json.meta.scheme_code, 
    };

    // Kursdaten für Highcharts transformieren [[Timestamp, Wert], ...]
    const chartData = json.data.map(item => {
      const [day, month, year] = item.date.split('-');
      // Monate sind im JS-Date-Objekt 0-basiert (Januar = 0)
      const timestamp = new Date(year, month - 1, day).getTime();
      return [timestamp, parseFloat(item.nav)];
    });

    // Highcharts benötigt die Daten chronologisch aufsteigend (alt nach neu)
    chartData.reverse();
    const result = { details, chartData };
    fundCache[fundCode] = result;
    return result;
  } catch (error) {
    console.error("Fehler im fundApi Service:", error);
    throw error; // damit die Komponente den Fehler abfangen kann
  }
};

export const searchFunds = async (query) => {

  if (!query || query.length < 3) return [];

  try {
    const response = await fetch(`/api/mf/search?q=${encodeURIComponent(query)}`);
    if (!response.ok) return [];
    return await response.json(); // Liefert ein Array
  } catch (error) {
    console.error("Fehler bei der Fondssuche:", error);
    return [];
  }
};