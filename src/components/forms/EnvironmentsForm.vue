<template>
  <Card>
    <h2 class="title" slot="header">Environments</h2>
    <BaseForm @submit.native.prevent="handleSubmit" class="form">
      <div class="control-group">
        <label class="control-label">Action</label>
        <div class="controls">
          <BaseRadioButtons v-model="action"
                            name="action"
                            :options="{ promote: 'Promote', rollback: 'Rollback' }" />
        </div>
      </div>
      <div class="control-group">
        <label class="control-label">Target</label>
        <div class="controls">
          <BaseInput v-model="target"
                     autocomplete="off"
                     autocorrect="off"
                     autocapitalize="off"
                     spellcheck="false"
                     type="text"
                     list="targets"
                     id="target-input" />
          <datalist id="targets">
            <option v-for="option in targets" :key="option">
              {{ option }}
            </option>
          </datalist>
        </div>
      </div>
      <div class="control-actions">
        <Button type="submit" size="l" theme="primary">Apply</Button>
        <Button type="button" size="l" outline @click.native="handleCancel" id="cancel-button">Cancel</Button>
      </div>
    </BaseForm>
  </Card>
</template>

<script>
import BaseForm from "@/components/forms/BaseForm";
import BaseInput from "@/components/forms/BaseInput";
import BaseRadioButtons from "@/components/forms/BaseRadioButtons";
import BaseTextArea from "@/components/forms/BaseTextArea.vue";
import Button from "@/components/buttons/Button.vue";
import Card from "@/components/Card.vue";
import EditableList from "@/components/editable-list/EditableList";
import EditableListItemWithValue from "@/components/editable-list/EditableListItemWithValue";

export default {
  name: "EnvironmentsForm",
  components: {
    BaseForm,
    BaseInput,
    BaseRadioButtons,
    BaseTextArea,
    Button,
    Card,
    EditableList,
    EditableListItemWithValue
  },
  data() {
    return {
      action: "promote",
      target: "",
      parameters: [{
        id: 1,
        name: "ccc",
        value: "xxx"
      }],
      parameterInput: {
        key: "",
        value: ""
      }
    }
  },
  props: {
    buildNumber: {
      type: Number,
      required: false
    },
    targets: { 
      type: Array, 
      default() {
        return [];
      }
    }
  },
  methods: {
    handleSubmit(e) {
      this.$emit("submit", {
        action: this.action,
        target: this.target,
        params: this.params
      });
    },
    handleCancel(e) {
      this.$emit("cancel");
    },
    dispatchCreate(e) {
      if(this.parameterInput.key == "" || this.parameterInput.value == "") {
        return;
      }

      this.parameters[this.parameterInput.key] = this.parameterInput.value;
      this.parameterInput.key = "";
      this.parameterInput.value = "";         
    },
    dispatchDelete(e) {
      this.$delete(this.parameters, key);
    }
  }
}
</script>

<style scoped lang="scss">
  #cancel-button {
    margin-left: 15px;
  }

  #target-input {
    width: 100%;
  }

  form {
    width: 500px;
  }
</style>