module.exports = {
  name: "waitForVueLoaded",
  func: function () {
    const browser = this;

    return browser.waitUntil(function() {
      return browser.execute(function() {
        function checkAllMounted() {
          var queue = [window.vue];
          while (queue.length > 0) {
            var currentComponent = queue.shift();
            var children = currentComponent.$children;

            if (!currentComponent._isMounted || currentComponent.loaded === false) {
              return false;
            }

            for (var i = 0; i < children.length; ++i) {
              queue.push(children[i]);
            }
          }

          return true;
        }

        return checkAllMounted();
      }).then(value => value.value);
    }, 25000, "expect vue loaded");
  }
};