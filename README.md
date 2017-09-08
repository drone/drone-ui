
The following commands are using to build, test and package the project:

```sh
yarn install    # install project dependencies

yarn run start  # starts the development webserver
yarn run format # formats the codebase
yarn run lint   # lints the codebase
yarn run test   # tests the codebase
yarn run build  # builds the production bundle
```

The development webserver requires the following parameters:

```nohighlight
DRONE_SERVER=http://your.drone.server
DRONE_TOKEN=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZX...
```
