module.exports = [];

require("fs").readdirSync(__dirname).forEach(function(file) {
  module.exports.push = require("./" + file);
});