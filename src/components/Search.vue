<template>
  <BaseForm v-bind:class="{ opened }" @blur="close">
    <BaseInput type="search"
               v-model="query"
               :placeholder="placeholder"
               @focus="open"
               @input="loadIfNeeded"
               v-click-outside="close"
               v-shortkey.focus="['/']"/>
    <div class="icon">/</div>

    <div class="results" v-if="query && opened">
      <div v-if="!loaded" class="text-result">Loading...</div>
      <div v-if="empty" class="text-result">Repositories not found</div>

      <RepoLink v-if="loaded"
                v-for="repo in results"
                :hoverType="'background'"
                :key="repo.id"
                :repo="repo">

        <ShortRepoItem v-if="!repo.build"
                       :namespace="repo.namespace"
                       :name="repo.name"
                       :active="repo.active"/>

        <RepoItem v-if="repo.build"
                  :title="`${repo.namespace}/${repo.name}`"
                  :build="repo.build"
                  :status="repo.build.status"
                  :message="repo.build.message"
                  :avatar="repo.build.author_avatar"
                  :hide="['duration']"/>
      </RepoLink>
    </div>
  </BaseForm>
</template>

<script>
import ClickOutside from "vue-click-outside";

import BaseForm from "@/components/forms/BaseForm";
import BaseInput from "@/components/forms/BaseInput";
import RepoLink from "@/components/RepoLink";
import ShortRepoItem from "@/components/ShortRepoItem";
import RepoItem from "@/components/RepoItem";
import Overlay from "@/components/Overlay";

import reposSort from "@/lib/reposSort";

export default {
  name: "Search",
  components: {
    Overlay,
    BaseForm,
    BaseInput,
    RepoLink,
    ShortRepoItem,
    RepoItem
  },
  directives: {
    ClickOutside
  },
  props: {
    placeholder: String
  },
  data() {
    return {
      query: "",
      opened: false
    };
  },
  computed: {
    results() {
      const filtered = Object.values(this.$store.state.latest).filter(repo => {
        const [byNamespace, byName] = this.query.split("/");

        if (byName !== undefined) {
          return (
            repo.namespace.toLowerCase().indexOf(byNamespace.toLowerCase()) > -1 &&
            repo.name.toLowerCase().indexOf(byName.toLowerCase()) > -1
          );
        }

        return (repo.namespace + "/" + repo.name).toLowerCase().indexOf(this.query.toLowerCase()) > -1;
      });

      return reposSort(filtered).slice(0, 6);
    },
    loaded() {
      return this.$store.state.latestLoaded;
    },
    empty() {
      return this.loaded && this.results.length === 0;
    }
  },
  methods: {
    open() {
      this.opened = true;
      this.overlay.open();
    },
    loadIfNeeded() {
      if (!this.$store.state.latestLoaded) {
        this.$store.dispatch("fetchReposLatest");
      }
    },
    close() {
      this.opened = false;
      this.overlay.close();
    }
  },
  mounted() {
    this.overlay = Overlay.instance();
  }
};
</script>

<style scoped>
form {
  position: relative;
}

input {
  width: 400px;
  padding-right: 45px;
  transition: width linear 0.1s;
}

.opened {
  position: relative;
  z-index: 1001;
}

.opened input {
  width: 700px;
}

.icon {
  width: 18px;
  height: 18px;
  position: absolute;
  top: 10px;
  right: 10px;
  border: solid 1px rgba(25, 45, 70, 0.1);
  border-radius: 2px;
  text-align: center;
  line-height: 18px;
  color: rgba(25, 45, 70, 0.25);
  pointer-events: none;
  user-select: none;
}

.results {
  position: absolute;
  width: 700px;
  top: 50px;
  left: 50%;
  margin-left: -350px;
  max-height: 400px;
  background: #fff;
  z-index: 1;
  border-radius: 3px;
  box-shadow: 0 2px 4px 0 rgba(25, 45, 70, 0.05);
  border: solid 1px #edeef1;
}

.repo-item {
  border: 0;
  box-shadow: none;
}

.repo-link {
  padding: 5px 0;
}

.repo-link + .repo-link {
  border-top: 1px solid rgba(25, 45, 70, 0.05);
}

.text-result {
  text-align: center;
  color: rgba(25, 45, 70, 0.5);
  font-size: 13px;
  padding: 16px;
}
</style>
