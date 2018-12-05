<template>
  <span v-if="config">
    <span v-if="prefix">{{ prefix }}</span>
    <component :is="tag" v-bind="props" class="repo-item-label">{{ config.text }}</component>
  </span>
</template>

<script>
const GITHUB_BASE = "https://github.com";

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
        if (event === "promote") return { text: this.branch, href: this.hrefBranch };
        return { text: this.commitShaShort, href: this.hrefCommit };
      } else if (this.type === "to") {
        if (event === "push" || event === "pull_request") {
          return { text: this.branch, href: this.hrefBranch };
        }
      }
    },
    hrefPR() {
      if (this.provider === "github") {
        return `${GITHUB_BASE}/${this.repo.slug}/pull/${this.trimMergeRef(this.build.ref)}`;
      }
    },
    hrefTag() {
      if (this.provider === "github") return null; // it's impossible to choose 'tag' or 'releases/tag'
    },
    hrefBranch() {
      if (this.provider === "github") return `${GITHUB_BASE}/${this.repo.slug}/tree/${this.build.target}`;
    },
    hrefCommit() {
      if (this.provider === "github") return `${GITHUB_BASE}/${this.repo.slug}/commit/${this.build.target}`;
    },
    provider() {
      if (!this.link) return;

      const { git_ssh_url } = this.repo;

      if (git_ssh_url && git_ssh_url.startsWith("git@github.com:")) return "github";

      return "unknown";
    },
    branch() {
      return this.build.target;
    },
    commitSha() {
      return this.build.after;
    },
    commitShaShort() {
      return this.commitSha && this.commitSha.substr(0, 8);
    }
  },
  methods: {
    trimMergeRef(ref) {
      const match = ref.match(/\d/g);
      return match && match.length > 0 ? match[0] : ref;
    },
    trimTagRef(ref) {
      return ref.startsWith("refs/tags/") ? ref.substr(10) : ref;
    }
  }
};
</script>

<style>
.repo-item-label {
  line-height: 20px;
  background-color: rgba(5, 100, 215, 0.07);
  color: #0564d7;
  padding: 0 4px;
  border-radius: 2px;
}
</style>
