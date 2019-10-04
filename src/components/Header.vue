<template>
  <header :class="{ header: true, loading }">
    <div class="logo">
      <router-link to="/">
        <Logo/>
      </router-link>
    </div>

    <Search v-if="userPresent && mediaType === 'desktop'"
            placeholder="Search repositories or jump to …"/>

    <div class="status-bar" v-if="userPresent">
      <router-link v-if="mediaType !== 'desktop'"
                   class="search-button"
                   :to="urlOrGoBack('search')"
                   :class="{ filled: $route.name === 'search' }">
        <IconMagnifier/>
      </router-link>

      <router-link v-if="showBuildsFeedIndicatorLink" :to="urlOrGoBack('builds-feed')" class="builds-feed-link">
        <BuildsFeedIndicator :collection="$store.state.buildsFeed" :filled="$route.name === 'builds-feed'"/>
      </router-link>

      <portal-target name="status-bar" slim/>

      <UserMenu :user="user"/>
    </div>

    <Button v-if="!userPresent" href="/login" class="login" size="l" theme="light">Login</Button>
  </header>
</template>

<script>
import Logo from "@/components/logos/Logo.vue";
import Button from "@/components/buttons/Button";
import Search from "@/components/Search";
import UserMenu from "@/components/UserMenu";
import IconMagnifier from "@/components/icons/IconMagnifier";
import BuildsFeedIndicator from "@/components/BuildsFeedIndicator";

export default {
  name: "Header",
  components: {
    Button,
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
    userPresent() {
      return this.$store.getters.userPresent;
    },
    loading() {
      const {
        state,
        state: { route }
      } = this.$store;
      const slug = `${route.params.namespace}/${route.params.name}`;
      const buildNumber = route.params.build;

      return (
        state.latestStatus === "loading" || // latest
        (route.name === "builds" && state.builds[slug] && state.builds[slug].lStatus === "loading") || // builds
        (route.name === "build" &&
          state.builds[slug] &&
          state.builds[slug].data[buildNumber] &&
          state.builds[slug].data[buildNumber].lStatus === "loading") ||
        state.repoLoading ||
        state.user.tokenLoading
      );
    },
    showBuildsFeedIndicatorLink() {
      return this.mediaType !== "desktop" && this.userPresent;
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
    if (this.$store.state.buildsFeed.status === "empty" && this.showBuildsFeedIndicatorLink) {
      this.$store.dispatch("fetchBuildsFeed");
    }
  }
};
</script>

<style scoped lang="scss">
@import "../assets/styles/mixins";

.header {
  height: $header-height;
  box-shadow: 0 2px 4px 0 $border-color;
  background-color: $header-color;
  align-items: center;
  box-sizing: border-box;
  display: flex;
  padding: 0 $header-padding-side;
  justify-content: space-between;

  &.loading:before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background-image: linear-gradient(
      -45deg,
      rgba(255, 255, 255, 0.05) 25%,
      transparent 25%,
      transparent 50%,
      rgba(255, 255, 255, 0.05) 50%,
      rgba(255, 255, 255, 0.05) 75%,
      transparent 75%,
      transparent
    );
    z-index: 1;
    background-size: 50px 50px;
    animation: loading-movement 2s linear infinite;
  }

  > * {
    z-index: 2;
  }
}

@keyframes loading-movement {
  0% {
    background-position: 0 0;
  }
  100% {
    background-position: 50px 50px;
  }
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
  margin-right: 45px;
  flex-shrink: 0;

  svg {
    color: #fff;
  }
}

.status-bar {
  flex-shrink: 0;

  > * {
    vertical-align: middle;
  }

  > * + * {
    margin-left: $header-padding-side;
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
  background-color: $header-color;

  &.filled {
    color: $header-color;
    background-color: #fff;
  }

  svg {
    width: 16px;
    height: 16px;
    padding: 6px 8px 8px 6px;
    position: absolute;
    top: 0;
    left: 0;
  }
}

// todo Move it to light theme to Button after merge with 1.1.0
.button.login.theme-light {
  background-color: rgba(255, 255, 255, 0.1);

  @include hf {
    background-color: #fff;
    color: $body-color;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.15);
  }
}
</style>

<style lang="scss">
@import "../assets/styles/variables";

.header > .search {
  > .base-input {
    border-color: transparent;
  }

  &.opened-no {
    > .base-input {
      background-color: mix(#fff, $header-color, 10%);
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
