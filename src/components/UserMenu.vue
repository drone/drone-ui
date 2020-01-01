<template>
  <div class="user-menu"
       :class="{ clicked }"
       @click="toggle"
       v-click-outside="close">
    <img class='avatar' :src="user.avatar" alt="avatar"/>

    <Popup :position="'bottom'" :align="'right'" :evict="!this.opened">
      <router-link to="/account" @focus.native="open" @blur.native="closeDelayed">User settings</router-link>
      <DarkThemeControl class="section"></DarkThemeControl>
      <a href="/logout" class="logout" @focus="open" @blur="closeDelayed">
        {{ $t("labels.logout") }}
      </a>
    </Popup>
  </div>
</template>

<script>
import Popup from "@/components/Popup.vue";
import DarkThemeControl from "@/components/DarkThemeControl.vue";

export default {
  name: "UserMenu",
  components: {
    Popup,
    DarkThemeControl
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
@import "../assets/styles/mixins";

.user-menu {
  display: inline-block;
  position: relative;
}

.user-menu.clicked {
  outline: none;
}

.popup {
  min-width: 300px;
  white-space: nowrap;
}

.popup a {
  display: block;
}

.popup a,
.popup .section {
  padding: 14px 15px;
  @include themed {
    color: tget("color-text");
  }
}

.popup a.logout {
  color: #ff4164;
}

.popup a:focus,
.popup a:hover {
  outline: none;
  @include themed {
    background: rgba(tget("color-text"), 0.03);
  }
}

.popup > *:not(:first-child) {
  @include themed {
    border-top: 1px solid tget("border-color");
  }
}

.avatar {
  border-radius: 50%;
  width: 30px;
  height: 30px;
  cursor: pointer;
  display: block;
}
</style>
