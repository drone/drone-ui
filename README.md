# drone-ui

This project is a proposal for a react-based user interface for Drone. I am making this public for individuals that have expressed interest in helping accelerate these efforts. This codebase is in very **early stages** and largely **non-functioning**, so please set your expectations accordingly.

This codebase will eventually be moved to the [drone/drone](https://github.com/drone/drone) once it is stable and functional.

## Building

```bash
npm install
npm run build
```

This is currently being tested on `node v5.5.0`

## Running

* Log into your drone account on your drone host and obaint a personal token.
* Copy the `drone.json.sample` to `drone.json`.
* Enter your drone data into the `drone.json`, that is the host, token, id, username and email.
* Install node dependencies with `npm install`.
* Start webpack dev server with `npm start`.
* Open [http://localhost:9000](http://localhost:9000).

You will see the

* dashboard,
* repository dashboard and
* build output page.

## Setup Gogs and drone with docker for development

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
