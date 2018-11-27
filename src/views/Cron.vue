<template>
  <Card contentPadding="0 15px">
    <h2 slot="header">Cron Jobs</h2>

    <div v-if="crons.length === 0" class="alert">
      Your Cron List is Empty.
    </div>

    <Cron
      v-for="cron in crons"
      :key="cron.id"
      :name="cron.name"
      :expr="cron.expr"
      :branch="cron.branch"
      :next="cron.next"
      @delete="handleDelete"
    />

    <form @submit.prevent="handleSubmit" autocomplete="off" slot="footer">
      <BaseInput placeholder="Cron Job Name" name="cron.name" v-model="cron.name" type="text"/>
      <BaseInput placeholder="Cron Job Branch" name="cron.branch" v-model="cron.branch" type="text"/>
      <BaseSelect v-model="cron.expr" name="cron.expr" :options="cronExprOptions"/>

      <div class="control-actions">
        <Button type="submit" theme="primary" size="l">Add a Cron Job</Button>
        <div class="error-message" v-if="error">{{ error.message }}</div>
      </div>
    </form>

  </Card>
</template>

<script>
import Cron from "@/components/cards/Cron.vue";
import Card from "@/components/Card.vue";
import BaseInput from "@/components/forms/BaseInput.vue";
import BaseSelect from "@/components/forms/BaseSelect.vue";
import Button from "@/components/buttons/Button.vue";

export default {
  name: "cron",
  components: {
    Cron,
    Card,
    BaseInput,
    BaseSelect,
    Button
  },
  data() {
    return {
      error: null,
      cron: {
        name: "",
        expr: "@weekly",
        branch: ""
      }
    };
  },
  computed: {
    slug() {
      return this.$route.params.namespace + '/' + this.$route.params.name;
    },
    crons() {
      const crons = this.$store.state.crons[this.slug];
      return Object.values(crons || {})
    },
    cronExprOptions() {
      return ["@hourly", "@daily", "@weekly", "@monthly", "@yearly"].map(x => [x, x]);
    }
  },
  methods: {
    handleDelete: function (cron) {
      const {namespace, name} = this.$route.params;
      this.$store.dispatch('deleteCron', { namespace, name, cron });
    },
    handleSubmit: function (event) {
      const { onFailure } = this;
      const {namespace, name} = this.$route.params;
      const cron = {
        name: this.cron.name,
        expr: this.cron.expr,
        branch: this.cron.branch || (this.repo && this.repo.branch) || "master",
      };
      this.$store.dispatch('createCron', { namespace, name, cron, onFailure });
      this.createRequestSent = true;
      this.cron = {
        name: "",
        expr: "@weekly",
        branch: "",
      }
    },
    onFailure(error) {
      this.error = error;
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

form input[type="text"],
form textarea {
  display: block;
  margin-bottom: 15px;
  width: 100%;
  border-color: rgba(25, 45, 70, 0.15);
}

select {
  border-color: rgba(25, 45, 70, 0.15);
}

.cron + .cron {
  border-top: 1px solid rgba(25, 45, 70, 0.05);
}

form select {
  margin-bottom: 15px;
}

.actions {
  display: flex;
  align-items: center;
}

.error-message {
  color: #ff4164;
  margin-left: 15px;
}
</style>
