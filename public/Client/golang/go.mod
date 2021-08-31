module tls

go 1.16

require (
	github.com/gorilla/websocket v1.4.2
	github.com/nytesoftware/utls v0.0.0-20210501005601-0ec654898ffe
	github.com/useflyent/fhttp v0.0.0-20210801005649-f160dd923789
	golang.org/x/crypto v0.0.0-20210513164829-c07d793c2f9a // indirect
	golang.org/x/net v0.0.0-20210610132358-84b48f89b13b
)

// replace golang.org/x/net/http2 => ./net/http2
