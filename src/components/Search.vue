<template>
  <BaseForm :class="{ [`opened-${opened ? 'yes' : 'no'}`]: true , search: true }"
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

    <Overlay ref="overlay" :opened="opened"/>
  </BaseForm>
</template>

<script>
import BaseForm from "@/components/forms/BaseForm";
import BaseInput from "@/components/forms/BaseInput";
import Overlay from "@/components/Overlay";
import ReposPopup from "@/components/ReposPopup";

import reposSort from "@/lib/reposSort";
import reposSearch from "@/lib/reposSearch";

const ITEMS_LIMIT = 6;
const HOTKEY_FREE_INPUT_TYPES = [null, "text", "password", "search", "email", "url"];

export default {
  name: "Search",
  components: {
    Overlay,
    BaseForm,
    BaseInput,
    ReposPopup
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
      this.$emit("open");
    },
    close() {
      this.opened = false;
      this.nextOpened = false;
      this.$emit("close");
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
      this.close();
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
        if (
          e.target.tagName === "TEXTAREA" ||
          (e.target.tagName === "INPUT" && HOTKEY_FREE_INPUT_TYPES.includes(e.target.getAttribute("type")))
        )
          return;

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
    document.addEventListener("keyup", this.onKeyPress);
  },
  destroyed() {
    document.removeEventListener("keyup", this.onKeyPress);
  }
};
</script>

<style scoped lang="scss">
@import "../assets/styles/variables";

form {
  position: relative;
  text-align: center;
  margin: 0 30px;
  flex-grow: 1;
  max-width: 400px;
  transition: max-width linear 0.1s;
}

.base-input {
  width: 100%;
  padding-right: 45px;
  position: relative;
  z-index: 20;
}

form.opened-yes {
  position: relative;
  z-index: 1001;
  max-width: 950px;

  input {
    padding-right: 15px;
    border-color: transparent;
  }

  .icon {
    display: none;
  }
}

.icon {
  width: 18px;
  height: 18px;
  position: absolute;
  top: 10px;
  right: 10px;
  border: solid 1px rgba($color-text, 0.25);
  border-radius: 2px;
  text-align: center;
  line-height: 16px;
  color: $color-text-secondary;
  pointer-events: none;
  user-select: none;
  z-index: 25;
}

.popup {
  text-align: left;
  z-index: 20;
}
</style>
