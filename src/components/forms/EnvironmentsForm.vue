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
      <EditableList title="Environment variables"
                    itemCreateButtonTitle="add a variable"
                    :items="parameters"
                    :dispatchCreate="dispatchCreate"
                    :dispatchDelete="dispatchDelete">
        <EditableListItemWithValue slot="item" 
                                   slot-scope="slotProps" 
                                   :name="slotProps.item.name"
                                   :value="slotProps.item.value"
                                   :deleting="slotProps.deleting"
                                   @delete="slotProps.onDelete"/>
        <template slot="fields">
          <BaseInput name="parameterInput.name" v-model="parameterInput.name" placeholder="Variable Name" type="text"/>
          <BaseTextArea name="parameterInput.value" v-model="parameterInput.value" placeholder="Variable Value"/>
        </template>
      </EditableList>
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
      parameters: [],
      parameterInput: {
        name: "",
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
      if(this.target == "") {
        return;
      }
      
      this.$emit("submit", {
        action: this.action,
        target: this.target,
        params: this.parameters
      });
    },
    handleCancel(e) {
      this.$emit("cancel");
    },
    dispatchCreate(e) {
      if(this.parameterInput.name == "" || this.parameterInput.value == "") {
        return Promise.resolve(false);
      }

      this.parameters[this.parameters.length] = {
        id: this.parameters.length + 1,
        name: this.parameterInput.name,
        value: this.parameterInput.value
      };

      this.parameterInput.name = "";
      this.parameterInput.value = "";
      
      return Promise.resolve(true);
    },
    dispatchDelete(e) {
      this.parameters.splice(e.id - 1, 1);
      return Promise.resolve(true);
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