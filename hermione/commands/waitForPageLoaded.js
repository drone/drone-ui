module.exports = {
  name: "waitForPageLoaded",
  func: function() {
    return this.waitForVueLoaded().waitForImagesLoaded();
  }
};