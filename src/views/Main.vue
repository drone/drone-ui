<template>
  <base-layout>
    <Header slot="header"/>

    <template>
      <transition name="fadein" mode="out-in">
        <router-view/>
      </transition>
    </template>
  </base-layout>
</template>

<script>
import BaseLayout from "@/components/BaseLayout.vue";
import Header from "@/components/Header.vue";

export default {
  name: "Main",
  components: {
    Header,
    BaseLayout
  },
  computed: {}
};
</script>

<style scoped>
.fadein-enter-active,
.fadein-leave-active {
  transition: opacity 0.125s;
}
.fadein-enter, .fadein-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
