<template>
  <nav v-if="repo">
    <router-link :to="`/${repo.slug}`" :disabled="!repo.active">Activity Feed</router-link>
    <router-link v-if="isCollaborator" :to="`/${repo.slug}/settings`">Settings</router-link>
  </nav>
</template>

<script>
export default {
  name: "RepoNav",
  props: {
    repo: Object,
    user: Object
  },
  computed: {
    isCollaborator() {
      return (this.repo && this.repo.permissions && this.repo.permissions.write) || (this.user && this.user.admin);
    }
  }
};
</script>
