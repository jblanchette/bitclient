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
        "Balance",
        "GET",
        "/balance",
        Balance(exchange),
    },
}