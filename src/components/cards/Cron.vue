<template>
    <div class="cron">
        <h1>{{ name }}</h1>
        <span>{{ expr }}</span>
        <span>{{ branch }}</span>
        <!-- <div>{{ new Date(next * 1000).toString() }}</div> -->
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
.cron {
  align-items: center;
  display: flex;
  font-size: 14px;
  padding: 15px 0px;
}

h1 {
  flex: 1;
}

span {
  background: #EEE;
  border-radius: 3px;
  color: #888;
  font-size: 12px;
  margin-left: 10px;
  padding: 5px 7px;
}

button {
  background: none;
  border: none;
  color: red;
  cursor: pointer;
  font-size: 12px;
  margin-left: 10px;
  text-transform: uppercase;
}
</style>
