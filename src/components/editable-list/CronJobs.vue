<template>
  <EditableList title="Cron Jobs"
                itemCreateButtonTitle="add a cron job"
                :items="items"
                :dispatchCreate="dispatchCreate"
                :dispatchDelete="dispatchDelete">
    <IconCronJobsEmpty slot="empty"/>
    <Help slot="help" title="Crons" href="https://docs.drone.io/configure/cron/">
    Setup regularly scheduled pipeline executions.
    </Help>

    <EditableListItem slot="item" slot-scope="slotProps"
                      :name="slotProps.item.name"
                      :tags="[slotProps.item.expr, slotProps.item.branch]"
                      :deleting="slotProps.deleting"
                      @delete="slotProps.onDelete"/>

    <template slot="fields">
      <BaseInput placeholder="Cron Job Name" name="cron.name" v-model="cron.name" type="text"/>
      <BaseInput :placeholder="`Cron Job Branch (default: ${defaultBranch})`"
                 name="cron.branch"
                 v-model="cron.branch"
                 type="text"/>
      <BaseSelect v-model="cron.expr" name="cron.expr" :options="cronExprOptions"/>
    </template>
  </EditableList>
</template>

<script>
import EditableList from "@/components/editable-list/EditableList";
import EditableListItem from "@/components/editable-list/EditableListItem.vue";
import BaseInput from "@/components/forms/BaseInput.vue";
import BaseSelect from "@/components/forms/BaseSelect.vue";
import IconCronJobsEmpty from "@/components/icons/IconCronJobsEmpty";
import Help from "@/components/Help";

export default {
  name: "CronJobs",
  components: {
    EditableList,
    EditableListItem,
    BaseInput,
    BaseSelect,
    IconCronJobsEmpty,
    Help
  },
  props: {
    defaultBranch: { type: String, default: "master" }
  },
  data() {
    return {
      cron: { name: "", expr: "@weekly", branch: "" }
    };
  },
  computed: {
    slug() {
      return this.$route.params.namespace + "/" + this.$route.params.name;
    },
    items() {
      const crons = this.$store.state.crons[this.slug];
      return Object.values(crons || {});
    },
    cronExprOptions() {
      return ["@hourly", "@daily", "@weekly", "@monthly", "@yearly"].map(x => [x, x]);
    }
  },
  methods: {
    dispatchCreate() {
      const { namespace, name } = this.$route.params;
      const cron = {
        name: this.cron.name,
        expr: this.cron.expr,
        branch: this.cron.branch || this.defaultBranch
      };

      return this.$store.dispatch("createCron", { namespace, name, cron }).then(() => {
        this.cron = { name: "", expr: "@weekly", branch: "" };
      });
    },

    dispatchDelete(item) {
      const { namespace, name } = this.$route.params;
      return this.$store.dispatch("deleteCron", { namespace, name, cron: item });
    }
  }
};
</script>

<style scoped>
.icon-cron-jobs-empty {
  display: block;
  margin: 0 auto 20px;
}
</style>
