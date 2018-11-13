<template>
  <div class="builds-feed"
       tabindex="0"
       :class="{ [`status-${status}`]: true, opened }"
       @mousedown="toggle"
       @focusin="open"
       @focusout="closeDelayed">
    <div class="round">
      <div class="border"></div>

      <div class="label">
        <template v-if="status === 'done'">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <g fill-rule="nonzero" fill="none">
              <path stroke="currentColor" stroke-linecap="round" stroke-width="1.4"
                    d="M5.66 11.113l2.777 2.739a.2.2 0 0 0 .28 0L14.66 7.99"/>
            </g>
          </svg>
        </template>

        <template v-if="status === 'running'">{{ runningBuildsCount }}</template>
      </div>
    </div>

    <ReposPopup v-if="opened"
                :repos="latest"
                :loaded="loaded"
                :popupProps="{position: 'bottom', align: 'right', width: 570}"
                :hideRepoItemFields="['commit', 'finished']"
                @itemSelect="close"/>
  </div>
</template>

<script>
import ClickOutside from "vue-click-outside";

import ReposPopup from "@/components/ReposPopup";

import reposSort from "@/lib/reposSort";

export default {
  name: "BuildsFeed",
  components: {
    ReposPopup
  },
  directives: {
    ClickOutside
  },
  props: {},
  data() {
    return {
      opened: false,
      nextOpened: false
    };
  },
  computed: {
    latest() {
      const repos = Object.values(this.$store.state.latest).filter(x => x.build);
      return reposSort(repos).slice(0, 5);
    },
    loaded() {
      return this.$store.state.latestLoaded;
    },
    status() {
      return this.runningBuildsCount > 0 ? "running" : "done";
    },
    runningBuildsCount() {
      return this.latest.filter(x => x.build && x.build.status === "running").length;
    }
  },
  methods: {
    loadIfNeeded() {
      if (!this.loaded) {
        this.$store.dispatch("fetchReposLatest");
      }
    },
    toggle() {
      this.opened ? this.close() : this.open();
    },
    open() {
      this.loadIfNeeded();
      this.opened = true;
      this.nextOpened = true;
    },
    close() {
      this.opened = false;
      this.nextOpened = false;
    },
    closeDelayed() {
      this.nextOpened = false;

      setTimeout(() => {
        if (!this.nextOpened) {
          this.opened = false;
        }
      }, 100);
    }
  }
};
</script>

<style scoped>
.builds-feed {
  position: relative;
  display: inline-block;
  outline: none;
}

.builds-feed.status-done .label {
  color: rgba(25, 45, 70, 0.25);
}

.builds-feed.status-running .border {
  border-color: #ffd20a;
  border-bottom-color: transparent;
  animation: spin 1s linear infinite;
}

.builds-feed.status-running .label {
  color: #ffd20a;
}

.builds-feed.status-running.opened .border {
  background-color: #ffd20a;
}

.builds-feed.opened .border {
  background-color: rgba(25, 45, 70, 0.25);
  border: none;
  animation: none;
}

.builds-feed.opened .label {
  color: #fff;
}

.round {
  cursor: pointer;
}

.border {
  width: 30px;
  height: 30px;
  border-radius: 15px;
  box-sizing: border-box;
  border: 2px solid rgba(25, 45, 70, 0.25);
}

.label {
  top: 0;
  width: 30px;
  height: 30px;
  position: absolute;
  line-height: 30px;
  text-align: center;
  font-size: 16px;
  font-weight: 600;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(359deg);
  }
}
</style>
