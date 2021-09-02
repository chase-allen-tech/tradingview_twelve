import React from 'react';
import Chart from './tradingview/index';

const StockChart = () => {

  return (
    <div className="container min-vh-100 d-flex flex-column">
      <h2>Stock Chart</h2>

      <div className="flex-fill" style={{minHeight: 300}}>
        <Chart symbol="AAPL" interval="5" width="100%" height="100%" />
      </div>
    </div>
  )
}

export default StockChart;