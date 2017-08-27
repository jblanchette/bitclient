$(function () {

    console.log("Started bitclient");
    var vmData = {
        focusCoin: null,
        focusTicker: null,
        focusMarketHistory: null,
        focusPriceData: null,
        balances: null
    };

    var HomeCtrl = {
        getBalances: function () {
            console.log("Getting balances...");

            var self = this;
            console.log("Self is: ", self);

            request("/balances", "GET")
                .done(function (data) {
                    console.log("Got data: ", data);

                    self.balances = data;
                })
                .fail(function (err) {
                    console.error("Net Error: ", err);
                });
        },
        getTicker: Promise.method(function (tickerName) {
            console.log("Fetching ticker for: ", tickerName);
            return request("/ticker", "GET", { tickerName: tickerName });
        }),
        getMarketHistory: Promise.method(function (tickerName) {
            console.log("Fetching market history for: ", tickerName);
            return request("/market-history", "GET", { tickerName: tickerName });
        }),
        getPriceData: Promise.method(function (tickerName) {
            console.log("Fetching market price data for: ", tickerName);
            return request("/price-data", "GET", { tickerName: tickerName, interval: "oneMin" });
        }),
        selectCoin: function (coin) {
            var self = this;
            self.focusCoin = coin;
            
            if (coin) {
                var currency = "BTC-" + _.get(coin, "Currency");
                self.getTicker(currency).then(self.setFocusTicker);
                self.getMarketHistory(currency).then(self.setFocusMarketHistory);
                self.getPriceData(currency).then(self.setFocusPriceData);
            }
        },
        setFocusTicker: function (data) {
            this.focusTicker = data;
        },
        setFocusMarketHistory: function (data) {
            this.focusMarketHistory = data;
        },
        setFocusPriceData: function (data) {
            this.focusPriceData = data;
        }
    };

    var vm = new Vue({
        el: ".wrapper",
        data: vmData,
        methods: HomeCtrl
    });
});
