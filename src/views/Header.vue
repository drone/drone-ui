<template>
  <div class="header">
    <div class="logo">
        <router-link to="/">
            <Logo class="logo" />
        </router-link>
    </div>

    <Search v-if="user" placeholder="Search repositories or jump to …"/>

    <div class="right-block" v-if="user">
      <BuildsFeed/>
      <UserMenu :user="user"/>
    </div>

    <template v-if="showLogin">
        <div class="login">
            <a href="/login" class="button">Login</a>
        </div>
    </template>
  </div>
</template>

<script>


import Logo from "@/components/logos/Logo.vue";
import Search from "@/components/Search";
import BuildsFeed from "@/components/BuildsFeed";
import UserMenu from "@/components/UserMenu";

export default {
  name: "Header",
  components: {
    BuildsFeed,
    Search,
    Logo,
    UserMenu
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

.builds-feed + .user-menu {
  margin-left: 30px;
}

.logo {
  width: 30px;
  height: 30px;
  padding-right: 60px;
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
</style>
