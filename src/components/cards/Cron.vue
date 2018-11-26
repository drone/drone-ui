<template>
  <div class="cron">
    <span>{{ name }}</span>
    <Tag>{{ expr }}</Tag>
    <Tag>{{ branch }}</Tag>
    <Button @click.native="$emit('delete', {name, expr, branch})" theme="danger" outline borderless>Delete</Button>
  </div>
</template>

<script>
import Button from "@/components/buttons/Button";
import Tag from "@/components/Tag";

export default {
  name: "Cron",
  components: {
    Button,
    Tag
  },
  props: {
    name: String,
    expr: String,
    branch: String,
    next: Number
  }
};
</script>

<style scoped>
.cron {
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
