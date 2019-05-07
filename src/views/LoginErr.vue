<template>
  <div class="container">
      <Alert>
        Login Failed.
        <small>{{ error }}</small>
      </Alert>
  </div>
</template>

<script>
import Alert from "@/components/Alert.vue";
export default {
  name: "loginerr",
  components: {
    Alert
  },
  computed: {
    error() {
      return this.$route.query.message;
    }
  }
};
</script>

<style scoped>
div.container {
  align-items: center;
  background: #fbfbfb;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  padding: 30px;
  height: 100%;
  width: 100%;
}

div.container > div {
  min-width: 300px;
}
</style>
