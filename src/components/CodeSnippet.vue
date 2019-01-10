<template>
<div class="code-snippet">
  <header v-if="$slots.header">
    <slot name="header"></slot>

    <div v-if="copyAvailable" class="copy" @click="handleCopy" style="position: relative">
      <transition name="fade"><Hint align="right" v-show="copied">Copied</Hint></transition>
      <IconCopy/>
    </div>
  </header>

  <div ref="snippet" :class="{'with-copy': !$slots.header}">
    <div v-if="!$slots.header && copyAvailable" class="copy" @click="handleCopy">
      <transition name="fade"><Hint align="right" v-show="copied">Copied</Hint></transition>
      <IconCopy/>
    </div>

    <pre v-highlightjs><slot></slot></pre>
  </div>
</div>
</template>

<script>
import IconCopy from "./icons/IconCopy.vue";
import Hint from "@/components/Hint.vue";

export default {
  name: "CodeSnippet",
  components: {
    IconCopy,
    Hint
  },
  data() {
    return {
      copied: false,
      copiedTimeoutId: false
    };
  },
  computed: {
    copyAvailable() {
      return !!(navigator && navigator.clipboard);
    }
  },
  methods: {
    handleCopy: function() {
      if (!this.copyAvailable) return;

      const text = this.$refs.snippet.innerText;
      navigator.clipboard.writeText(text);

      this.copied = true;
      if (this.copiedTimeoutId) {
        clearTimeout(this.copiedTimeoutId);
      }
      this.copiedTimeoutId = setTimeout(() => {
        this.copiedTimeoutId = null;
        this.copied = false;
      }, 1000);
    }
  }
};
</script>

<style scoped lang="scss">
@import "../assets/styles/_variables.scss";

.code-snippet {
  background-color: #fbfbfb;
  border-radius: 3px;
  color: $color-text;
}

header {
  align-items: center;
  display: flex;
  height: 50px;
  padding: 0px 15px;
  border-bottom: 1px solid rgba($color-text, 0.05);
}

header h1,
header h2,
header h3 {
  height: 18px;
  font-family: 'Roboto Mono', monospace;
  font-size: 13px;
  font-weight: 500;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
  flex: 1;
}

pre {
  opacity: 0.75;
  font-family: 'Roboto Mono', monospace;
  font-size: 13px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  letter-spacing: normal;
  padding: 15px;
}

.with-copy {
  position: relative;
}

.with-copy pre {
  padding-right: 50px;
}

.with-copy .copy {
  position: absolute;
  z-index: 1;
  top: 50%;
  margin-top: -11px;
  right: 15px;
}

code {
  display: block;
  line-height: 18px;
  word-break: break-all;

  &.hljs {
    background: transparent;
    padding: 0;
  }

  &.bash-terminal,
  &.bash-terminal-out {
    &:before {
      display: inline-block;
      min-width: 20px;
    }
  }

  &.bash-terminal:before {
    content: "$";
  }

  &.bash-terminal-out:before {
    content: ">";
  }
}

.copy {
  background: none;
  border: none;
  cursor: pointer;
  outline: none;
  padding: 0;
  display: flex;
}

.copy:hover svg,
.copy:focus svg {
  opacity: 0.6;
}

.copy:active svg {
  opacity: 1;
  margin-bottom: -2px;
}

svg {
  fill: #192d46;
  opacity: 0.25;
  width: 22px;
  height: 22px;
}
</style>
