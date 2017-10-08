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
        balances: null
    };

    var coinRoutes = {
        "ticker": "/ticker",
        "balances": "/balances",
        "marketHistory": "/market-history",
        "priceData": "/price-data"
    };

    var coinCanvasId = "coinGraph";
    var coinCanvasWidth = 450;
    var coinCanvasHeight = 400;

    var HomeCtrl = {
        getBalances: function () {
            console.log("Getting balances...");

            var self = this;
            console.log("Self is: ", self);

            request("/balances", "GET")
                .done(function (data) {
                    self.balances = data;
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
                coinObj.interval = "oneMin";        
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
                return Promise.all(_.map(["ticker", "marketHistory", "priceData"], function (coinKey) {
                    return self.fetchCoinData(tickerName, coinKey)
                        .then(self.setCoinInfo);
                })).then(self.selectCoinHandler);
            }
        },
        selectCoinHandler: function () {
            console.log("Done loading, draw canvas.");

            var self = this;
            var coin = self.focusCoin;
            var priceData = self.focusCoinInfo.priceData;

            if (!coin || !priceData) {
                return;
            }

            var coinSignal = new Signal();
            coinSignal.create(priceData);
            

            var lineGraph = new LineGraph(coinCanvasWidth, coinCanvasHeight, coinCanvasId, coinSignal);
            self.setCoinInfo({
                coinKey: "signal",
                data: coinSignal
            });

            self.setCoinInfo({
                coinKey: "lineGraph",
                data: lineGraph
            });

            self.renderCoin();
        },
        setCoinInfo: function (info) {
            this.focusCoinInfo[info.coinKey] = info.data;
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
