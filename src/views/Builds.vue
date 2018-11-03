<template>
  <div class="builds">
    <Alert v-if="builds && builds.length == 0">
      Your Build List is Empty.
    </Alert>

    <router-link
      v-for="build in builds"
      :key="build.id"
      :to="'/'+slug + '/' + build.number">
        <Build
          :number="build.number"
          :event="build.event"
          :status="build.status"
          :message="build.message"
          :commit="build.after"
          :branch="build.target"
          :reference="build.ref"
          :created="build.created"
          :started="build.started"
          :finished="build.finished"
          :author="build.author_login"
          :avatar="build.author_avatar" />
    </router-link>
  </div>
</template>

<script>
import Alert from "@/components/Alert.vue";
import Build from "@/components/RepoItem.vue";

export default {
  name: "builds",
  methods: {},
  components: {
    Alert,
    Build
  },
  computed: {
    slug() {
      return this.$route.params.namespace + '/' + this.$route.params.name;
    },
    builds() {
      let {builds} = this.$store.state;
      let values =  Object.values(builds[this.slug] || {});
      values.sort((a, b) => b.number - a.number);
      return values;
    }
  }
};
</script>
