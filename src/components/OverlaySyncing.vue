<template>
  <Overlay :opened="!animationComplete">
    <Lottie :options="lottieOptions" @animCreated="handleAnimation" :width="1920" :height="800" class="lottie"/>

    <div class="header">
      <Logo class="logo" @click.native="forceClose"/>

      <div class="message">
        Your repository list is being synchronized.
        This could take between 30 and 60 seconds to complete…
      </div>

      <Button slot="header" theme="light" outline borderless @click.native="forceClose">
        <IconCancel/>
      </Button>
    </div>
  </Overlay>
</template>

<script>
import Lottie from "vue-lottie";
import Overlay from "@/components/Overlay";
import IconCancel from "@/components/icons/IconCancel";
import Logo from "@/components/logos/Logo";
import Button from "@/components/buttons/Button";

import syncStartAnimationData from "@/assets/sync-animation-data";

const segmentStart = [0, 120];
const segmentMiddle = [120, 217];
const segmentEnd = [217, 385];
const fadeDuration = 500;

export default {
  name: "SyncingOverlay",
  components: {
    Overlay,
    Lottie,
    Logo,
    Button,
    IconCancel
  },
  data() {
    return {
      animationComplete: true
    };
  },
  props: {
    opened: { type: Boolean, default: false }
  },
  computed: {
    lottieOptions() {
      return {
        animationData: syncStartAnimationData,
        autoplay: false,
        loop: false
      };
    }
  },
  methods: {
    handleAnimation(anim) {
      this.anim = anim;
      this.anim.addEventListener("complete", this.onSegmentComplete);
      if (this.opened && anim.isPaused) {
        this.animationComplete = false;
        this.anim.playSegments([1, 2]);
        setTimeout(() => this.anim.playSegments(segmentStart), fadeDuration);
      }
    },
    onSegmentComplete() {
      if (this.anim.firstFrame === segmentStart[0]) {
        this.anim.playSegments(segmentMiddle);
      } else if (this.anim.firstFrame === segmentMiddle[0]) {
        if (this.opened) {
          this.anim.playSegments(segmentMiddle);
        } else {
          this.anim.playSegments(segmentEnd);
          setTimeout(() => this.forceClose(), 5000);
        }
      }
    },
    forceClose() {
      this.animationComplete = true;
      setTimeout(() => this.anim.stop(), fadeDuration);
    }
  },
  watch: {
    opened(nextValue) {
      if (nextValue) {
        this.animationComplete = false;
        this.anim.playSegments([1, 2]);
        setTimeout(() => this.anim.playSegments(segmentStart), fadeDuration);
      }
    }
  }
};
</script>

<style scoped lang="scss">
@import "../assets/styles/variables";

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.overlay {
  background: $body-color url('../assets/drone-background.svg') no-repeat;
  background-size: $body-background-size;
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  z-index: 10;
  display: block;
}

.lottie {
  position: absolute;
  top: 50%;
  left: 50%;
  margin: -400px 0 0 -960px !important;
}

.header {
  display: flex;
  justify-content: space-between;
  padding: 0 $header-padding-side;
  position: fixed;
  top: 0;
  height: $header-height;
  right: 0;
  left: 0;
  background: $header-color;
  align-items: center;
}

.logo {
  width: 30px;
  height: 30px;
  flex-shrink: 0;
  color: #fff;
}

.message {
  color: rgba(#fff, 0.5);
  line-height: normal;
  font-style: italic;
}
</style>
