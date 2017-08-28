$(function () {

    console.log("Started bitclient");
    var vmData = {
        focusCoin: null,
        focusCoinInfo: {
            coin: null,
            ticker: null,
            marketHistory: null,
            priceData: null
        },
        balances: null
    };

    var coinRoutes = {
        "ticker": "/ticker",
        "balances": "/balances",
        "marketHistory": "/market-history",
        "priceData": "/price-data"
    };

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
        fetchCoinData: Promise.method( function (tickerName, coinInfo) {
            var route = _.get(coinRoutes, coinInfo);
            var coinObj = {
                tickerName: tickerName
            };

            if (coinInfo === "priceData") {
                // todo get the interval from some UI / config?
                coinObj.interval = "oneMin";        
            }

            return request(route, "GET", coinObj)
                .then(function (data) {
                    return {
                        coinInfo: coinInfo,
                        data: data
                    };
                });
        }),
        selectCoin: function (coin) {
            var self = this;
            self.focusCoin = coin;
            
            if (coin) {
                var tickerName = "BTC-" + _.get(coin, "Currency");
                return _.map(["ticker", "marketHistory", "priceData"], function (coinInfo) {
                    self.fetchCoinData(tickerName, coinInfo)
                        .then(self.setCoinInfo);
                });
            }
        },
        setCoinInfo: function (info) {
            console.log("Coin info: ", info);
            this.focusCoinInfo[info.coinInfo] = info.data;
        }
    };

    var vm = new Vue({
        el: ".wrapper",
        data: vmData,
        methods: HomeCtrl
    });
});
