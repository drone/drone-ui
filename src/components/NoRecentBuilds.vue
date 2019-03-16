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
@import "../assets/styles/_variables.scss";

.no-recent-builds {
  text-align: center;
}

.icon-drone-sleep {
  margin-bottom: 20px;
}

.message {
  color: $color-text-secondary;
  line-height: normal;
}
</style>
