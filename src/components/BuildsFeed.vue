<template>
  <div class="builds-feed" tabindex="0" @mousedown="toggle" @focusin="open" @focusout="closeDelayed">
    <BuildsFeedIndicator :collection="collection" :filled="opened"/>

    <ReposPopup v-if="opened"
                :repos="collection.data"
                :loaded="loaded"
                :popupProps="{position: 'bottom', align: 'right', width: 570}"
                @itemSelect="close"/>
  </div>
</template>

<script>
import ClickOutside from "vue-click-outside";

import ReposPopup from "@/components/ReposPopup";
import BuildsFeedIndicator from "@/components/BuildsFeedIndicator";

export default {
  name: "BuildsFeed",
  components: {
    ReposPopup,
    BuildsFeedIndicator
  },
  directives: {
    ClickOutside
  },
  data() {
    return {
      opened: false,
      nextOpened: false
    };
  },
  computed: {
    collection() {
      return this.$store.state.buildsFeed;
    },
    loaded() {
      return this.collection.status === "loaded";
    }
  },
  methods: {
    toggle() {
      this.opened ? this.close() : this.open();
    },
    open() {
      this.opened = true;
      this.nextOpened = true;
    },
    close() {
      this.opened = false;
      this.nextOpened = false;
    },
    closeDelayed() {
      this.nextOpened = false;

      setTimeout(() => {
        if (!this.nextOpened) {
          this.opened = false;
        }
      }, 100);
    }
  },
  mounted() {
    if (this.$store.state.buildsFeed.status === "empty") {
      this.$store.dispatch("fetchBuildsFeed");
    }
  }
};
</script>

<style scoped>
.builds-feed {
  position: relative;
  display: inline-block;
  outline: none;
}
</style>
