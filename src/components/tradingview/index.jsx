/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import Datafeed from "./datafeed";

const Chart = (props) => {

  const { symbol, interval, width, height } = props;

  const [tvWidget, setTVWidget] = useState(null);

  useEffect(() => {
    if (symbol && interval) {
      console.log('[entered]');
      var disabledFeatures = [
        // "header_symbol_search",
        // "header_compare",
        // "header_saveload",
        // // "timeframes_toolbar",
        // // "legend_widget",
        // "main_series_scale_menu",
        // "header_settings",
        // "header_resolutions",
        // "header_screenshot",
        // "header_undo_redo",
      ];
      // if (!isHistory) disabledFeatures.push("timeframes_toolbar");

      // eslint-disable-next-line no-undef
      const widget = (window.tvWidget = new TradingView.widget({
        symbol: symbol,
        interval: interval,
        fullscreen: false,
        width: "100%",
        height: "100%",
        container_id: "tv_chart_container",
        datafeed: Datafeed,
        library_path: "/charting_library/",
        overrides: {
          "paneProperties.vertGridProperties.color": "#E3E3E5", // Grid Vertical Lines Color
          "paneProperties.horzGridProperties.color": "#E3E3E5", // Grid Horizontal Lines Color
          "mainSeriesProperties.candleStyle.upColor": "#11CC9A", // Up Candle Color
          "mainSeriesProperties.candleStyle.downColor": "#E20E7C", // Down Candle Color
          "mainSeriesProperties.candleStyle.borderUpColor": "#11CC9A", // Up Candle Border Color
          "mainSeriesProperties.candleStyle.borderDownColor": "#E20E7C", // Down Candle Border Color
          "mainSeriesProperties.candleStyle.drawBorder": false, // Disable candle borders
        },
        disabled_features: disabledFeatures,
        time_frames: [],
      }));

      widget.onChartReady(async () => {
        widget
          .activeChart()
          .onVisibleRangeChanged()
          .subscribe(null, ({ from, to }) => {

          });
      });

      setTVWidget(widget);
    }
  }, [symbol, interval]);
  return <div id="tv_chart_container" height={height} width={width} style={{height: 500}}></div>;
}

export default Chart;