const commands = require('./hermione/commands');

module.exports = {
  baseUrl: 'http://localhost:8080',
  gridUrl: 'http://promakh.ru:4444/wd/hub',

  sets: {
    desktop: {
      files: 'hermione/desktop'
    }
  },

  browsers: {
    chrome: {
      compositeImage: true,
      desiredCapabilities: {
        browserName: 'chrome', // this browser should be installed on your OS
        loggingPrefs: {
          'driver': 'INFO',
          'browser': 'INFO'
        }
      }
    }
  },

  plugins: {
    'html-reporter/hermione': {
      enabled: true,
      path: 'hermione/report',
      defaultView: 'all',
    }
  },

  prepareBrowser: (browser) => {
    commands.forEach(({ name, func }) => browser.addCommand(name, func))
  }
};