<template>
  <div class="builds">
    <AlertError v-if="loadingError" :error="loadingError"/>

    <template v-else>
      <Alert v-if="showEmptyListAlert">
        <IconDroneSleep/>
        <div class="empty-message">Your Build List is Empty.</div>
      </Alert>

      <portal to="secondary-page-header-actions">
        <div class="header-actions">
          <Button theme="primary"
                  class="button-new-build"
                  @click.native="openNewBuildModal">
            <span>New Build</span>
            <IconPlay/>
          </Button>
        </div>
      </portal>

      <router-link
        class="build"
        v-for="build in builds"
        :key="build.id"
        :to="'/'+slug + '/' + build.number">
        <RepoItem :number="build.number"
                  :title="build.title || build.message"
                  :status="build.status"
                  :build="shrinkBuild(build)"
                  :avatar="build.author_avatar"
                  :linkRepo="repo"/>
      </router-link>

      <Modal className="new-build-modal" v-if="showNewBuildModal">
        <NewBuildForm @submit="handleNewBuild" @cancel="closeNewBuildModal" />
      </Modal>

      <MoreButton v-if="showHasMore" @click.native="showMore">Show more</MoreButton>
    </template>

    <Loading v-if="showLoading" text="Loading builds"/>
  </div>
</template>

<script>
import Alert from "@/components/Alert.vue";
import RepoItem from "@/components/RepoItem.vue";
import Loading from "@/components/Loading.vue";
import Button from "@/components/buttons/Button.vue";
import Modal from "@/components/Modal.vue";
import MoreButton from "@/components/buttons/MoreButton.vue";
import AlertError from "@/components/AlertError.vue";
import IconDroneSleep from "@/components/icons/IconDroneSleep";
import IconPlay from "@/components/icons/IconPlay";
import NewBuildForm from "@/components/forms/NewBuildForm.vue";


export default {
  name: "Builds",
  components: {
    Alert,
    RepoItem,
    Loading,
    AlertError,
    MoreButton,
    Button,
    IconDroneSleep,
    IconPlay,
    NewBuildForm,
    Modal,
  },
  data() {
    return {
      showNewBuildModal: false,
    };
  },
  computed: {
    slug() {
      return this.$route.params.namespace + "/" + this.$route.params.name;
    },
    repo() {
      return this.$store.state.repos[this.slug];
    },
    collection() {
      return this.$store.state.builds[this.slug];
    },
    builds() {
      if (!this.collection) return [];

      const buildCollections = Object.values(this.collection.data);
      const builds = [];

      for (let i = 0; i < buildCollections.length; ++i) {
        const data = buildCollections[i].data;
        if (data) builds.push(data);
      }

      builds.sort((a, b) => b.number - a.number);
      return builds;
    },
    showLoading() {
      return (
        this.collection &&
        this.collection.lStatus === "loading" &&
        (this.collection.dStatus === "empty" || this.collection.lPage > 1)
      );
    },
    loadingError() {
      return this.collection.lStatus === "error" ? this.collection.error : null;
    },
    showEmptyListAlert() {
      return this.collection && this.collection.dStatus === "present" && this.builds.length === 0;
    },
    showHasMore() {
      const lastBuilds = this.builds[this.builds.length - 1];
      return this.collection && this.collection.lStatus === "loaded" && lastBuilds && lastBuilds.number !== 1;
    }
  },
  methods: {
    openNewBuildModal: function() {
      this.showNewBuildModal = true;
    },
    closeNewBuildModal: function() {
      this.showNewBuildModal = false;
    },
    handleNewBuild: function(newBuildParams) {
      const { namespace, name, build } = this.$route.params;
      this.$store.dispatch("createBuild", { namespace, name, build, ...newBuildParams }).then(data => {
        this.showNewBuildModal = false;
        this.$router.push(`/${namespace}/${name}/${data.build.number}`);
      });
    },
    showMore() {
      this.$store.dispatch("fetchBuilds", { ...this.$route.params, page: this.collection.page + 1 });
    },
    shrinkBuild(build) {
      return { ...build, message: null };
    }
  }
};
</script>

<style lang="scss">
@import "../assets/styles/variables";

.builds .build .repo-item .header .number,
.builds .build:hover .repo-item .header {
  color: $color-primary;
}
</style>

<style scoped lang="scss">
@import "../assets/styles/mixins";

.icon-drone-sleep {
  margin-bottom: 20px;
}

.empty-message {
  color: $color-text-secondary;
}

.build {
  display: block;
}

.build:hover,
.build:focus {
  outline: none;
}

.build:hover .repo-item,
.build:focus .repo-item {
  box-shadow: 0 4px 10px 0 rgba($color-text, 0.25);
}

.build + .build {
  margin-top: 10px;
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

.header-actions {
  margin: -5px;
  align-self: flex-start;

  @include mobile {
    margin-top: 10px;
  }

  .button {
    margin: 5px;
  }
}
</style>
