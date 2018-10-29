<template>
    <div>
        <h1>{{ name }}</h1>
        <div>{{ expr }}</div>
        <div>{{ branch }}</div>
        <div>{{ new Date(next * 1000).toString() }}</div>
        <button v-on:click="$emit('delete', {name, expr, branch})">Delete</button>
    </div>
</template>

<script>
export default {
  name: "Cron",
  props: {
    name: String,
    expr: String,
    branch: String,
    next: Number,
  }
};
</script>

<style scoped>
</style>
