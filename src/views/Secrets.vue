<template>
  <section class="secrets">
    <div class="inner">
      <header>
        Secrets
      </header>

      <div v-if="secrets.length == 0" class="alert">
        Your Secret List is Empty.
      </div>

      <Secret
        v-for="secret in secrets"
        :key="secret.id"
        :name="secret.name"
        :pullRequest="secret.pull_request"
        v-on:delete="handleDelete"
        class="secret">
      </Secret>
    </div>
  
    <form @submit.prevent="handleSubmit" autocomplete="off">
      <input name="secret.name" v-model="secret.name" placeholder="Secret Name" type="text" />
      <textarea name="secret.data" v-model="secret.data" placeholder="Secret Value"></textarea>
      <label class="checkbox-wrapper">Allow Pull Requests
        <input name="secret.pullRequest" v-model="secret.pullRequest" type="checkbox" />
        <span class="checkmark"></span>
      </label>
      
      <div class="actions">
        <button type="submit">Add a Secret</button>
      </div>
    </form>
  </section>
</template>

<script>
import Secret from "@/components/cards/Secret.vue";

export default {
  name: "secrets",
  components: {
    Secret,
  },
  data() {
    return {
      secret: {
        name: "",
        data: "",
        pullRequest: false,
      }
    }
  },
  computed: {
    slug() {
      return this.$route.params.namespace + '/' + this.$route.params.name;
    },
    secrets() {
      const secrets = this.$store.state.secrets[this.slug];
      return Object.values(secrets || {});
    },
  },
  methods: {
    handleDelete: function (secret) {
      const {namespace, name} = this.$route.params;
      this.$store.dispatch('deleteSecret', { namespace, name, secret });
    },
    handleSubmit: function (event) {
      const {namespace, name} = this.$route.params;
      const secret = {
        name: this.secret.name,
        data: this.secret.data,
        pull_request: this.secret.pullRequest,
      };
      this.$store.dispatch('createSecret', { namespace, name, secret });
      this.secret = {
        name: "",
        data: "",
        pullRequest: false,
      }
    }
  }
};
</script>

<style scoped>
.secrets {
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
  resize: none;
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

/* The checkbox-wrapper */
.checkbox-wrapper {
    display: block;
    position: relative;
    padding-left: 35px;
    margin-bottom: 12px;
    cursor: pointer;
    font-size: 13px;
    line-height: 20px;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
}

/* Hide the browser's default checkbox */
.checkbox-wrapper input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
    height: 0;
    width: 0;
}

/* Create a custom checkbox */
.checkmark {
    position: absolute;
    top: 0;
    left: 0;
    height: 20px;
    width: 20px;
    border: 1px solid #e8eaed;
    border-radius: 3px;
}

/* On mouse-over, add a grey background color */
.checkbox-wrapper:hover input ~ .checkmark {
    border-color: #0060da;
}

/* When the checkbox is checked, add a blue background */
.checkbox-wrapper input:checked ~ .checkmark {
    background-color: #0060da;
}

/* Create the checkmark/indicator (hidden when not checked) */
.checkmark:after {
    content: "";
    position: absolute;
    display: none;
}

/* Show the checkmark when checked */
.checkbox-wrapper input:checked ~ .checkmark:after {
    display: block;
}

/* Style the checkmark/indicator */
.checkbox-wrapper .checkmark:after {
    left: 6px;
    top: 3px;
    width: 5px;
    height: 10px;
    border: solid white;
    border-width: 0 2px 2px 0;
    -webkit-transform: rotate(45deg);
    -ms-transform: rotate(45deg);
    transform: rotate(45deg);
}

::-webkit-input-placeholder { /* Chrome/Opera/Safari */
  color: #909aa5;
}

::-moz-placeholder { /* Firefox 19+ */
  color: #97a0aa;
}

:-ms-input-placeholder { /* IE 10+ */
  color: #97a0aa;
}

:-moz-placeholder { /* Firefox 18- */
  color: #97a0aa;
}
</style>