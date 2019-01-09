// Based on https://github.com/metachris/vue-highlightjs/blob/master/index.js

import hljs from "highlight.js/lib/highlight";
import bash from "highlight.js/lib/languages/bash";
import yaml from "highlight.js/lib/languages/yaml";
import markdown from "highlight.js/lib/languages/markdown";

const languages = { bash, yaml, markdown };

var vueHighlightJS = {};
vueHighlightJS.install = function install(Vue) {
  Object.keys(languages).forEach(lang => {
    hljs.registerLanguage(lang, languages[lang]);
  });

  Vue.directive("highlightjs", {
    deep: true,
    bind: function bind(el, binding) {
      // on first bind, highlight all targets
      var targets = el.querySelectorAll("code");
      var target;
      var i;

      for (i = 0; i < targets.length; i += 1) {
        target = targets[i];

        if (typeof binding.value === "string") {
          // if a value is directly assigned to the directive, use this
          // instead of the element content.
          target.textContent = binding.value;
        }

        hljs.highlightBlock(target);
      }
    },
    componentUpdated: function componentUpdated(el, binding) {
      // after an update, re-fill the content and then highlight
      var targets = el.querySelectorAll("code");
      var target;
      var i;

      for (i = 0; i < targets.length; i += 1) {
        target = targets[i];
        if (typeof binding.value === "string") {
          target.textContent = binding.value;
        }
        hljs.highlightBlock(target);
      }
    }
  });
};

export default vueHighlightJS;