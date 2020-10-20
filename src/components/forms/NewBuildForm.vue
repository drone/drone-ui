<template>
  <BaseForm @submit.native.prevent="handleSubmit" class="form">
    <header>
      <h2 class="title">
        Start a New Build
      </h2>
    </header>
    <div class="control-group">
      <div class="control-label">
        <label>Branch (required)</label>
      </div>
      <div class="controls">
        <BaseInput
          v-model="branch"
          name="branch"
          autocomplete="off"
          autocorrect="off"
          autocapitalize="off"
          spellcheck="false"
          placeholder="main"
          type="text"
        />
      </div>
    </div>
    <div class="control-group">
      <div class="control-label">
        <label>Commit Hash</label>
      </div>
      <div class="controls">
        <BaseInput
          v-model="commitHash"
          name="commitHash"
          autocomplete="off"
          autocorrect="off"
          autocapitalize="off"
          spellcheck="false"
          placeholder=""
          type="text"
        />
      </div>
    </div>
    <div class="control-actions">
      <Button type="submit" size="l" theme="primary">Start New Build</Button>
      <Button type="button" size="l" outline @click.native="handleCancel">Cancel</Button>
    </div>
  </BaseForm>
</template>

<script>
import Button from "@/components/buttons/Button.vue";
import BaseInput from "@/components/forms/BaseInput";
import BaseForm from "@/components/forms/BaseForm";
export default {
  name: "NewBuildForm",
  components: {
    Button,
    BaseInput,
    BaseForm
  },
  data() {
    return {
      branch: "",
      commitHash: "",
    }
  },
  props: {
    targets: {type: Array, default() { return [] }}
  },
  methods: {
    handleSubmit(e) {
      this.$emit("submit", {branch: this.branch, commitHash: this.commitHash});
    },
    handleCancel(e) {
      this.$emit("cancel");
    },
  }
};
</script>

<style scoped lang="scss">
.form {
  min-width: 641px;
  .base-input {
    width: 100%;
  }
  header {
    height: 50px;
    line-height: 50px;
    border-bottom: 1px solid rgba(30,55,90,.05);
    padding: 0 15px;
    display: flex;
    align-items: center;
    .title {
      font-size: 16px;
      font-weight: 600;
    }
  }
  .control-group,
  .control-actions,
  .header {
    padding: 11px 15px;
  }
  .control-group {
    align-items: baseline;
    .control-label {
      flex-basis: 0;
      flex-grow: 1;
      flex-shrink: 0;
      text-align: right;
      margin-right: 1.5rem;
    }
    .controls {
      flex-basis: 0;
      flex-grow: 5;
      flex-shrink: 1;
    }
  }
  .control-actions {
    .button + .button {
      margin-left: 1rem;
    }
  }
  .param-list {
    &:not(:empty) {
      margin-bottom: 16px;
    }
  }
  .param-list-item {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    padding: 2px 0;
    code {
      font-family: monospace;
    }
  }
  .param-list-form {
    display: flex;
    flex-wrap: nowrap;
    * + * {
      margin-left: 0.5rem;
    }
    * {
      flex-shrink: 1;
    }
  }
}
</style>
