<template>
  <nav>
    <router-link :to="`/${slug}/${buildNumber}`" :class="{ active: buildStagesActive }">Build stages</router-link>
    <router-link :to="`/${slug}/${buildNumber}/config`">View config</router-link>
  </nav>
</template>

<script>
export default {
  name: "BuildNav",
  props: {
    slug: { type: String, required: true },
    buildNumber: { type: String, required: true }
  },
  computed: {
    buildStagesActive() {
      return ["build", "step"].includes(this.$route.name);
    }
  }
};
</script>
