<template>
  <div class="account">
    <img :src="user.avatar" width="32px" height="32px" />
    <div>syncing: {{ user.syncing }}</div>
    <div>token: {{ user.token }}</div>
    <p>This is the account page</p>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from "@/components/HelloWorld.vue";

export default {
  name: "account",
  components: {},
  computed: {
    user() {
      return this.$store.state.user;
    }
  }
};
</script>
