package main

import (
	"encoding/json"
	"flag"
	"io/ioutil"
	"log"
	"net/url"
	"os"
	"runtime"

	http "github.com/useflyent/fhttp"

	"strings"
	"time"

	"github.com/gorilla/websocket"
)

type Options struct {
	URL          string            `json:"url"`
	Method       string            `json:"method"`
	Headers      map[string]string `json:"headers"`
	Body         string            `json:"body"`
	Ja3          string            `json:"ja3"`
	UserAgent    string            `json:"userAgent"`
	Proxy        string            `json:"proxy"`
	Cookies      []Cookie          `json:"cookies"`
	HeaderOrder  []string          `json:"headerOrder"`
	PHeaderOrder []string          `json:"PHeaderOrder"`
}

type cycleTLSRequest struct {
	RequestID string  `json:"requestId"`
	Options   Options `json:"options"`
}

//rename to request+client+options
type fullRequest struct {
	req     *http.Request
	client  http.Client
	options cycleTLSRequest
}

type Response struct {
	Status  int
	Body    interface{}
	Headers map[string]string
}

type cycleTLSResponse struct {
	RequestID string
	Response  Response
}
type cycleTLS struct {
	ReqChan  chan fullRequest
	RespChan chan cycleTLSResponse
}

func getWebsocketAddr() string {
	port, exists := os.LookupEnv("WS_PORT")

	var addr *string

	if exists {
		addr = flag.String("addr", "localhost:"+port, "http service address")
	} else {
		addr = flag.String("addr", "localhost:9112", "http service address")
	}
	u := url.URL{Scheme: "ws", Host: *addr, Path: "/"}

	return u.String()
}

func processRequest(request cycleTLSRequest) (result fullRequest) {

	var browser = browser{
		JA3:       request.Options.Ja3,
		UserAgent: request.Options.UserAgent,
		Cookies:   request.Options.Cookies,
	}

	client, err := newClient(browser, request.Options.Proxy)
	if err != nil {
		log.Fatal(err)
	}
	req, err := http.NewRequest(strings.ToUpper(request.Options.Method), request.Options.URL, strings.NewReader(request.Options.Body))
	if err != nil {
		return
	}

	// // req.Header = {}

	// // for _, HeaderValue := range request.Options.HeaderOrder {
	// // 	req.Header.Add("Header-Order:", HeaderValue)
	// // }

	// // request.Options.HeaderOrder = []string{}

	// // for _, PHeaderValue := range []string{":method", ":authority", ":scheme", ":path"} {
	// // 	req.Header.Add(http.PHeaderOrderKey, PHeaderValue)
	// // }
	// // request.Options.PHeaderOrder = []string{}
	// // request.Options.HeaderOrder = []string{}

	// for k, v := range request.Options.Headers {
	// 	if k != "host" {
	// 		req.Header.Set(k, v)
	// 	}
	// }

	// // lowerCaseHeader := make(http.Header)

	// // for key, value := range req.Header {
	// // 	lowerCaseHeader[strings.ToLower(key)] = value
	// // }

	// // req.Header = lowerCaseHeader
	// // fmt.Println(req.Header)
	// // log.Println(req.Header)

	masterheaderorder := []string{
		"host",
		"connection",
		"cache-control",
		"device-memory",
		"viewport-width",
		"rtt",
		"downlink",
		"ect",
		"sec-ch-ua",
		"sec-ch-ua-mobile",
		"sec-ch-ua-full-version",
		"sec-ch-ua-arch",
		"sec-ch-ua-platform",
		"sec-ch-ua-platform-version",
		"sec-ch-ua-model",
		"upgrade-insecure-requests",
		"user-agent",
		"accept",
		"sec-fetch-site",
		"sec-fetch-mode",
		"sec-fetch-user",
		"sec-fetch-dest",
		"referer",
		"accept-encoding",
		"accept-language",
		"cookie",
	}
	headermap := make(map[string]string)

	headerorderkey := []string{}
	for _, key := range masterheaderorder {
		for k, v := range request.Options.Headers {
			lowercasekey := strings.ToLower(k)
			if key == lowercasekey {
				headermap[k] = v
				headerorderkey = append(headerorderkey, lowercasekey)
			}
		}

	}
	//if master header order doesn't contain the header, add it to the end
	for k, v := range request.Options.Headers {
		if _, ok := headermap[k]; !ok {
			headermap[k] = v
			headerorderkey = append(headerorderkey, strings.ToLower(k))
		}
	}
	req.Header = http.Header{
		http.HeaderOrderKey:  headerorderkey,
		http.PHeaderOrderKey: {":method", ":authority", ":scheme", ":path"},
	}
	for k, v := range headermap {
		req.Header.Set(k, v)
	}
	return fullRequest{req: req, client: client, options: request}

}

func dispatcher(res fullRequest) (response cycleTLSResponse) {
	resp, err := res.client.Do(res.req)
	if err != nil {
		log.Print("Request Failed: " + err.Error())
		return cycleTLSResponse{res.options.RequestID, Response{
			Status:  400,
			Body:    "HTTP REQUEST FAILED",
			Headers: map[string]string{"Status": "Failed"},
		},
		}
	}
	defer resp.Body.Close()
	bodyBytes, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		log.Print("Parse Bytes" + err.Error())
	}

	headers := make(map[string]string)

	for name, values := range resp.Header {
		if name == "Set-Cookie" {
			headers[name] = strings.Join(values, "/,/")
		} else {
			for _, value := range values {
				headers[name] = value
			}
		}
	}

	Response := Response{resp.StatusCode, string(bodyBytes), headers}
	return cycleTLSResponse{res.options.RequestID, Response}
}

func (client cycleTLS) Queue(URL string, options Options, Method string) {

	options.URL = URL

	opt := cycleTLSRequest{"n", options}
	response := processRequest(opt)
	client.ReqChan <- response
}

func (client cycleTLS) Do(URL string, options Options, Method string) (response cycleTLSResponse) {

	options.URL = URL

	opt := cycleTLSRequest{"n", options}

	res := processRequest(opt)
	response = dispatcher(res)

	return
}

func Init(workers ...bool) *cycleTLS {

	if len(workers) > 0 && workers[0] {
		reqChan := make(chan fullRequest)
		respChan := make(chan cycleTLSResponse)
		go workerPool(reqChan, respChan)
		log.Println("Worker Pool Started")

		return &cycleTLS{ReqChan: reqChan, RespChan: respChan}
	} else {
		return &cycleTLS{}
	}

}

func (client cycleTLS) Close() {
	close(client.ReqChan)
	close(client.RespChan)

}

// Worker Pool
func workerPool(reqChan chan fullRequest, respChan chan cycleTLSResponse) {
	//MAX 300? previously 200
	for i := 0; i < 200; i++ {
		go worker(reqChan, respChan)
	}
}

// Worker
func worker(reqChan chan fullRequest, respChan chan cycleTLSResponse) {
	for res := range reqChan {
		response := dispatcher(res)
		respChan <- response
	}
}

func readSocket(reqChan chan fullRequest, c *websocket.Conn) {
	for {
		_, message, err := c.ReadMessage()
		if err != nil {
			log.Print(err)
			continue
		}
		request := new(cycleTLSRequest)

		err = json.Unmarshal(message, &request)
		if err != nil {
			log.Print(err)
			return
		}

		reply := processRequest(*request)

		reqChan <- reply
	}
}

func writeSocket(respChan chan cycleTLSResponse, c *websocket.Conn) {
	for {
		select {
		case r := <-respChan:
			message, err := json.Marshal(r)
			if err != nil {
				log.Print("Marshal Json Failed" + err.Error())
				continue
			}
			err = c.WriteMessage(websocket.TextMessage, message)
			if err != nil {
				log.Print("Socket WriteMessage Failed" + err.Error())
				continue
			}

		default:
		}

	}
}

func main() {

	runtime.GOMAXPROCS(runtime.NumCPU() * 2)

	start := time.Now()
	defer func() {
		log.Println("Execution Time: ", time.Since(start))
	}()

	websocketAddress := getWebsocketAddr()
	c, _, err := websocket.DefaultDialer.Dial(websocketAddress, nil)
	if err != nil {
		log.Print(err)
		return
	}

	reqChan := make(chan fullRequest)
	respChan := make(chan cycleTLSResponse)
	go workerPool(reqChan, respChan)

	go readSocket(reqChan, c)
	//run as main thread
	writeSocket(respChan, c)

}
