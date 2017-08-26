package main

import (
    "os"
    "fmt"
    "encoding/json"
    "github.com/toorop/go-bittrex"
)

type ExchangeConfiguration struct {
    Key     string
    Secret  string
}

func LoadConfig() ExchangeConfiguration {
    file, _ := os.Open("apiconfig.json")
    decoder := json.NewDecoder(file)
    configuration := ExchangeConfiguration{}
    err := decoder.Decode(&configuration)
    
    if err != nil {
      fmt.Println("error:", err)
    }

    return configuration
}

func NewExchange() *bittrex.Bittrex {
    configuration := LoadConfig()

    fmt.Println("Using config: ", configuration)
    var exchange = bittrex.New(configuration.Key, configuration.Secret)
    return exchange
}