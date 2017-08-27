package main

import (
	"fmt"
	"net/http"
	"encoding/json"
	"github.com/toorop/go-bittrex"
)

func Balance(exchange *bittrex.Bittrex) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json; charset=UTF-8")
		w.WriteHeader(http.StatusOK)

		balances, err := exchange.GetBalances()
		fmt.Println(err, balances)

		if err := json.NewEncoder(w).Encode(balances); err != nil {
        panic(err)
    }
	}
}

// todo refactor these ?

func Ticker(exchange *bittrex.Bittrex) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json; charset=UTF-8")
		w.WriteHeader(http.StatusOK)

		vals := r.URL.Query()
		tickerName, ok := vals["tickerName"]

		if ok {
			fmt.Println("Fetching ticker for: ", tickerName[0])
			ticker, err := exchange.GetTicker(tickerName[0])
			fmt.Println(err, ticker)

			if err := json.NewEncoder(w).Encode(ticker); err != nil {
	        panic(err)
	    }	
		} else {
			panic("No ticker name provided.")
		}
	}
}

func MarketHistory(exchange *bittrex.Bittrex) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json; charset=UTF-8")
		w.WriteHeader(http.StatusOK)

		vals := r.URL.Query()
		tickerName, ok := vals["tickerName"]

		if ok {
			fmt.Println("Fetching history for: ", tickerName[0])

			marketHistory, err := exchange.GetMarketHistory(tickerName[0])
			fmt.Println(err, marketHistory)

			if err := json.NewEncoder(w).Encode(marketHistory); err != nil {
	        panic(err)
	    }	
		} else {
			panic("No ticker name provided.")
		}
	}
}

func PriceData(exchange *bittrex.Bittrex) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json; charset=UTF-8")
		w.WriteHeader(http.StatusOK)

		vals := r.URL.Query()
		tickerName, ok := vals["tickerName"]
		interval, ok := vals["interval"]

		if ok {
			marketHistory, err := exchange.GetTicks(tickerName[0], interval[0])
			fmt.Println(err, marketHistory)

			if err := json.NewEncoder(w).Encode(marketHistory); err != nil {
	        panic(err)
	    }	
		} else {
			panic("No ticker name provided.")
		}
	}
}
