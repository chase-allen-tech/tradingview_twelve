import { API_KEY } from "../../config/env";

/* eslint-disable no-unused-vars */
// export const configurationData =  {
//   supported_resolutions: ["1min", "5min", "15min", "30min", "45min", "1h", "2h", "4h", "1day", "1week", "1month"]
// };

var latestBar;

const sendResolutions = {
  1: "1min", 5: "5min", 15: '15min', 30: '30min', 45: '45min', 60: '1h', 120: '2h', 240: '4h', '1D': '1day'
}


export const configurationData = {
  supported_resolutions: ["1", "5", "15", "30", "45", "60", "120", "240", "1D"],
};

function convertResolution(resolution) {
  var interval
  if (resolution === '1') {
    interval = '1m'
  } else if (resolution === '5') {
    interval = '5m'
  } else if (resolution === '10') {
    interval = '10m'
  } else if (resolution === '15') {
    interval = '15m'
  } else if (resolution === '30') {
    interval = '30m'
  } else if (resolution === '45') {
    interval = '45m'
  } else if (resolution === '60') {
    interval = '1h'
  } else if (resolution === '120') {
    interval = '2h'
  } else if (resolution === '240') {
    interval = '4h'
  } else if (resolution === '1D') {
    interval = '24h'
  } else {
    interval = resolution
  }
  return interval
}

const INTERVAL_SECONDS = {
  '1m': 60,
  '5m': 300,
  '10m': 600,
  '15m': 900,
  '30m': 1800,
  '1h': 3600,
  '4h': 14400,
  '12h': 43200,
  '24h': 86400
}


// Chart Methods
export default {
  onReady: (callback) => {
    setTimeout(() => callback(configurationData));
  },
  searchSymbols: async () => {
    // Code here...
  },
  resolveSymbol: async (symbolName, onSymbolResolvedCallback, onResolveErrorCallback) => {
    const symbolInfo = {
      name: symbolName,
      has_intraday: true,
      has_no_volume: false,
      session: "24x7",
      timezone: "Europe/Athens",
      exchange: "tradEAsy",
      minmov: 1,
      has_weekly_and_monthly: true,
      volume_precision: 2,
      data_status: "streaming",
      supported_resolutions: configurationData.supported_resolutions
    }
    onSymbolResolvedCallback(symbolInfo);
  },

  getBars: async (
    symbolInfo,
    resolution,
    from,
    to,
    onHistoryCallback,
    onErrorCallback,
    firstDataRequest
  ) => {
    const resName = sendResolutions[resolution];
    try {

      const url = `https://api.twelvedata.com/time_series?symbol=${symbolInfo.name}&outputsize=1000&interval=${resName}&apikey=${API_KEY}`;

      const response = await fetch(url);
      const data = await response.json();

      if (!data.values.length) {
        onHistoryCallback([], { noData: true });
      }

      let bars = data.values.map((el) => {
        let dd = new Date(el.datetime);
        return {
          time: dd.getTime(), //TradingView requires bar time in ms
          low: el.low,
          high: el.high,
          open: el.open,
          close: el.close,
          volume: el.volume,
        };
      });
      bars = bars.sort(function (a, b) {
        if (a.time < b.time) return -1;
        else if (a.time > b.time) return 1;
        return 0;
      });

      latestBar = bars[bars.length - 1];
      console.log('[latestBar]', latestBar);

      onHistoryCallback(bars, { noData: false });
    } catch (error) {
      onErrorCallback(error);
    }
  },
  subscribeBars: (symbolInfo, resolution, onRealtimeCallback, subscribeUID, onResetCacheNeededCallback) => {

    const resName = sendResolutions[resolution];
    const symbolName = symbolInfo.name;
    console.log('[rec]', symbolInfo.name, resolution, resName)

    try {
      // const url = `https://api.twelvedata.com/time_series?symbol=${symbolInfo.name}&outputsize=10&interval=${resName}&apikey=${API_KEY}`;

      let ws = new WebSocket(`wss://ws.twelvedata.com/v1/quotes/price?apikey=${API_KEY}`);

      ws.onopen = (e) => {
        console.log('[ws onopen]');
        let sendData = {
          "action": "subscribe",
          "params": {
            "symbols": [{
              "symbol": "AAPL",
              "exchange": "NASDAQ",
              "price": true
            }],
            "event": "price"
          }
        }
        ws.send(JSON.stringify(sendData));
      }

      ws.onmessage = e => {
        let transaction = JSON.parse(e.data);
        // payload = payload.success;

        console.log('[onmsg]', transaction);
        if (transaction.event == 'price') {
          const seconds = INTERVAL_SECONDS[convertResolution(resolution)]

          var txTime = Math.floor(transaction.timestamp / seconds) * seconds
          console.log(latestBar.time, txTime * 1000);

          var current = new Date();
          var d_time = (current.getDate() * 86400 + current.getHours() * 3600 + current.getMinutes() * 60) - (current.getUTCDate() * 86400 + current.getUTCHours() * 3600 + current.getUTCMinutes() * 60)
          console.log("d_time", d_time);

          if (latestBar && txTime * 1000 == latestBar.time - d_time * 1000) {
            latestBar.close = transaction.price
            if (transaction.price > latestBar.high) {
              latestBar.high = transaction.price
            }

            if (transaction.price < latestBar.low) {
              latestBar.low = transaction.price
            }

            latestBar.volume += transaction.day_volume
            console.log(latestBar)
            onRealtimeCallback(latestBar)
          } else if (latestBar && txTime * 1000 > latestBar.time - d_time * 1000) {
            const newBar = {
              low: transaction.price,
              high: transaction.price,
              open: transaction.price,
              close: transaction.price,
              volume: transaction.day_volume,
              time: txTime * 1000 + current.getTime()
            }
            latestBar = newBar
            console.log(newBar)
            onRealtimeCallback(newBar)
          }

          // lastBar.time 
        }

      }

      ws.onclose = function () {
        console.log('[onclose]');
      }

    } catch (err) {
      console.log(err);
    }
    // Code here...
    window.resetCacheNeededCallback = onResetCacheNeededCallback;
  },
  unsubscribeBars: (subscriberUID) => {
    // Code here...
  },
};
