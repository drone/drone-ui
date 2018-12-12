module.exports = {
  name: "waitForImagesLoaded",
  func: function() {
    const browser = this;

    return browser.waitUntil(function() {
      return browser.execute(function() {
        function checkImagesLoaded() {
          var imgs = document.images;

          for (var i = 0; i < imgs.length; ++i) {
            if (!imgs[i].complete) {
              return false;
            }
          }

          return true;
        }

        return checkImagesLoaded();
      }).then(value => value.value);
    }, 25000, "expect images loaded");
  }
};