<template>
  <div class="user-menu"
       :class="{ clicked }"
       @click="toggle"
       v-click-outside="close">
    <img class='avatar' :src="user.avatar"/>

    <Popup :position="'bottom'" :align="'right'" :style="style">
      <router-link to="/account" @focus.native="open" @blur.native="closeDelayed">User settings</router-link>
      <a href="/logout" class="logout">
        {{ $t("labels.logout") }}
      </a>
    </Popup>
  </div>
</template>

<script>
import ClickOutside from "vue-click-outside";
import Popup from "@/components/Popup.vue";

export default {
  name: "Overlay",
  components: {
    Popup
  },
  directives: {
    ClickOutside
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
  computed: {
    style() {
      return { zIndex: this.opened ? 1 : -1 };
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
      this.clicked = false;
    },
    closeDelayed() {
      this.nextOpened = false;
      setTimeout(() => !this.nextOpened && this.close(), 100);
    },
    onMouseDown() {
      this.toggle();
      this.clicked = true;
    }
  }
};
</script>

<style scoped>
.user-menu {
  display: inline-block;
  position: relative;
}

.user-menu.clicked {
  outline: none
}

.user-menu .popup {
  min-width: 200px;
}

.user-menu .popup a {
  display: block;
  padding: 11px 15px;
  color: #192d46;
}

.user-menu .popup a.logout {
  color: #ff4164;
}

.user-menu .popup a:hover {
  background: rgba(25, 45, 70, 0.03);
}

.user-menu .popup a + a {
  border-top: 1px solid rgba(25, 45, 70, 0.05);
}

.avatar {
  border-radius: 50%;
  width: 30px;
  height: 30px;
  cursor: pointer;
}
</style>
