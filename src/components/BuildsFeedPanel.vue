<template>
  <Panel v-if="$store.state.mediaType === 'desktop'" side="right" :opened="opened">
    <portal to="status-bar">
      <BuildsFeedIndicator :collection="$store.state.buildsFeed" @click.native="toggle" :filled="opened"/>
    </portal>

    <BuildsFeed>
      <Button slot="header" outline borderless @click.native="toggle">
        <IconCancel/>
      </Button>
    </BuildsFeed>
  </Panel>

  <portal v-else to="status-bar">
    <router-link to='/builds-feed'>
      <BuildsFeedIndicator :collection="$store.state.buildsFeed" :filled="$route.name === 'builds-feed'"/>
    </router-link>
  </portal>
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
