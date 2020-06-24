<!-- A list item of editable list -->

<template>
  <div class="editable-list-item">
    <span class="item-name">{{ name }}</span>

    <span class="item-value">{{ value }}</span>

    <Button theme="danger" outline borderless @click.native="$emit('delete')" :loading="deleting">
      Delete
    </Button>
  </div>
</template>

<script>
import Button from "@/components/buttons/Button";

export default {
  name: "EditableListItemWithValue",
  components: {
    Button
  },
  props: {
    name: String,
    value: String
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

.item-name {
  flex-grow: 1;

  @include mobile {
    margin-bottom: 15px;
  }
}

.item-value {
  flex-grow: 1;

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
