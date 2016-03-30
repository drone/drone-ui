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
```

To run the proxy server you must provide the location of your drone server (scheme and hostname) and your Drone API token for authentication. You can get your Drone API token from your profile page.

```
go run server.go --scheme <drone scheme>  \
                 --addr   <drone address> \
                 --token  <drone api token>
```

When the server is running you can open the following url in your browser:

```
http://localhost:9000
```
