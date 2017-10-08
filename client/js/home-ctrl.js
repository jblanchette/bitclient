$(function () {

    console.log("Started bitclient");
    var vmData = {
        focusCoin: null,
        focusCoinInfo: {
            coin: null,
            ticker: null,
            marketHistory: null,
            priceData: null,
            signal: null,
            lineGraph: null
        },
        coinGraph: {
            interval: "oneMin",
            rangeStart: null,
            rangeEnd: null
        },
        balances: null
    };

    var coinRoutes = {
        "ticker": "/ticker",
        "balances": "/balances",
        "marketHistory": "/market-history",
        "priceData": "/price-data"
    };

    var coinSignalsMap = [
        {
            "y": "L",
            "label": "low",
            "color": "blue"
        },
        {
            "y": "H",
            "label": "high",
            "color": "red"
        },
        {
            "y": "C",
            "label": "current",
            "color": "black"
        }
    ];

    var coinCanvasId = "coinGraph";
    var coinCanvasWidth = 650;
    var coinCanvasHeight = 600;

    var HomeCtrl = {
        getBalances: function () {
            console.time("balances");
            var self = this;

            request("/balances", "GET")
                .done(function (data) {
                    self.balances = data;
                    console.timeEnd("balances");
                })
                .fail(function (err) {
                    console.error("Failed to fetch balances:", err);
                });
        },
        fetchCoinData: Promise.method( function (tickerName, coinKey) {
            var route = _.get(coinRoutes, coinKey);
            var coinObj = {
                tickerName: tickerName
            };

            if (coinKey === "priceData") {
                // todo get the interval from some UI / config?
                coinObj.interval = this.coinGraph.interval;       
            }

            return request(route, "GET", coinObj)
                .then(function (data) {
                    return {
                        coinKey: coinKey,
                        data: data
                    };
                });
        }),
        selectCoin: function (coin) {
            var self = this;
            self.focusCoin = coin;
            
            if (coin) {
                var tickerName = "BTC-" + _.get(coin, "Currency");

                console.time("coinFetch");
                return Promise.all(_.map(["ticker", "marketHistory", "priceData"], function (coinKey) {
                    return self.fetchCoinData(tickerName, coinKey)
                        .then(self.setCoinInfo);
                })).then(self.selectCoinHandler);
            }
        },
        selectCoinHandler: function () {
            console.timeEnd("coinFetch");

            var self = this;
            var coin = self.focusCoin;
            var priceData = self.focusCoinInfo.priceData;

            if (!coin || !priceData) {
                return;
            }

            var signals = _.map(coinSignalsMap, function (opts) {
                var coinSignal = new Signal(opts);
                coinSignal.create(priceData);

                return coinSignal;
            });

            var lineGraph = new LineGraph(coinCanvasWidth, coinCanvasHeight, coinCanvasId, signals);
            self.setCoinInfo({
                coinKey: "lineGraph",
                data: lineGraph
            });

            // set the range start,end from at least one signal
            var focusRange = lineGraph.getFocusRange();
            self.coinGraph.rangeStart = focusRange.start;
            self.coinGraph.rangeEnd = focusRange.end;

            var msToHours = 3600 * 1000;
            var actualRange = lineGraph.getActualRange();
            
            self.coinGraph.rangeMinStart = actualRange.start;
            self.coinGraph.rangeMaxStart = actualRange.end;

            self.coinGraph.rangeMinEnd = actualRange.start;
            self.coinGraph.rangeMAxEnd = actualRange.end;

            self.renderCoin();
        },
        setCoinInfo: function (info) {
            this.focusCoinInfo[info.coinKey] = info.data;
        },
        setControl: function (key) {
            var self = this;

            switch (key) {
                case "rangeStart":
                case "rangeEnd":
                    var lineGraph = _.get(self.focusCoinInfo, "lineGraph");

                    if (lineGraph) {
                        lineGraph.setFocusRange({
                            start: moment(self.coinGraph.rangeStart),
                            end: moment(self.coinGraph.rangeEnd)
                        });
                    }
                break;
                case "interval":
                    var interval = _.get(self.coinGraph, "interval");
                    var tickerName = "BTC-" + _.get(self.focusCoin, "Currency");

                    console.log("fetch: ", interval, "ticker: ", tickerName);

                    console.time("coinFetch");
                    self.fetchCoinData(tickerName, "priceData")
                        .then(self.setCoinInfo)
                        .then(self.selectCoinHandler);
                break;
            };

        },
        renderCoin: function () {
            var lineGraph = this.focusCoinInfo.lineGraph;
            if (lineGraph) {
                lineGraph.render();
            }
        }
    };

    var vm = new Vue({
        el: ".wrapper",
        data: vmData,
        methods: HomeCtrl
    });
});
