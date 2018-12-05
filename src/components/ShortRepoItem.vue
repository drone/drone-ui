<template>
    <div class="repo-item repo-item-short" v-bind:class="{ 'repo-item-inactive': !active }">
        <IconRepository />
        <h3>{{ namespace }}/{{ name }}</h3>
        <Button v-if="!active" theme="primary" outline borderless type="button" tabindex="-1">Activate</Button>
    </div>
</template>

<script>
import IconRepository from "./icons/IconRepository.vue";
import Button from "./buttons/Button.vue";

export default {
  name: "ShortRepoItem",
  components: {
    IconRepository,
    Button
  },
  props: {
    namespace: String,
    name: String,
    active: Boolean,
    slug: String
  }
};
</script>

<style scoped>
div {
    align-items: center;
    border-radius: 3px;
    box-sizing: border-box;
    box-shadow: 0 2px 4px 0 rgba(25, 45, 70, 0.05);
    border: solid 1px #EDEEF1;
    background-color: #ffffff;
    display: flex;
    padding: 10px 10px 10px 15px;
    transition: box-shadow linear 0.2s;
}

svg {
  width: 20px;
  height: 20px;
  margin-right: 10px;
  color: #c6cbd1;
  flex-shrink: 0;
}

.repo-item-inactive h3 {
  opacity: 0.6;
}

h3 {
  font-size: 18px;
  flex-grow: 1;
  margin: 5px 0;
  word-break: break-all;
}

.button {
  letter-spacing: 1px;
}
</style>
