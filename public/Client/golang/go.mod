module github.com/retryingoos/client

go 1.16

require (
	github.com/gorilla/websocket v1.4.2
	github.com/nytesoftware/utls v0.0.0-20210501005601-0ec654898ffe
	github.com/refraction-networking/utls v0.0.0-20201210053706-2179f286686b
	github.com/zMrKrabz/fhttp v0.0.0-20210524014024-c3cbbc598760
	golang.org/x/crypto v0.0.0-20210513164829-c07d793c2f9a // indirect
	golang.org/x/net v0.0.0-20210521195947-fe42d452be8f
)

// replace golang.org/x/net/http2 => ./net/http2
