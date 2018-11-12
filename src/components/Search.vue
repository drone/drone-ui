<template>
  <BaseForm :class="{ opened }">
    <BaseInput type="search"
               ref="searchInput"
               v-model="query"
               :placeholder="placeholder"
               @focus.native="open"
               @blur.native="closeTimeouted"
               @input="onInput"/>
    <div class="icon">/</div>

    <Popup v-if="query && opened" :width="700" :position="'bottom'" :align="'center'">
      <div v-if="!loaded" class="text-result">Loading...</div>
      <div v-if="empty" class="text-result">Repositories not found</div>

      <RepoLink v-if="loaded"
                v-for="(repo, index) in results"
                :focusable="false"
                :class="{selected: selectionIndex === index }"
                :hoverType="'none'"
                :key="repo.id"
                :repo="repo"
                @click.native="clear"
                @mouseenter.native="onItemHover(index)">

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
    </Popup>
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
import Popup from "@/components/Popup";

import reposSort from "@/lib/reposSort";

const ITEMS_LIMIT = 6;

export default {
  name: "Search",
  components: {
    Overlay,
    BaseForm,
    BaseInput,
    RepoLink,
    ShortRepoItem,
    RepoItem,
    Popup
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
      opened: false,
      selectionIndex: 0
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

      return reposSort(filtered).slice(0, ITEMS_LIMIT);
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
      if (!this.opened) {
        this.opened = true;
        this.overlay.open();
      }
    },
    onInput() {
      this.open();
      this.loadIfNeeded();
    },
    loadIfNeeded() {
      if (!this.$store.state.latestLoaded) {
        this.$store.dispatch("fetchReposLatest");
      }
    },
    close() {
      if (this.opened) {
        this.opened = false;
        this.overlay.close();
      }
    },
    closeTimeouted() {
      setTimeout(() => this.close(), 100);
    },
    clear() {
      this.query = "";
    },
    onKeyPress(e) {
      if (this.opened) {
        if (e.key === "Escape") {
          this.$refs.searchInput.$el.blur();
          this.stopPropagationAndPreventDefault(e);
        }

        if (this.empty) {
          return;
        }

        if (e.key === "ArrowUp") {
          const nextIndex = this.selectionIndex - 1;
          this.selectionIndex = nextIndex < 0 ? this.results.length - 1 : nextIndex;
          this.stopPropagationAndPreventDefault(e);
        }

        if (e.key === "ArrowDown") {
          const nextIndex = this.selectionIndex + 1;
          this.selectionIndex = nextIndex < this.results.length ? nextIndex : 0;
          this.stopPropagationAndPreventDefault(e);
        }

        if (e.key === "Enter") {
          const repo = this.results[this.selectionIndex];
          this.$router.push(`/${repo.namespace}/${repo.name}`);
          this.stopPropagationAndPreventDefault(e);
        }
      } else {
        if (e.key === "/") {
          this.$refs.searchInput.$el.focus();
          this.stopPropagationAndPreventDefault(e);
        }
      }
    },
    stopPropagationAndPreventDefault(e) {
      e.stopPropagation();
      e.preventDefault();
    },
    onItemHover(index) {
      this.selectionIndex = index;
    }
  },
  mounted() {
    this.overlay = Overlay.instance();
    document.addEventListener("keyup", this.onKeyPress, true);
  },
  destroyed() {
    document.removeEventListener("keyup", this.onKeyPress);
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

.repo-item {
  border: 0;
  box-shadow: none;
}

.repo-link {
  padding: 5px 0;
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

.text-result {
  text-align: center;
  color: rgba(25, 45, 70, 0.5);
  font-size: 13px;
  padding: 16px;
}
</style>
