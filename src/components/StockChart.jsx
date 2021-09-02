import React, { useEffect, useState } from 'react';
import Chart from './tradingview/index';

const StockChart = () => {

  const [symbol, setSymbol] = useState('AAPL');
  const [symbols, setSymbols] = useState([]);
  const [stock, setStock] = useState('stock');
  const [isShow, setShow] = useState(false);

  console.log('[show]', stock);

  const [chartSymbol, setChartSymbol] = useState('AAPL');
  const [chartStock, setChartStock] = useState('stock');

  useEffect(() => {
    async function evalSymbol() {
      try {
        let url = 'https://api.twelvedata.com/symbol_search?symbol=';
        // if (stock == 'stock') {
        //   url = "https://api.twelvedata.com/stocks?symbol=";
        // } else if (stock == 'forex') {
        //   url = "https://api.twelvedata.com/forex_pairs?symbol=";
        // } else if (stock == 'crypto') {
        //   url = "https://api.twelvedata.com/cryptocurrencies?symbol=";
        // }
        const res = await fetch(url + symbol);
        const data = await res.json();

        setSymbols(data.data);

      } catch (err) {

      }
    }

    evalSymbol();
  }, [symbol, stock]);

  const onSubmit = () => {
    setChartStock(stock);
    setChartSymbol(symbol);
  }

  const onSymbolInput = (e) => {
    setSymbol(e.target.value);
    setShow(true);
  }

  const onItemClick = (val) => {
    console.log('[sele]', val);
    setSymbol(val);
    setShow(false);
  }

  return (
    <div className="container min-vh-100 d-flex flex-column">
      <h2 className="my-3">Stock Chart</h2>

      <div className="row">
        <div className="col-md-5">
          <div className="form-group">
            <label htmlFor="">Stock</label>
            <select name="" id="" className="form-control" onChange={e => setStock(e.target.value)} value={stock}>
              <option value="stock">Stock</option>
              <option value="forex">Forex</option>
              <option value="crypto">Cryptocurrency</option>
            </select>
          </div>
        </div>
        <div className="col-md-5">
          <div className="form-group position-relative">
            <label htmlFor="">Symbol</label>
            <input type="text" value={symbol} onChange={onSymbolInput} className="form-control" />
            {
              isShow &&
              <div className="position-absolute shadow bg-white c-dropdown" style={{ top: 70 }}>
                <ul class="list-group">
                  {
                    symbols.map((item, key) =>
                      <li class="list-group-item" key={key} onClick={() => onItemClick(item.symbol)}>{item.symbol} ({item.exchange})</li>
                    )
                  }
                </ul>
              </div>
            }

          </div>
        </div>
        <div className="col-md-2">
          <div className="form-group">
            <label htmlFor="">&nbsp;</label>
            <button className="btn btn-primary form-control" onClick={onSubmit}>Submit</button>
          </div>
        </div>
      </div>

      <div className="flex-fill mt-4" style={{ minHeight: 200 }}>
        <Chart symbol={chartSymbol} stock={chartStock} interval="5" width="100%" height="100%" />
      </div>
    </div>
  )
}

export default StockChart;