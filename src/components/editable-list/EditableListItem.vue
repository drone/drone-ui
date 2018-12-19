<!-- A list item of editable list -->

<template>
  <div class="editable-list-item">
    <span class="name">{{ name }}</span>

    <div class="tags">
      <Tag v-for="tag in tags" :key="tag">{{ tag }}</Tag>
    </div>

    <Button theme="danger" outline borderless @click.native="$emit('delete')" :loading="deleting">
      Delete
    </Button>
  </div>
</template>

<script>
import Button from "@/components/buttons/Button";
import Tag from "@/components/Tag";

export default {
  name: "EditableListItem",
  components: {
    Button,
    Tag
  },
  props: {
    name: String,
    tags: { type: Array, default: () => [] },
    deleting: Boolean
  }
};
</script>

<style scoped lang="scss">
@import "../../assets/styles/mixins";

.editable-list-item {
  align-items: center;
  display: flex;
  padding: 20px 0;

  @include mobile {
    flex-direction: column;
    align-items: flex-start;
  }
}

.name {
  flex-grow: 1;

  @include mobile {
    margin-bottom: 15px;
  }
}

.tags {
  flex-shrink: 0;

  .tag {
    margin-right: 5px;
  }

  @include mobile {
    margin-bottom: 15px;
  }
}

.button.size-m.theme-danger.outline {
  @include mobile {
    padding: 0;
    background: none;
    height: 14px;
    line-height: 14px;
  }
}
</style>
