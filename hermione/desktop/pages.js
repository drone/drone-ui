describe("desktop pages", function() {
  it("login", function() {
    return this.browser
      .url("/login/form")
      .waitForPageLoaded()
      .assertView("plain", "body");
  });

  it("home", function() {
    return this.browser
      .url("/?mock=home-1544613699481")
      .waitForPageLoaded()
      .assertView("plain", "body");
  });

  it("account", function() {
    return this.browser
      .url("/account?mock=account-1544614104995")
      .waitForPageLoaded()
      .assertView("plain", "body");
  });

  it("builds", function() {
    return this.browser
      .url("/proAlexandr/hello-world?mock=builds-1544614305100")
      .waitForPageLoaded()
      .assertView("plain", "body");
  });

  it("settings", function() {
    return this.browser
      .url("/proAlexandr/hello-world/settings?mock=settings-1544614370076")
      .waitForPageLoaded()
      .assertView("plain", "body");
  });

  it("build", function() {
    return this.browser
      .url("/proAlexandr/hello-world/55/1/2?mock=step-1544614456777")
      .waitForPageLoaded()
      .assertView("plain", "body");
  });
});