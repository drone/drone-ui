<template>
    <div class="secret">
        <h1>{{ name }}</h1>
        <span v-if="pullRequest">Pull Requests Enabled</span>
        <button v-on:click="$emit('delete', {name, pullRequest})">Delete</button>
    </div>
</template>

<script>
export default {
  name: "Secret",
  props: {
    name: String,
    pullRequest: Boolean,
  }
};
</script>

<style scoped>
.secret {
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
  color: #888;
  font-size: 11px;
  text-transform: uppercase;
  padding: 5px 7px;
  border-radius: 3px;
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
