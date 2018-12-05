<template>
  <div class="header">
    <div class="logo">
        <router-link to="/">
            <Logo/>
        </router-link>
    </div>

    <Search v-if="user && mediaType === 'desktop'" placeholder="Search repositories or jump to …"/>

    <div class="right-block" v-if="user">
      <BuildsFeed v-if="mediaType === 'desktop'"/>
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
    mediaType() {
      return this.$store.state.mediaType;
    },
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
  margin-right: 60px;
  flex-shrink: 0;
}

.right-block {
  flex-shrink: 0;
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
