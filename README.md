# bitclient

A go-lang based utility server for interacting with cryptocurrency exchanges.

Currently targeting support for Bittrex.

# setup

Create a file in `server` named `apiconfig.json` with the following JSON structure:

```
{
	"Key": "API_KEY",
	"Secret": "API_SECRET"
}
```

# building and running

*build:*

`cd server`
`go build`

*run:*

`server.exe`
