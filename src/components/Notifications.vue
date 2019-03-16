<template>
  <transition-group name="list" tag="div" class="notifications">
    <div v-for="notification in items" :key="notification.id" class="notification">
      <span>{{ notification.message }}</span>
      <Button @click.native="close(notification)" theme="light" outline borderless><IconCancel/></Button>
    </div>
  </transition-group>
</template>

<script>
import IconCancel from "@/components/icons/IconCancel";
import Button from "@/components/buttons/Button";

export default {
  name: "Notifications",
  components: {
    IconCancel,
    Button
  },
  computed: {
    items() {
      return Object.values(this.$store.state.notifications);
    }
  },
  methods: {
    close(notification) {
      clearTimeout(notification.timeoutId);
      this.$store.dispatch("hideNotification", notification.id);
    }
  }
};
</script>

<style scoped lang="scss">
@import "../assets/styles/variables";

.notifications {
  position: fixed;
  bottom: 15px;
  left: 15px;
}

.notification {
  position: relative;
  max-width: 300px;
  background: rgba($color-text, 0.9);
  border-radius: 2px;
  padding: 11px 60px 11px 15px;
  color: #fff;
}

.notification + .notification {
  margin-top: 15px;
}

.notification > .button {
  position: absolute;
  margin-top: -15px;
  top: 50%;
  right: 5px;
}

.notification > .button > svg {
  width: 14px;
  height: 14px;
  margin-bottom: -2px;
}

.list-enter-active,
.list-leave-active {
  transition: all 0.5s;
}

.list-enter,
.list-leave-to /* .list-leave-active below version 2.1.8 */ {
  opacity: 0;
  transform: translateY(30px);
}
</style>
