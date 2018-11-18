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
      v-on:delete="handleDelete"
    />

    <form @submit.prevent="handleSubmit" autocomplete="off" slot="footer">
      <BaseInput placeholder="Cron Job Name" name="cron.name" v-model="cron.name" type="text"/>
      <BaseInput placeholder="Cron Job Branch" name="cron.branch" v-model="cron.branch" type="text"/>

      <select v-model="cron.expr" name="cron.expr">
        <option value="@hourly">@hourly</option>
        <option value="@daily">@daily</option>
        <option value="@weekly">@weekly</option>
        <option value="@monthly ">@monthly</option>
        <option value="@yearly">@yearly</option>
      </select>

      <div class="actions">
        <Button type="submit" theme="primary">Add a Cron Job</Button>
      </div>
    </form>


<!--
@yearly (or @annually) | Run once a year, midnight, Jan. 1st        | 0 0 0 1 1 *
@monthly               | Run once a month, midnight, first of month | 0 0 0 1 * *
@weekly                | Run once a week, midnight between Sat/Sun  | 0 0 0 * * 0
@daily (or @midnight)  | Run once a day, midnight                   | 0 0 0 * * *
@hourly
-->
  </Card>
</template>

<script>
import Cron from "@/components/cards/Cron.vue";
import Card from "@/components/Card.vue";
import BaseInput from "@/components/forms/BaseInput.vue";
import Button from "@/components/buttons/Button.vue";

export default {
  name: "cron",
  components: {
    Cron,
    Card,
    BaseInput,
    Button
  },
  data() {
    return {
      cron: {
        name: "",
        expr: "@weekly",
        branch: "",
      }
    }
  },
  computed: {
    slug() {
      return this.$route.params.namespace + '/' + this.$route.params.name;
    },
    crons() {
      const crons = this.$store.state.crons[this.slug];
      return Object.values(crons || {})
    },
  },
  methods: {
    handleDelete: function (cron) {
      const {namespace, name} = this.$route.params;
      this.$store.dispatch('deleteCron', { namespace, name, cron });
    },
    handleSubmit: function (event) {
      const {namespace, name} = this.$route.params;
      const cron = {
        name: this.cron.name,
        expr: this.cron.expr,
        branch: this.cron.branch || (this.repo && this.repo.branch) || "master",
      };
      this.$store.dispatch('createCron', { namespace, name, cron });
      this.cron = {
        name: "",
        expr: "@weekly",
        branch: "",
      }
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
}

.cron + .cron {
  border-top: 1px solid rgba(25, 45, 70, 0.1);
}

form select {
  margin-bottom: 10px;
}
</style>
