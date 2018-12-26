<template>
  <header :class="{ header: true }">
    <div class="logo">
      <router-link to="/">
        <Logo/>
      </router-link>
    </div>

    <Search v-if="user && mediaType === 'desktop'"
            placeholder="Search repositories or jump to …"/>

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
  </header>
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
  height: 60px;
  box-shadow: 0 2px 4px 0 rgba(25, 45, 70, 0.05);
  background-color: $color-header;
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

  svg {
    color: #fff;
  }
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
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  color: #fff;

  &.filled {
    color: $color-header;
    background-color: #fff;
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

<style lang="scss">
.header > .search {
  > .base-input {
    border-color: transparent;
  }

  &.opened-no {
    > .base-input {
      background-color: rgba(255, 255, 255, 0.1);
      color: #fff;

      &::placeholder {
        color: rgba(255, 255, 255, 0.6);
      }
    }

    > .icon {
      border: solid 1px rgba(255, 255, 255, 0.15);
      color: rgba(255, 255, 255, 0.6);
    }
  }
}
</style>
