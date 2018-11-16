<template>
<div class="code-snippet">
  <header>
    <slot name="header"></slot>
    <button v-on:click="handleCopy">
      <IconCopy />
    </button>
  </header>
  <div ref="snippet">
    <slot></slot>
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
  methods: {
    handleCopy: function() {
      if (!navigator || !navigator.clipboard) return;
      const text = this.$refs.snippet.innerText;
      navigator.clipboard.writeText(text)
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

pre.terminal code:before {
  content: "$";
  display: inline-block;
  min-width: 20px;
}

pre.terminal.single-command code:not(:first-of-type):before {
  content: ">";
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
  padding: 0px;
}

button:hover svg {
  opacity: 0.6;
}

button:active svg {
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
