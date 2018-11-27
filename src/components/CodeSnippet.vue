<template>
<div class="code-snippet">
  <header v-if="$slots.header">
    <slot name="header"></slot>

    <button @click="handleCopy">
      <transition name="fade">
        <span v-show="copied">Copied</span>
      </transition>
      <IconCopy/>
    </button>
  </header>
  <div ref="snippet">
    <pre :class="{ 'with-copy': !$slots.header, [`lang-${lang}`]: true }">
      <button @click="handleCopy" v-if="!$slots.header">
        <transition name="fade">
          <span v-show="copied">Copied</span>
        </transition>
        <IconCopy/>
      </button>

      <slot></slot>
    </pre>
  </div>
</div>
</template>

<script>
import IconCopy from "./icons/IconCopy.vue";

export default {
  name: "CodeSnippet",
  components: {
    IconCopy,
  },
  props: {
    lang: String
  },
  data() {
    return {
      copied: false,
      copiedTimeoutId: false
    };
  },
  methods: {
    handleCopy: function() {
      if (!navigator || !navigator.clipboard) return;
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

<style scoped>
div {
  background-color: #fbfbfb;
  border-radius: 3px;
}

header {
  align-items: center;
  display: flex;  
  height: 50px;
  padding: 0px 15px;
  border-bottom: 1px solid #eff0f2;
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
  color: #192d46;
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
  color: #192d46;
  padding: 15px;
  white-space: normal;
}

pre.lang-terminal code:before {
  content: "$";
  display: inline-block;
  min-width: 20px;
}

pre.lang-terminal code.out:before {
  content: ">";
}

pre.with-copy {
  padding-right: 100px;
  position: relative;
}

pre.with-copy button {
  position: absolute;
  top: 15px;
  right: 15px;
}

code {
  display: block;
  line-height: 18px;
  white-space: normal;
}

button {
  background: none;
  border: none;
  cursor: pointer;
  outline: none;
  padding: 0;
  display: flex;
}

button:hover svg,
button:focus svg {
  opacity: 0.6;
}

button:active svg {
  opacity: 1;
  margin-bottom: -2px;
}

button span {
  font-size: 15px;
  margin-right: 10px;
  color: rgba(25, 45, 70, 0.6);
}

svg {
  fill: #192d46;
  opacity: 0.25;
  width: 22px;
  height: 22px;
}
</style>
