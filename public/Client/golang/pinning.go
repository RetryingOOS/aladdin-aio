package main

import (
	"crypto/tls"
	"errors"
	"fmt"
	"sync"

	"github.com/tam7t/hpkp"
)

type PinnedSites struct {
	Host   string
	Pins   []string
	Failed bool
}

func (p *SSLPinner) GeneratePins(pinChannel chan PinnedSite) {
	var wait sync.WaitGroup

	for _, h := range p.Hosts {
		wait.Add(1)
		//--- Concurrent because it's go, so that means its ez ( and we like speed )
		go func(w *sync.WaitGroup, host string) {
			defer Crash("GeneratePin")
			defer w.Done()
			if pins, err := GetSSLPins(host + ":443"); err == nil {
				pinChannel <- PinnedSite{Host: host, Pins: pins}
			} else {
				pinChannel <- PinnedSite{Failed: true}
			}

		}(&wait, h)
	}

	go func() {
		defer Crash("HandleDone")
		wait.Wait()
		close(pinChannel)
	}()
}

func GetSSLPins(server string) ([]string, error) {
	var pins []string
	conn, err := tls.Dial("tcp", server, &tls.Config{InsecureSkipVerify: true})
	if err != nil {
		return pins, err
	}

	for _, cert := range conn.ConnectionState().PeerCertificates {
		pins = append(pins, hpkp.Fingerprint(cert))
	}

	return pins, nil
}

func (p *SSLPinner) CreateDialer() error {
	pinChannel := make(chan PinnedSite, 1000)

	//fmt.Println("Generating pins!")

	go p.GeneratePins(pinChannel)

	s := hpkp.NewMemStorage()

	for pinned := range pinChannel {
		if pinned.Failed && p.RequireAll {
			return errors.New("Error creating secure client!")
		}

		//fmt.Println(pinned.Host, "Secured -", len(pinned.Pins), "generated")

		s.Add(pinned.Host, &hpkp.Header{
			Permanent:  true,
			Sha256Pins: pinned.Pins,
		})
	}

	p.DialerConfig = &hpkp.DialerConfig{
		Storage:   s,
		PinOnly:   true,
		TLSConfig: nil,
		Reporter: func(p *hpkp.PinFailure, reportUri string) {
			//fmt.Println("Pin failure: ", p)
		},
	}

	return nil
}

type SSLPinner struct {
	RequireAll bool     //--- Require all pins to be generated properly
	Hosts      []string //--- List of hosts pinned/to pin

	DialerConfig   *hpkp.DialerConfig
	BadPinDetected func(string)
}

func New(hosts []string, requireAll bool, badPinDetected func(p string)) (*SSLPinner, error) {
	pinner := &SSLPinner{
		Hosts:          hosts,
		RequireAll:     requireAll,
		BadPinDetected: badPinDetected,
	}

	err := pinner.CreateDialer()

	return pinner, err
}

//--- Most useful function in go
func Crash(parent string) {
	if r := recover(); r != nil { //---Handle crashes
		fmt.Printf("%v Crashed!!!!\nError: %v", parent, r)
	}
}
