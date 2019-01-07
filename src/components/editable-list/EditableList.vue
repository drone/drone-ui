<template>
  <Card contentPadding="0 15px" class="editable-list">
    <h2 slot="header">{{ title }}</h2>

    <div v-if="items.length === 0" class="alert">
      Your {{ title }} List is Empty.
    </div>

    <div v-for="item in items" :key="item.id" class="editable-list-item-wrapper">
      <slot name='item' :item="item" :deleting="deleting[item.id]" :onDelete="() => handleDelete(item)"/>
    </div>

    <form @submit.prevent="handleSubmit" autocomplete="off" slot="footer">
      <slot name="fields"/>

      <div class="control-actions">
        <Button type="submit" theme="primary" size="l" :loading="creating">{{ itemCreateButtonTitle }}</Button>
        <div class="error-message" v-if="error">{{ error.message || error.toString() }}</div>
      </div>
    </form>

  </Card>
</template>

<script>
import Card from "@/components/Card.vue";
import Button from "@/components/buttons/Button.vue";

export default {
  name: "cron",
  components: {
    Card,
    Button
  },
  props: {
    title: { type: String, required: true },
    items: { type: Array, required: true },
    dispatchCreate: { type: Function, required: true },
    dispatchDelete: { type: Function, required: true },
    itemCreateButtonTitle: { type: String, default: "Add" }
  },
  data() {
    return {
      error: null,
      creating: false,
      deleting: {}
    };
  },
  methods: {
    handleSubmit() {
      this.creating = true;
      this.dispatchCreate()
        .then(() => {
          this.$store.dispatch("showNotification", { message: "Successfully saved" });
          this.creating = false;
          this.error = null;
        })
        .catch(error => {
          this.error = error;
          this.creating = false;
        });
    },
    handleDelete(item) {
      this.$set(this.deleting, item.id, true);
      this.dispatchDelete(item)
        .then(() => {
          this.$store.dispatch("showNotification", { message: "Successfully deleted" });
          this.$delete(this.deleting, item.id);
          this.error = null;
        })
        .catch(error => {
          this.error = error;
          this.$delete(this.deleting, item.id);
        });
    }
  }
};
</script>

<style scoped>
.alert {
  color: rgba(25, 45, 70, 0.6);
  padding: 45px 0;
  text-align: center;
}

.editable-list-item-wrapper + .editable-list-item-wrapper {
  border-top: 1px solid rgba(25, 45, 70, 0.05);
}

.control-actions {
  display: flex;
  align-items: center;
}

.error-message {
  color: #ff4164;
  margin-left: 15px;
}
</style>

<style lang="scss">
.editable-list form {
  input[type="text"],
  textarea {
    display: block;
    margin-bottom: 15px;
    width: 100%;
    border-color: rgba(25, 45, 70, 0.15);
  }

  textarea {
    height: 60px;
  }

  select {
    border-color: rgba(25, 45, 70, 0.15);
    margin-bottom: 15px;
  }

  .base-checkbox label:before {
    border-color: rgba(25, 45, 70, 0.15);
  }
}
</style>
