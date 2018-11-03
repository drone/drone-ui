<template>
  <base-layout>
    <template slot="header">
      <Header />
    </template>

    <template>
      <router-view />
    </template>
  </base-layout>
</template>

<script>
import BaseLayout from "@/components/BaseLayout.vue";
import Header from "./Header.vue";

export default {
  name: "main",
  components: {
    Header,
    BaseLayout
  },
  computed: {}
};
</script>
