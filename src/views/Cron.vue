<template>
  <div class="crons">

    <span v-for="cron in crons" :key="cron.id">
      <Cron
        :name="cron.name"
        :expr="cron.expr"
        :branch="cron.branch"
        :next="cron.next"
        v-on:delete="handleDelete"
      />
    </span>
  
    <form @submit.prevent="handleSubmit">
      <input name="cron.name" v-model="cron.name" type="text" />
      <input name="cron.expr" v-model="cron.expr" type="text" />
      <input name="cron.branch" v-model="cron.branch" type="text" />
      <button type="submit">Submit</button>
    </form>

<!--
@yearly (or @annually) | Run once a year, midnight, Jan. 1st        | 0 0 0 1 1 *
@monthly               | Run once a month, midnight, first of month | 0 0 0 1 * *
@weekly                | Run once a week, midnight between Sat/Sun  | 0 0 0 * * 0
@daily (or @midnight)  | Run once a day, midnight                   | 0 0 0 * * *
@hourly 
-->
  </div>
</template>

<script>
import Cron from "@/components/cards/Cron.vue";

export default {
  name: "cron",
  components: {
    Cron,
  },
  data() {
    return {
      cron: {
        name: "",
        expr: "",
        branch: "",
      }
    }
  },
  computed: {
    slug() {
      return this.$route.params.namespace + '/' + this.$route.params.name;
    },
    crons() {
      return this.$store.state.crons[this.slug];
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
        branch: this.cron.branch || "master",
      };
      this.$store.dispatch('createCron', { namespace, name, cron });
      this.cron = {
        name: "",
        expr: "",
        branch: "",
      }
    }
  }
};
</script>
