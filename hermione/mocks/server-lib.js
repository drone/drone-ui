const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");

module.exports = {
  webpackDevServerBefore(app) {
    app.use(bodyParser.json());
    app.post("/mocks/save", function(req, res) {
      const { name, data } = req.body;
      const filePath = path.join("./hermione/mocks/data/", name + ".json");
      const fileContent = JSON.stringify(data);

      fs.writeFile(filePath, fileContent, (err) => {
        res.sendStatus(err ? 500 : 200);
      });
    });
  }
};