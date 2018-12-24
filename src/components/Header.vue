<template>
  <div class="header">
    <div class="logo">
      <router-link to="/">
        <Logo/>
      </router-link>
    </div>

    <Search v-if="user && mediaType === 'desktop'" placeholder="Search repositories or jump to …"/>

    <div class="status-bar" v-if="user">
      <router-link v-if="mediaType !== 'desktop'"
                   class="search-button"
                   :to="urlOrGoBack('search')"
                   :class="{ filled: $route.name === 'search' }">
        <IconMagnifier/>
      </router-link>

      <router-link v-if="mediaType !== 'desktop'" :to="urlOrGoBack('builds-feed')" class="builds-feed-link">
        <BuildsFeedIndicator :collection="$store.state.buildsFeed" :filled="$route.name === 'builds-feed'"/>
      </router-link>

      <portal-target name="status-bar" slim/>

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
import UserMenu from "@/components/UserMenu";
import IconMagnifier from "@/components/icons/IconMagnifier";
import BuildsFeedIndicator from "@/components/BuildsFeedIndicator";

export default {
  name: "Header",
  components: {
    BuildsFeedIndicator,
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
  methods: {
    urlOrGoBack(routeName) {
      const from = this.$store.state.from;
      return this.$route.name === routeName && from ? from.path : this.getUrlByRouteName(routeName);
    },
    getUrlByRouteName(routeName) {
      return `/${routeName}`;
    }
  },
  mounted() {
    if (this.$store.state.buildsFeed.status === "empty") {
      this.$store.dispatch("fetchBuildsFeed");
    }
  }
};
</script>

<style scoped lang="scss">
@import "../assets/styles/mixins";

.header {
  align-items: center;
  box-sizing: border-box;
  display: flex;
  padding: 0 $padding-side;
  justify-content: space-between;
}

.builds-feed + .user-menu {
  margin-left: 30px;
}

.builds-feed-indicator {
  display: inline-block;
}

.logo {
  width: 30px;
  height: 30px;
  margin-right: 50px;
  flex-shrink: 0;
}

.status-bar {
  flex-shrink: 0;

  > * + * {
    margin-left: 20px;
  }
}

.builds-feed-link {
  display: inline-block;
  width: 30px;
  height: 30px;
  box-sizing: border-box;
}

.search-button {
  box-sizing: border-box;
  position: relative;
  display: inline-block;
  width: 30px;
  height: 30px;
  border: 1px solid rgba(25, 45, 70, 0.6);
  border-radius: 50%;
  color: rgba(25, 45, 70, 0.6);

  &.filled {
    background-color: #19d78c;
    border-color: #19d78c;
    color: #fff
  }

  svg {
    width: 16px;
    height: 16px;
    padding: 6px 8px 8px 6px;
    position: absolute;
  }
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
