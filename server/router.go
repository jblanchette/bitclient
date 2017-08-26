package main

import (
    "log"
    "net/http"
    "github.com/gorilla/mux"
    "github.com/gorilla/handlers"
)

func NewRouter() *mux.Router {
    router := mux.NewRouter().StrictSlash(true)

    for _, route := range routes {
        var handler http.Handler
        handler = route.HandlerFunc
        handler = Logger(handler, route.Name)

        router.
            Methods(route.Method).
            Path(route.Pattern).
            Name(route.Name).
            Handler(handler)

    }

    return router
}

func StartServer() {
    router := NewRouter()

    headersOk := handlers.AllowedHeaders([]string{"Origin, X-Requested-With, Content-Type, Accept"})
    originsOk := handlers.AllowedOrigins([]string{"*"})
    methodsOk := handlers.AllowedMethods([]string{"GET", "HEAD", "POST", "PUT", "OPTIONS"})

    log.Fatal(http.ListenAndServe(":8081", handlers.CORS(headersOk, originsOk, methodsOk)(router)))
}