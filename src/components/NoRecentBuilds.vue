<template>
  <div class="no-recent-builds">
    <IconDroneSleep/>

    <div class="message">No recent builds</div>
  </div>
</template>

<script>
import IconDroneSleep from "@/components/icons/IconDroneSleep";

export default {
  name: "NoRecentBuilds",
  components: {
    IconDroneSleep
  }
};
</script>

<style scoped lang="scss">
@import "../assets/styles/variables.scss";
@import "../assets/styles/mixins";

.no-recent-builds {
  text-align: center;
}

.icon-drone-sleep {
  margin-bottom: 20px;
}

.message {
  line-height: normal;
  @include themed {
    color: tget("color-text-secondary");
  }
}
</style>
