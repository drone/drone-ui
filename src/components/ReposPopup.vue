<template>
  <Popup v-bind="popupProps">
    <div v-if="!loaded" class="text">Loading...</div>
    <div v-if="empty" class="text">{{ emptyText }}</div>

    <RepoLink v-if="loaded"
              v-for="(repo, index) in repos"
              :focusable="false"
              :class="{selected: selectionIndex === index }"
              :hoverType="'none'"
              :key="`${repo.id}-${repo.build && repo.build.id}`"
              :repo="repo"
              @mouseenter.native="onItemHover(index)"
              @click.native="triggerItemSelect">

      <ShortRepoItem v-if="!repo.build"
                     :namespace="repo.namespace"
                     :name="repo.name"
                     :active="repo.active"/>

      <RepoItem v-if="repo.build"
                :title="`${repo.namespace}/${repo.name}`"
                :build="repo.build"
                :status="repo.build.status"
                :avatar="repo.build.author_avatar"/>
    </RepoLink>
  </Popup>
</template>

<script>
import Popup from "@/components/Popup.vue";
import RepoLink from "@/components/RepoLink";
import ShortRepoItem from "@/components/ShortRepoItem";
import RepoItem from "@/components/RepoItem";

export default {
  name: "ReposPopup",
  components: {
    Popup,
    RepoLink,
    ShortRepoItem,
    RepoItem
  },
  props: {
    popupProps: Object,
    loaded: { type: Boolean, default: false },
    repos: Array,
    emptyText: { type: String, default: "List is empty" }
  },
  data() {
    return {
      selectionIndex: 0
    };
  },
  computed: {
    empty() {
      return this.loaded && this.repos.length === 0;
    }
  },
  methods: {
    onKeyPress(e) {
      if (e.key === "ArrowUp") {
        const nextIndex = this.selectionIndex - 1;
        this.selectionIndex = nextIndex < 0 ? this.repos.length - 1 : nextIndex;
        this.stopPropagationAndPreventDefault(e);
      } else if (e.key === "ArrowDown") {
        const nextIndex = this.selectionIndex + 1;
        this.selectionIndex = nextIndex < this.repos.length ? nextIndex : 0;
        this.stopPropagationAndPreventDefault(e);
      } else if (e.key === "Enter") {
        const repo = this.repos[this.selectionIndex];
        this.$router.push(`/${repo.namespace}/${repo.name}`);
        this.triggerItemSelect(e);
        this.stopPropagationAndPreventDefault(e);
      }
    },
    preventScroll(e) {
      if (e.key === "ArrowUp" || e.key === "ArrowDown") {
        this.stopPropagationAndPreventDefault(e);
      }
    },
    stopPropagationAndPreventDefault(e) {
      e.stopPropagation();
      e.preventDefault();
    },
    onItemHover(index) {
      this.selectionIndex = index;
    },
    triggerItemSelect(e) {
      const { itemSelect } = this.$listeners;
      if (itemSelect) itemSelect(e);
    }
  },
  mounted() {
    document.addEventListener("keydown", this.preventScroll);
    document.addEventListener("keyup", this.onKeyPress);
  },
  destroyed() {
    document.removeEventListener("keydown", this.preventScroll);
    document.removeEventListener("keyup", this.onKeyPress);
  }
};
</script>

<style scoped>
.repo-link {
  outline: none;
}

.repo-link.selected {
  background: rgba(25, 45, 70, 0.02);
}

.repo-link.selected .repo-item {
  background: none;
}

.repo-link + .repo-link {
  border-top: 1px solid rgba(25, 45, 70, 0.05);
}

.repo-item {
  border: 0;
  box-shadow: none;
}

.text {
  text-align: center;
  color: rgba(25, 45, 70, 0.6);
  padding: 16px;
}
</style>
