<template>
  <div class="header">
    <div class="logo">
        <router-link to="/">
            <Logo class="logo" />
        </router-link>
    </div>

    <Search placeholder="Search repositories or jump to …"/>

    <div class="right-block" v-if="user">
      <BuildsFeed/>

      <div class="user">
        <img class='avatar' :src="user.avatar" @click="toggleUserMenu" v-click-outside="closeUserMenu"/>
        <Popup v-if="userMenuOpened" :position="'bottom'" :align="'right'">
          <router-link to="/account">User settings</router-link>
          <router-link to="/logout" class="logout">{{ $t("labels.logout") }}</router-link>
        </Popup>
      </div>
    </div>

    <template v-if="showLogin">
        <div class="login">
            <a href="/login" class="button">Login</a>
        </div>
    </template>
  </div>
</template>

<script>
import ClickOutside from "vue-click-outside";

import Logo from "@/components/logos/Logo.vue";
import Popup from "@/components/Popup.vue";
import Search from "@/components/Search";
import BuildsFeed from "@/components/BuildsFeed";

export default {
  name: "Header",
  components: {
    BuildsFeed,
    Search,
    Logo,
    Popup
  },
  directives: {
    ClickOutside
  },
  data() {
    return {
      userMenuOpened: false
    };
  },
  computed: {
    user() {
      return this.$store.state.user;
    },
    userLoaded() {
      return this.$store.state.userLoaded;
    },
    showLogin() {
        return this.userLoaded && !this.user;
    }
  },
  methods: {
    toggleUserMenu() {
      this.userMenuOpened = !this.userMenuOpened;
    },
    closeUserMenu() {
      this.userMenuOpened = false;
    }
  }
};
</script>

<style scoped>
.header {
    align-items: center;
    box-sizing: border-box;
    display: flex;
    padding: 0px 30px;
  justify-content: space-between;
}

.builds-feed + .user {
  margin-left: 30px;
}

.user {
  display: inline-block;
  position: relative;
}

.user .popup {
  min-width: 200px;
}

.user .popup a {
  display: block;
  padding: 11px 15px;
  color: #192d46;
}

.user .popup a.logout {
  color: #ff4164;
}

.user .popup a:hover {
  background: rgba(25, 45, 70, 0.03);
}

.user .popup a + a {
  border-top: 1px solid rgba(25, 45, 70, 0.05);
}

.avatar {
  border-radius: 50%;
  width: 30px;
  height: 30px;
  cursor: pointer;
}

.logo {
    grid-column: 1;
    width: 30px;
    height: 30px;
    text-align: left;
}

.login {
    text-align: right;
    flex: 1;
}

.login .button {
    border: none;
    background: #0060da;
    border-radius: 3px;
    color: #fff;
    font-size: 12px;
    padding: 10px 20px;
    text-transform: uppercase;
}

::-webkit-input-placeholder { /* Chrome/Opera/Safari */
  color: #909aa5;
}

::-moz-placeholder { /* Firefox 19+ */
  color: #909aa5;
}

:-ms-input-placeholder { /* IE 10+ */
  color: #909aa5;
}

:-moz-placeholder { /* Firefox 18- */
  color: #909aa5;
}

.breadcrumb {
  display: flex;
  align-items: center;
}

.breadcrumb a {
  display: inline-block;
  margin-right: 15px;
  text-decoration: none;
}

.breadcrumb a:last-of-type {
  color: #2d4057;
}

.breadcrumb svg {
  width: 22px;
  height: 22px;
  margin-right: 15px;
  fill: #c4c9cf;
}
</style>
