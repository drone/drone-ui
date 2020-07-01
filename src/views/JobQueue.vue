<template>
  <div class="page-job-queue" :class="{ 'page-job-queue_empty': isEmpty }">
    <PageHeader>
      <span class="title">{{ $t("headings.job_queue") }}</span>
      <slot name="header">
        <div>
          <Button @click.native="refresh" outline :loading="showState === 'loading'">
            <span>Refresh</span>
            <IconSync/>
          </Button>
        </div>
      </slot>
    </PageHeader>

    <AlertError v-if="showState === 'loadingError'" :error="incompleteBuilds.error"/>

    <Loading v-if="showState === 'loading'" text="Loading job queue" />
    <Alert v-else-if="isEmpty">
      <IconDroneSleep/>
      <div class="empty-message">Job Queue is Empty.</div>
    </Alert>
    <div v-else>
      <div v-for="item in items" :key="item.build.id">
        <router-link
          class="build"
          :to="'/'+item.slug + '/' + item.build.number">
          <RepoItem :show-repo="true"
                    :number="item.build.number"
                    :title="item.build.title || item.build.message"
                    :status="item.build.status"
                    :build="shrinkBuild(item.build)"
                    :avatar="item.build.author_avatar"
                    :linkRepo="item"/>
        </router-link>
        <div class="jobs">
          <JobItem
            v-for="job in jobs[item.build.id]"
            :key="job.id"
            :stage="job"/>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Alert from "@/components/Alert.vue";
import AlertError from "@/components/AlertError.vue";
import Button from "@/components/buttons/Button.vue";
import IconDroneSleep from "@/components/icons/IconDroneSleep.vue";
import IconSync from "@/components/icons/IconSync.vue";
import Loading from "@/components/Loading.vue";
import PageHeader from "@/components/PageHeader.vue";
import RepoItem from "@/components/RepoItem.vue";
import JobItem from "@/components/JobItem.vue";

export default {
  name: "JobQueue",
  components: {
    Alert,
    AlertError,
    Button,
    IconSync,
    IconDroneSleep,
    Loading,
    PageHeader,
    RepoItem,
    JobItem
  },
  computed: {
    isEmpty() {
      return !this.items.length;
    },
    incompleteBuilds() {
      return this.$store.state.incompleteBuilds;
    },
    jobQueue() {
      return this.$store.state.jobQueue;
    },
    items() {
      return this.incompleteBuilds.data;
    },
    jobs() {
      if (!this.jobQueue || this.jobQueue.lStatus === "error" || this.jobQueue.dStatus !== "present") {
        return {};
      }
      return this.jobQueue.data.reduce((map, job) => {
        (map[job.build_id] = map[job.build_id] || []).push(job);
        return map;
      }, {});
    },
    showState() {
      if (!this.incompleteBuilds) return;
      if (this.incompleteBuilds.lStatus === "error") return "loadingError";
      if (this.incompleteBuilds.lStatus === "loading") return "loading";
      if (this.incompleteBuilds.dStatus === "present") return "data";
    }
  },
  methods: {
    shrinkBuild(build) {
      return { ...build, message: null };
    },
    refresh() {
      if (this.showState !== "loading") {
        this.$store.commit("INCOMPLETE_BUILDS_RESET");
        this.$store.commit("JOB_QUEUE_RESET");
        this.$store.dispatch("fetchIncompleteBuilds");
        this.$store.dispatch("fetchJobQueue");
      }
    }
  }
};
</script>

<style lang="scss">
@import "../assets/styles/mixins";

.page-job-queue_empty {
  height: 100%;
  position: relative;

  & > .page-header {
    position: relative;
    z-index: 2;
  }
}

.page-job-queue {
  .repo-item {
    margin-top: 4px;
  }

  .jobs {
    margin-left: 30px;

    .job-item {
      margin-top: 4px;
    }
  }

  .loading {
    margin: 20px 0;
    color: $color-text-secondary;
  }

  .more-button {
    margin: 15px 0 0 12px;

    @include mobile {
      margin-left: 7px;
    }
  }
}
</style>
