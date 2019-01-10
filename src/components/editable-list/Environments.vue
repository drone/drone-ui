<template>
  <EditableList title="Environments"
                itemCreateButtonTitle="add an environment"
                :items="items"
                :dispatchCreate="dispatchCreate"
                :dispatchDelete="dispatchDelete">
    <!-- todo link to doc -->
    <Help slot="help" title="Environments">
      To be used to promote a build to.
    </Help>

    <template slot="item">
      <EditableListItem slot-scope="slotProps"
                        :name="slotProps.item.name"
                        :deleting="slotProps.deleting"
                        @delete="slotProps.onDelete"/>
    </template>

    <template slot="fields">
      <BaseInput placeholder="Environment Name" v-model="item.name" type="text" class="input-name"/>
    </template>
  </EditableList>
</template>

<script>
import BaseInput from "@/components/forms/BaseInput";
import EditableList from "@/components/editable-list/EditableList";
import EditableListItem from "@/components/editable-list/EditableListItem";
import Help from "@/components/Help";

export default {
  name: "Environments",
  components: {
    Help,
    BaseInput,
    EditableListItem,
    EditableList
  },
  data() {
    return {
      item: this.emptyItem()
    };
  },
  computed: {
    items() {
      return this.$store.state.environments.data;
    }
  },
  methods: {
    emptyItem() {
      return { name: "" };
    },

    dispatchCreate() {
      return new Promise((res, rej) => rej("Sorry, not ready yet"));

      // todo
      // const { namespace, name } = this.$route.params;
      // const item = this.item;
      //
      // return this.$store.dispatch("createEnvironment", { namespace, name, item }).then(() => {
      //   this.item = this.emptyItem();
      // });
    },

    dispatchDelete(item) {
      return new Promise((res, rej) => rej("Sorry, not ready yet"));

      // todo
      // const { namespace, name } = this.$route.params;
      // return this.$store.dispatch("deleteEnvironment", { namespace, name, item });
    }
  }
};
</script>
