package main

import (
    "net/http"
)

type Route struct {
    Name        string
    Method      string
    Pattern     string
    HandlerFunc http.HandlerFunc
}

type Routes []Route

// start bittrex client
var exchange = NewExchange()

var routes = Routes{
    Route{
        "Balances",
        "GET",
        "/balances",
        Balance(exchange),
    },
    Route{
        "Ticker",
        "GET",
        "/ticker",
        Ticker(exchange),
    },
    Route{
        "MarketHistory",
        "GET",
        "/market-history",
        MarketHistory(exchange),
    },
    Route{
        "PriceData",
        "GET",
        "/price-data",
        PriceData(exchange),
    },
}