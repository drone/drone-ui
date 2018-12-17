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

      <router-link to='/search' v-if="mediaType === 'mobile'" class="mobile-link">
        <IconMagnifier/>
      </router-link>

      <router-link to='/builds-feed' v-if="mediaType === 'mobile'" class="mobile-link">
        <BuildsFeedIndicator :collection="$store.state.buildsFeed"/>
      </router-link>

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
import IconMagnifier from "@/components/icons/IconMagnifier";
import BuildsFeedIndicator from "@/components/BuildsFeedIndicator";

export default {
  name: "Header",
  components: {
    BuildsFeedIndicator,
    BuildsFeed,
    Search,
    Logo,
    UserMenu,
    IconMagnifier
  },
  computed: {
    mediaType() {
      return this.$store.state.mediaType;
    },
    user() {
      return this.$store.state.user.data;
    },
    userLoaded() {
      return this.$store.state.user.status === "loaded";
    },
    showLogin() {
      return this.userLoaded && !this.user;
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
.header {
  align-items: center;
  box-sizing: border-box;
  display: flex;
  padding: 0 30px;
  justify-content: space-between;
}

.builds-feed + .user-menu {
  margin-left: 30px;
}

.builds-feed-indicator {
  display: inline-block;
  margin-right: 10px;
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

.mobile-link {
  display: inline-block;
  width: 30px;
  height: 30px;
  margin-right: 20px;
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
