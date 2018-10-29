<template>
  <div class="builds">
        <div>
          <span v-for="build in builds" :key="build.id">
            <router-link :to="'/'+namespace+'/'+build.number">
              <Build
                :number="build.number"
                :event="build.event"
                :status="build.status"
                :message="build.message"
                :commit="build.after"
                :branch="build.branch"
                :reference="build.ref"
                :created="build.created"
                :started="build.started"
                :finished="build.finished"
                :author="build.author_login"
                :avatar="build.author_avatar"
              />
            </router-link>
          </span>
        </div>
  </div>
</template>

<script>
import Build from "@/components/Build.vue";

export default {
  name: "builds",
  methods: {},
  components: {
    Build
  },
  computed: {
    namespace() {
      return this.$route.params.namespace + '/' + this.$route.params.name;
    },
    builds() {
      let {builds} = this.$store.state;
      let values =  Object.values(builds[this.namespace] || {});
      values.sort((a, b) => b.number - a.number);
      return values;
    }
  }
};
</script>
