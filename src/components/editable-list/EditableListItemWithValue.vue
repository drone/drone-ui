<!-- A list item of editable list -->

<template>
  <div class="editable-list-item">
    <span class="name">{{ name }}</span>

    <span class="value">{{ value }}</span>

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
    value: String,
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
  display: flex;
  flex-grow: 1;
  padding-right: 14px;

  @include mobile {
    margin-bottom: 15px;
  }
}

.value {
  display: flex;
  flex-grow: 1;
  flex-direction: row;
  flex-wrap: wrap;
  padding-right: 14px;

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
