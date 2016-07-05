# drone-ui

This project is a proposal for a react-based user interface for Drone. I am making this public for individuals that have expressed interest in helping accelerate these efforts. This codebase is in very **early stages** and largely **non-functioning**, so please set your expectations accordingly.

This codebase will eventually be moved to the [drone/drone](https://github.com/drone/drone) once it is stable and functional.

## Building

```bash
make
```

This is currently being tested on `node v5.5.0`

## Running

To test the experimental user interface with Drone we have created a simple proxy server. This will proxy requests from the react application to a real Drone instance. Before running the proxy server you must download dependencies:

```
go get github.com/drone/drone-go/drone
go get github.com/koding/websocketproxy
```

To run the proxy server you must provide the location of your drone server (scheme and hostname) and your Drone API token for authentication. You can get your Drone API token from your profile page.

```
go run server.go --scheme <drone scheme>  \
                 --host   <drone address> \
                 --token  <drone api token>
```

When the server is running you can open the following url in your browser:

```
http://localhost:9000
```

* dashboard
* repository dashboard 
* build output page

## Setup a Development Environment

If you don't have a drone v0.5 setup and running you can do so with `docker-compose`.
At first you need to make sure that docker and docker-compose are installed and running.

Just run `docker-compose up` in a separate terminal and it will start [Gogs](https://github.com/gogits/gogs) and drone v0.5.

#### Gogs

Now you have to setup Gogs. Gogs runs on `http://localhost:3000`. Just open that in your browser.
All you need to change is to set the _Database Type_ to SQLite3.
Don't forget to create an admin account at the bottom of the page to be able to login. You can use simple credentials for development.

#### drone

Open `localhost:8000` in your browser and login with the Gogs credentials.
Get your personal token at `http://localhost:8000/settings/profile`.

Now start the proxy to run the app like:
```
go run server.go --host=localhost:8000 --token=DRONE_TOKEN
```
