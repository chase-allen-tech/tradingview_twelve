import './App.css';
import { BrowserRouter, Route } from 'react-router-dom';
import StockChart from './components/StockChart';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Route path="/" exact component={StockChart}/>
      </BrowserRouter>
    </div>
  );
}

export default App;
