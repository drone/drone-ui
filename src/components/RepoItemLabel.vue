<template>
  <span v-if="config">
    <span v-if="prefix">{{ prefix }}</span>
    <component :is="tag" v-bind="props" class="repo-item-label" @click="onClick">{{ config.text }}</component>
  </span>
</template>

<script>
export default {
  name: "RepoItemLink",
  props: {
    link: { type: Boolean, default: false },
    repo: { type: Object, required: false },
    build: { type: Object, required: true },
    type: { type: String, required: true, validator: x => ["actionTarget", "to"].includes(x) },
    prefix: { type: String }
  },
  computed: {
    tag() {
      return this.link && this.config.href ? "a" : "span";
    },
    props() {
      return this.tag !== "a" ? {} : { href: this.config.href, target: "_blank" };
    },
    config() {
      const { event, ref } = this.build;

      if (this.type === "actionTarget") {
        if (event === "pull_request") return { text: "#" + this.trimMergeRef(ref), href: this.hrefPR };
        if (event === "tag") return { text: this.trimTagRef(ref), href: this.hrefTag };
        if (event === "promote") return { text: this.promotionTarget };
        if (event === "rollback") return { text: this.promotionTarget };
        if (event === "cron") return { text: this.cron };
        return { text: this.commitShaShort, href: this.hrefCommit };
      } else if (this.type === "to") {
        if (event === "push" || event === "pull_request") {
          return { text: this.branch, href: this.hrefBranch };
        }
        if (event === "rollback") {
          return { text: this.commitShaShort };
        }
        if (event === "promote") {
          return { text: this.commitShaShort };
        }
      }
    },
    hrefPR() {
      return this.build && this.repo && `/link/${this.repo.slug}/tree/${this.build.ref}`;
    },
    hrefTag() {
      return this.build && this.repo && `/link/${this.repo.slug}/tree/${this.build.ref}`;
    },
    hrefBranch() {
      return this.build && this.repo && `/link/${this.repo.slug}/tree/refs/heads/${this.build.target}`;
    },
    hrefCommit() {
      return this.build && this.repo && `/link/${this.repo.slug}/commit/${this.build.after}`;
    },
    branch() {
      return this.build.target;
    },
    cron() {
      return this.build.cron;
    },
    commitSha() {
      return this.build.after;
    },
    commitShaShort() {
      return this.commitSha && this.commitSha.substr(0, 8);
    },
    promotionTarget() {
      return this.build.deploy_to;
    }
  },
  methods: {
    trimMergeRef(ref) {
      const match = ref.match(/\d+/g);
      return match && match.length > 0 ? match[0] : ref;
    },
    trimTagRef(ref) {
      return ref.startsWith("refs/tags/") ? ref.substr(10) : ref;
    },
    onClick(e) {
      if (this.tag === "a") {
        e.stopPropagation();
      }
    }
  }
};
</script>

<style scoped lang="scss">
@import "../assets/styles/variables";
@import "../assets/styles/mixins";

.repo-item-label {
  padding: 0 4px;
  border-radius: 2px;
  @include themed {
    color: tget("color-primary");
  }
  @include themed-only(default) {
    background-color: rgba(tget("color-primary"), 0.07);
  }
  @include themed-only(dark) {
    background-color: rgba(tget("color-primary"), 0.11);
  }
}

a.repo-item-label:hover,
a.repo-item-label:focus {
  @include themed {
    background-color: rgba(tget("color-primary"), tget("button-outline-hover-bg-opacity"));
  }
}
</style>
