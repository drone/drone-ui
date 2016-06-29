<template>
  <div>
    <h1>REPOSITORY BADGES</h1>
    <div v-if="repo">{{repo.full_name}}</div>
  </div>
</template>

<script>
export default {
  props: {
    repo: {
      type: Object
    }
  },

  data () {
    return { }
  }
}
</script>

<style>

</style>
