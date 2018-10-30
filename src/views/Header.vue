<template>
  <div class="header">
    <div class="logo">
        <router-link to="/">
            <Logo class="logo" />
        </router-link>
    </div>

    <div class="search">
        <input type="search" placeholder="Search repositories or jump to …" />
    </div>

    <template v-if="user">
        <div class="avatar">
            <img :src="user.avatar" />
        </div>
    </template>

    <template v-if="showLogin">
        <div class="login">
            <a href="/login" class="button">Login</a>
        </div>
    </template>

        <!-- <nav>
          <router-link to="/">{{ $t("labels.home") }}</router-link> |
          <router-link to="/login/form">{{ $t("labels.login") }}</router-link> |
          <router-link to="/logout">{{ $t("labels.logout") }}</router-link> |
          <router-link to="/account">{{ $t("labels.account") }}</router-link>
        </nav> -->
  </div>
</template>

<script>
import Logo from "@/components/Logo.vue";

export default {
  name: "Header",
  props: {},
  components: {
      Logo,
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
    /* grid-template-rows: 1;
    grid-template-columns: auto 900px auto; */
    padding: 0px 15px;
}

.avatar {
    text-align: right;
    flex: 1;
}

.avatar img {
    border-radius: 50%;
    width: 26px;
    height: 26px;
}

.logo {
    flex: 1;
    grid-column: 1;
    width: 26px;
    height: 26px;
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

.search {
    width: 900px;
    max-width: 900px;
    min-width: 900px;
    grid-column: 2;
    text-align: center;
}

.search input {
    border: 1px solid #e8eaed;
    border-radius: 4px;
    box-sizing: border-box;
    font-size: 14px;
    line-height: 32px;
    outline: none;
    padding: 0px 10px;
    width: 100%;
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
