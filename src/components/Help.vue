<template>
  <div class="help" v-click-outside="close">
    <div class="anchor" @click="toggle">?</div>
    <Popup v-if="opened" align="right" position="top" :width="250">
      <div class="header">{{ title }}</div>
      <div class="content">
        <slot></slot>
        <template v-if="href">
          <br/>
          <a :href="href" class="link" target="_blank">View Documentation</a>
        </template>
      </div>
    </Popup>
  </div>
</template>
<script>
import Popup from "@/components/Popup";
export default {
  name: "Help",
  components: {
    Popup
  },
  props: {
    title: { type: String, required: true },
    href: String
  },
  data() {
    return { opened: false };
  },
  methods: {
    toggle() {
      this.opened = !this.opened;
    },
    close() {
      if (this.opened) this.opened = false;
    }
  }
};
</script>

<style scoped lang="scss">
@import "../assets/styles/mixins";
.help {
  line-height: normal;
  display: inline-block;
  position: relative;
  font-size: 13px;
}
.anchor {
  width: 18px;
  height: 18px;
  line-height: 18px;
  border-radius: 50%;
  text-align: center;
  font-weight: 700;
  cursor: pointer;
  user-select: none;
  @include themed {
    color: tget("surface-color");
    
    @include hf {
      background: rgba(tget("color-text"), 0.6);
    }
  }
  @include themed-only(default) {
    background: rgba(tget("color-text"), 0.3);
  }
  @include themed-only(dark) {
    background: rgba(tget("color-text"), 0.4);
  }
}
.popup {
  right: -10px !important;
}
.header {
  line-height: 18px;
  padding: 11px 15px;
  font-weight: 600;
  @include themed {
    border-bottom: 1px solid rgba(tget("color-text"), 0.05);
  }
}
.content {
  padding: 10px 15px;
}
.link {
  display: inline-block;
  margin-top: 10px;
}
</style>
