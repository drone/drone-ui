<template>
    <div>
        <h1>{{ name }}</h1>
        <div>{{ pullRequest }}</div>
        <div>{{ pullRequestPush }}</div>
        <button v-on:click="$emit('delete', {name, pullRequest, pullRequestPush})">Delete</button>
    </div>
</template>

<script>
export default {
  name: "Secret",
  props: {
    name: String,
    pullRequest: Boolean,
    pullRequestPush: Boolean,
  }
};
</script>

<style scoped>
</style>
