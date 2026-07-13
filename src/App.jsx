import './App.css'
import StockPortrait from './components/StockPortrait';

function App() {
  return (
    <div>
      {/* Standardfonds laden */}
      <StockPortrait fundCode="102885" />
      
      {/* Oder ein anderes Wertpapier laden durch einfachen ID-Wechsel */}
      {/* <StockPortrait fundCode="100033" /> */}
    </div>
  );
}

export default App
