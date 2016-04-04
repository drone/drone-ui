package main

import (
	"encoding/json"
	"flag"
	"io/ioutil"
	"log"
	"net/http"
	"net/http/httputil"
	"strings"

	"github.com/drone/drone-go/drone"
)

var (
	host   = flag.String("host", "localhost:8000", "drone url")
	scheme = flag.String("scheme", "http", "drone url scheme. http or https")
	token  = flag.String("token", "", "drone api token from your user profile")
)

func main() {
	flag.Parse()

	// create the drone client and get the Drone user
	client := drone.NewClientToken(*scheme+"://"+*host, *token)
	user, err := client.Self()
	if err != nil {
		log.Fatal(err)
	}
	userJson, err := json.Marshal(user)
	if err != nil {
		log.Fatal(err)
	}

	// serve the static html page
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		index, err := ioutil.ReadFile("index.html")
		if err != nil {
			log.Println(err)
		}
		out := strings.Replace(
			string(index),
			"window.STATE_FROM_SERVER = {}",
			"window.STATE_FROM_SERVER={user:"+string(userJson)+"}", -1)
		w.Write([]byte(out))
	})

	// serve static content from the filesystem
	http.Handle("/static/",
		http.StripPrefix("/static/",
			http.FileServer(
				http.Dir("dist/"),
			),
		),
	)

	// proxy all requests to beta.drone.io
	http.Handle("/api/", &httputil.ReverseProxy{
		Director: func(req *http.Request) {
			req.URL.Scheme = *scheme
			req.URL.Host = *host
			req.Host = *host
			req.Header.Set("X-Forwarded-For", *host)
			req.Header.Set("X-Forwarded-Proto", *scheme)
			req.Header.Set("Authorization", "Bearer "+*token)
		},
	})

	http.ListenAndServe(":9000", nil)
}
