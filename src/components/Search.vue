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

    <ReposPopup v-if="popupOpened"
                emptyText="Repositories not found"
                :repos="results"
                :loaded="loaded"
                :popupProps="{position: 'bottom', align: 'both'}"
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
import reposSearch from "@/lib/reposSearch";

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
      const repos = Object.values(this.$store.state.latest);
      return reposSort(reposSearch(repos, this.queryTrimmed)).slice(0, ITEMS_LIMIT);
    },
    loaded() {
      return this.$store.state.latestStatus === "loaded";
    },
    queryTrimmed() {
      return this.query.trim();
    },
    popupOpened() {
      return this.queryTrimmed && this.opened;
    }
  },
  methods: {
    open() {
      this.opened = true;
      this.nextOpened = true;
      this.actualizeOverlay();
    },
    close() {
      this.opened = false;
      this.nextOpened = false;
      this.actualizeOverlay();
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
      if (this.$store.state.latestStatus === "empty") {
        this.$store.dispatch("fetchReposLatest");
      }
    },
    onItemSelect() {
      this.$refs.searchInput.$el.blur();
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
    },
    actualizeOverlay() {
      this.popupOpened ? this.overlay.open() : this.overlay.close();
    }
  },
  watch: {
    popupOpened() {
      this.actualizeOverlay();
    }
  },
  mounted() {
    this.overlay = Overlay.instance();
    document.addEventListener("keyup", this.onKeyPress);
  },
  destroyed() {
    document.removeEventListener("keyup", this.onKeyPress);
  }
};
</script>

<style scoped>
form {
  position: relative;
  text-align: center;
  margin: 0 30px;
  flex-grow: 1;
  max-width: 400px;
  transition: max-width linear 0.1s;
}

input {
  width: 100%;
  padding-right: 45px;
}

.opened {
  position: relative;
  z-index: 1001;
  max-width: 980px;
}

.opened input {
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

.popup {
  text-align: left;
}
</style>
