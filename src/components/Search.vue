<template>
  <BaseForm :class="{ opened }"
            @submit.native="(e) => e.preventDefault()"
            @focusin.native="open"
            @focusout.native="closeDelayed">
    <BaseInput type="search"
               ref="searchInput"
               v-model="query"
               :placeholder="placeholder"
               @input="onInput"/>
    <div class="icon">/</div>

    <ReposPopup v-if="queryTrimmed && opened"
                emptyText="Repositories not found"
                :repos="results"
                :loaded="loaded"
                :popupProps="{position: 'bottom', align: 'center', width: 980}"
                :hideRepoItemFields="['commit']"
                @itemSelect="onItemSelect"/>
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
import ReposPopup from "@/components/ReposPopup";

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
    ReposPopup
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
      nextOpened: false
    };
  },
  computed: {
    results() {
      const filtered = Object.values(this.$store.state.latest).filter(repo => {
        const [byNamespace, byName] = this.queryTrimmed.split("/");

        if (byName !== undefined) {
          return (
            repo.namespace.toLowerCase().indexOf(byNamespace.toLowerCase()) > -1 &&
            repo.name.toLowerCase().indexOf(byName.toLowerCase()) > -1
          );
        }

        return (repo.namespace + "/" + repo.name).toLowerCase().indexOf(this.queryTrimmed.toLowerCase()) > -1;
      });

      return reposSort(filtered).slice(0, ITEMS_LIMIT);
    },
    loaded() {
      return this.$store.state.latestLoaded;
    },
    queryTrimmed() {
      return this.query.trim();
    }
  },
  methods: {
    toggle() {
      this.opened ? this.close() : this.open();
    },
    open() {
      this.opened = true;
      this.nextOpened = true;
      this.overlay.open();
    },
    close() {
      this.opened = false;
      this.nextOpened = false;
      this.overlay.close();
    },
    closeDelayed() {
      this.nextOpened = false;

      setTimeout(() => {
        if (!this.nextOpened) this.close();
      }, 100);
    },
    onInput() {
      this.loadIfNeeded();
    },
    loadIfNeeded() {
      if (!this.$store.state.latestLoaded) {
        this.$store.dispatch("fetchReposLatest");
      }
    },
    onItemSelect() {
      this.close();
      this.clear();
    },
    clear() {
      this.query = "";
    },
    onKeyPress(e) {
      if (this.opened && e.key === "Escape") {
        this.$refs.searchInput.$el.blur();
        this.stopPropagationAndPreventDefault(e);
      }
      if (!this.opened && e.key === "/") {
        this.$refs.searchInput.$el.focus();
        this.stopPropagationAndPreventDefault(e);
      }
    },
    stopPropagationAndPreventDefault(e) {
      e.stopPropagation();
      e.preventDefault();
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
  width: 980px;
  padding-right: 15px;
}

.opened .icon {
  display: none;
}

.icon {
  width: 18px;
  height: 18px;
  position: absolute;
  top: 10px;
  right: 10px;
  border: solid 1px rgba(25, 45, 70, 0.25);
  border-radius: 2px;
  text-align: center;
  line-height: 16px;
  color: rgba(25, 45, 70, 0.5);
  pointer-events: none;
  user-select: none;
}
</style>
