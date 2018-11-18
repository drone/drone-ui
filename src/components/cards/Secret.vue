<template>
  <div class="secret">
    <span>{{ name }}</span>
    <Tag v-if="pullRequest">Pull Requests Enabled</Tag>
    <Button theme="danger" outline borderless @click.native="$emit('delete', {name, pullRequest})">Delete</Button>
  </div>
</template>

<script>
import Button from "@/components/buttons/Button";
import Tag from "@/components/Tag";

export default {
  name: "Secret",
  components: {
    Button,
    Tag
  },
  props: {
    name: String,
    pullRequest: Boolean
  }
};
</script>

<style scoped>
.secret {
  align-items: center;
  display: flex;
  padding: 20px 0;
}

span {
  flex-grow: 1;
}

.tag {
  flex-grow: 0;
  margin-right: 5px;
}
</style>
