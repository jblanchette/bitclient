package main

import (
	"fmt"
	"net/http"
	"encoding/json"
	"github.com/toorop/go-bittrex"
)

func Balance (exchange *bittrex.Bittrex) http.HandlerFunc {
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