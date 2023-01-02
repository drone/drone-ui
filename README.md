# Drone UI

## Getting started

1. **Clone this repository**

   ```bash
   git clone https://github.com/drone/drone-ui.git
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Copy .env.example and rename it into .env**

   ```bash
   cp .env.example .env.development.local
   ```

4. **Fill required variables. For example:**

   ```text
   REACT_APP_DRONE_SERVER=https://drone.company.com
   REACT_APP_DRONE_TOKEN=<your_drone_token> // find your token in your Drone account settings (click your Avatar in the UI).
   ```

### Run the app in development mode, with hot reloading

```bash
npm run start
```

### Build the app

```bash
npm run build
```

### Run the built app

```bash
npm run serve
```

### Run linters

```bash
npm run lint
```

### Run linters and fix auto fixable problems

```bash
npm run lint:fix
```

### Run your tests

```bash
npm run test
```

## Commits

We use Conventional Commits for commit messages. You can read more about Conventional Commits [here](https://www.conventionalcommits.org/en/v1.0.0/). [Here](https://cheatography.com/albelop/cheat-sheets/conventional-commits/) you can find a useful Conventional Commits Cheat Sheet.

We try to make our commits "atomic". [Here](https://www.freshconsulting.com/atomic-commits/) and [here](https://en.wikipedia.org/wiki/Atomic_commit) you can read more about Atomic commits.

## Release procedure

### Run the changelog generator

```BASH
docker run -it --rm -v "$(pwd)":/usr/local/src/your-app githubchangeloggenerator/github-changelog-generator -u drone -p drone-ui -t <secret github token>
```

You can generate a token by logging into your GitHub account and going to Settings -> Personal access tokens.

Next we tag the PR's with the fixes or enhancements labels. If the PR does not fulfil the requirements, do not add a label.

Run the changelog generator again with the future version according to semver.

```BASH
docker run -it --rm -v "$(pwd)":/usr/local/src/your-app githubchangeloggenerator/github-changelog-generator -u drone -p drone-ui -t <secret token> --future-release v1.0.0
```

### Update the version in the `./package.json` file

```BASH
{
  "name": "drone-ui-react",
  "version": "2.8.2",        <--- update the version here
  "private": true,
  "scripts": {
```

### Build the app and run go generate

```BASH
npm run build
# change to the dist directory
cd dist
# run go generate
GO111MODULE=off go generate ./...
```

This will update the `dist/dist_gen.go` file.

### Create the pull request for the release

Make sure you have updated and added the following files.

* `./package.json`
* `./CHANGELOG.md`
* `dist/dist_gen.go`

Look here for an [example](https://github.com/drone/drone-ui/pull/420)

### Release the new version

Once your PR is reviewed and merged, you can release the new version of the main branch in github.

Please reference the updated changelog in your PR to update `Drone` with the latest UI SHA.

## Community and Support

[Harness Community Slack](https://join.slack.com/t/harnesscommunity/shared_invite/zt-y4hdqh7p-RVuEQyIl5Hcx4Ck8VCvzBw) - Join the #drone slack channel to connect with our engineers and other users running Drone CI.

[Harness Community Forum](https://community.harness.io/) - Ask questions, find answers, and help other users.

[Report A Bug](https://community.harness.io/c/bugs/17) - Find a bug? Please report in our forum under Drone Bugs. Please provide screenshots and steps to reproduce. 

[Events](https://www.meetup.com/harness/) - Keep up to date with Drone events and check out previous events [here](https://www.youtube.com/watch?v=Oq34ImUGcHA&list=PLXsYHFsLmqf3zwelQDAKoVNmLeqcVsD9o).