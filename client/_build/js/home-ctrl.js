$(function () {

    console.log("Started bitclient");
    var vmData = {
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
                })
                .fail(function (err) {
                    console.error("Net Error: ", err);
                });
        }
    };

    var vm = new Vue({
        el: ".wrapper",
        data: vmData,
        methods: HomeCtrl
    });
});
