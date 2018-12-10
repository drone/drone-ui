# drone-ui

## Configuration

Create a `.env.development.local` file with the drone server address (no trailing slash) and your drone user token:

```
VUE_APP_DRONE_SERVER=https://drone.company.com
VUE_APP_DRONE_TOKEN=f0af17449a83681de22db7ce16672f16
```

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Run your tests
```
ngrok

npm run test -- --base-url=http://ea196810.ngrok.io
# OR
npm run test-ui -- --base-url=http://ea196810.ngrok.io
```

### Lints and fixes files
```
npm run lint
```
