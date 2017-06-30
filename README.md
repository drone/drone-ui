Install tooling:

```
npm -g install bower
npm -g install polymer-cli
```

Install dependencies:

```
bower install
```

Execute unit tests:

```
polymer test
```

Serve the application:

```
polymer serve
```

Build the application:

```
polymer build
```

Serve the application from drone:

```
DRONE_WWW=/path/to/drone-ui drone-server
```

Serve the bundled application from drone:

```
DRONE_WWW=/path/to/drone-ui/build/default drone-server
```
