<template>
  <div class="user-menu"
       :class="{ clicked }"
       @click="toggle"
       v-click-outside="close">
    <img class='avatar' :src="user.avatar" alt="avatar"/>

    <Popup :position="'bottom'" :align="'right'" :evict="!this.opened">
      <router-link to="/account" @focus.native="open" @blur.native="closeDelayed">User settings</router-link>
      <a href="/logout" class="logout" @focus="open" @blur="closeDelayed">
        {{ $t("labels.logout") }}
      </a>
    </Popup>
  </div>
</template>

<script>
import Popup from "@/components/Popup.vue";

export default {
  name: "UserMenu",
  components: {
    Popup
  },
  props: {
    user: Object
  },
  data() {
    return {
      opened: false,
      nextOpened: false,
      clicked: false
    };
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
      this.clicked = false;
    },
    closeDelayed() {
      this.nextOpened = false;
      setTimeout(() => !this.nextOpened && this.close(), 100);
    }
  }
};
</script>

<style scoped lang="scss">
@import "../assets/styles/variables";

.user-menu {
  display: inline-block;
  position: relative;
}

.user-menu.clicked {
  outline: none;
}

.popup {
  white-space: nowrap;
}

.popup a {
  display: block;
  padding: 11px 30px 11px 15px;
  color: $color-text;
}

.popup a.logout {
  color: #ff4164;
}

.popup a:focus,
.popup a:hover {
  background: rgba($color-text, 0.03);
  outline: none;
}

.popup a + a {
  border-top: 1px solid $border-color;
}

.avatar {
  border-radius: 50%;
  width: 30px;
  height: 30px;
  cursor: pointer;
  display: block;
}
</style>
