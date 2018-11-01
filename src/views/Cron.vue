<template>
  <div class="crons">
    <div class="inner">
      <header>
        Cron Jobs
      </header>

      <div v-if="crons.length == 0" class="alert">
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
    </div>
  
    <form @submit.prevent="handleSubmit" autocomplete="off">
      <input placeholder="Cron Job Name" name="cron.name" v-model="cron.name" type="text" />
      <input placeholder="Cron Job Expression" name="cron.expr" v-model="cron.expr" type="text" />
      <input placeholder="Cron Job Branch" name="cron.branch" v-model="cron.branch" type="text" />
      
      <div class="actions">
        <button type="submit">Add a Cron Job</button>
      </div>
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

<style scoped>
.crons {
  background: #FFF;
  border: 1px solid #e8eaed;
  border-radius: 3px;
  box-shadow: 0px 0px 8px 1px #e8eaed;
  margin-bottom: 30px;
}

.inner {
  padding: 0px 15px;
}

header {
  font-size: 15px;
  padding: 15px;
  padding-left: 0px;
  border-bottom: 1px solid #e8eaed;
  font-weight: 600;
}

.alert {
  color: #8d96a2;
  padding: 45px 0px;
  text-align: center;
}

.secret:not(:last-of-type) {
  border-bottom: 1px solid #e8eaed;
}

form {
  background: #fbfbfb;
  border-top: 1px solid #e8eaed;
  padding: 15px 15px;
}

form input[type=text],
form textarea {
  border-radius: 3px;
  border: 1px solid #e8eaed;
  box-sizing: border-box;
  display: block;
  font-size: 13px;
  margin-bottom: 10px;
  outline: none;
  padding: 7px 10px;
  width: 100%;
}

form input[type=text]:focus,
form textarea:focus {
  border: 1px solid #0060da;
}

form textarea {
  height: 60px;
}

form button {
  border: none;
  background: #0060da;
  border-radius: 3px;
  color: #FFF;
  font-size: 12px;
  padding: 10px 20px;
  text-transform: uppercase;
}

::-webkit-input-placeholder { /* Chrome/Opera/Safari */
  color: #909aa5;
}

::-moz-placeholder { /* Firefox 19+ */
  color: #909aa5;
}

:-ms-input-placeholder { /* IE 10+ */
  color: #909aa5;
}

:-moz-placeholder { /* Firefox 18- */
  color: #909aa5;
}
</style>
