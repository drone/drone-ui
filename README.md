![builds](https://travis-ci.org/laszlocph/drone-ui.svg?branch=master)

This project is an edge fork of the https://github.com/drone/drone-ui project.

Its goal is to incorporate PRs more eagerly than the upstream drone-ui project.

There is no guiding principle behind what PRs are getting merged, it is driven by Laszlo's needs. But in general high quality PRs that improve the UX of the platform are always considered.

If you want a feature badly in Drone, please voice your needs on the usual channels: either on https://discourse.drone.io or the upstream project's issues at https://github.com/drone/drone-ui/issues. A PR can make it here if it reaches my sight on the **official channels**, and I like it.

## What's in it?

* https://github.com/drone/drone-ui/pull/201<br/>
  Horizontal menu with restart and cancel buttons. No more hamburger menu. This is a MUST.
  ![horizontal menu](https://user-images.githubusercontent.com/8408911/38454285-f8bd0d10-3a6c-11e8-8057-e7b0e27d935f.png)

* https://github.com/drone/drone-ui/pull/199<br/>
  Whenever a build is restarted or repositories are being synchronised, a little notification is shown at the bottom left but it refuses to go away and is stucked there till the page is refreshed. This PR makes sure it is only active for 5 seconds, afterwards the notification disappears.

* https://github.com/drone/drone-ui/pull/196<br/>
  Render line breaks in commit messages.

## Try it locally

In case you like to see this build before using it on your deployment, run a devserver with watching, hotreloading and proxy to drone server:

```text
git clone git@github.com:laszlocph/drone-ui.git
yarn install

export DRONE_SERVER=<drone server>
export DRONE_TOKEN=<drone api token>

yarn run start
```

Note you will need to retrieve your drone user token from the tokens screen in the drone user interface. When the server is running you can open the following url in your browser:

```text
http://localhost:9999
```

## Run this fork

### Use a Docker image

```diff
version: '2'

services:
  drone-server:
    image: drone/drone:0.8.5

    ports:
      - 443:443
      - 9000:9000
    volumes:
      - /var/lib/drone:/var/lib/drone/
+     - drone-ui:/drone-ui
    restart: always
    environment:
      ...
+     - DRONE_WWW=/drone-ui

+ drone-ui:
+   image: laszlocloud/drone-ui:1
+   volumes:
+     - drone-ui:/drone-ui

+volumes:
+ drone-ui:
```


### Build from source

Check out and build the project:

```
yarn build
```

Then scp the contents of the dist/files folder to your drone server node.

```
scp -rp dist/files/* user@server-ip:~/drone-ui/
```

Add `DRONE_WWW` variable with the location of the uploaded files in your `docker-compose.yml` to use the edge fork.

```diff
version: '2'

services:
  drone-server:
    image: drone/drone:0.8.5

    ports:
      - 443:443
      - 9000:9000
    volumes:
      - /var/lib/drone:/var/lib/drone/
+     - /home/youruser/drone-ui:/drone-ui
    restart: always
    environment:
      ...
+     - DRONE_WWW=/drone-ui
```


Restart your server.
