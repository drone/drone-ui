<template>
  <Panel name="builds-feed" :opened="opened" side="right" class="builds-feed-panel">
    <portal to="status-bar">
      <BuildsFeedIndicator :collection="$store.state.buildsFeed" @click.native="toggle" :filled="opened"/>
    </portal>

    <BuildsFeed>
      <Button slot="header" outline borderless @click.native="toggle">
        <IconCancel/>
      </Button>
    </BuildsFeed>
  </Panel>
</template>

<script>
import Panel from "@/components/Panel";
import BuildsFeed from "@/views/BuildsFeed";
import BuildsFeedIndicator from "@/components/BuildsFeedIndicator";
import Button from "@/components/buttons/Button";
import IconCancel from "@/components/icons/IconCancel";

export default {
  name: "BuildsFeedPanel",
  components: {
    Panel,
    BuildsFeed,
    BuildsFeedIndicator,
    Button,
    IconCancel
  },
  data() {
    return {
      opened: false
    };
  },
  methods: {
    toggle() {
      this.opened = !this.opened;
    }
  }
};
</script>

<style lang="scss">
.builds-feed-panel {
  .page-header {
    padding: 0 10px 0 20px;
  }

  .alert {
    margin: 0 20px;
    box-shadow: none;
    color: rgba(25, 45, 70, 0.6);
  }

  .repo-item.media-mobile {
    border: none;
    border-top: 1px solid rgba(25, 45, 70, 0.05);
    border-bottom: 1px solid rgba(25, 45, 70, 0.05);
    box-shadow: none;
    border-radius: 0;
    padding-left: 20px;
    padding-right: 20px;
  }

  .repo-link.hover-type-box-shadow:focus .repo-item,
  .repo-link.hover-type-box-shadow:hover .repo-item {
    box-shadow: none;

    .header {
      color: #0564d7;
    }
  }

  .list-item + .list-item {
    margin-top: 0;

    .repo-item {
      border-top: 0;
    }
  }
}
</style>
