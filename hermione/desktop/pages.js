const assert = require("chai").assert;

describe("desktop pages", function() {
  it("home", function() {
    return this.browser
      .url("/")
      .waitForVueLoaded()
      .assertView("plain", "body");
  });
});