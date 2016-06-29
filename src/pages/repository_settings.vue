<template>
  <div>
    <div>
      <h1>REPOSITORY SETTINGS</h1>
    </div>
    <mdl-switch>Push Hook</mdl-switch>
    <mdl-switch>Pull Request Hook</mdl-switch>
    <mdl-switch>Tag Hook</mdl-switch>
    <mdl-switch>Deployment Hook</mdl-switch>
    <mdl-switch>Trusted</mdl-switch>
    <mdl-slider></mdl-slider>
    <mdl-dialog v-ref:dialog>
      <div slot="title">TITLE</div>
      <div>FOO</div>
      <div slot="actions">
        <mdl-button @click="$refs.dialog.close">Close</mdl-button>
      </div>
    </mdl-dialog>

    <mdl-snackbar display-on="repoUpdate"></mdl-snackbar>
    <mdl-button @click="$broadcast('repoUpdate', { message: 'Message Sent' })">Show</mdl-button>
    <mdl-button @click="$refs.dialog.open">Show Dialog</mdl-button>
    <mdl-button @click="update(repo)">Show Dialog</mdl-button>
  </div>
</template>

<script>

export default {
  props: {
    repo: {
      type: Object
    }
  },


  methods: {
    update: function (repo) {
      repo.full_name="BAZZZZ"
    }
  },

  data () {
    return {
    }
  }
}
</script>

<style>

</style>
