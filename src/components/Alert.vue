<template>
    <div v-bind:class="{ [variant]: true }">
        <slot></slot>
    </div>
</template>

<script>

const SUCCESS = "success";
const INFO = "info";
const WARNING = "warning";
const ERROR = "error";

export default {
  name: "Alert",
  props: {
    variant: String
  }
};
</script>

<style scoped>
div {
    background: #FFF;
    border: 1px solid #EEE;
    border-radius: 3px;
    font-size: 15px;
    padding: 30px;
    text-align: center;
}
small {
    color: #8f99a4;
    display: block;
    font-size: 14px;
    margin-top: 8px;
}
div.success {
    color: #00d88a;
}
div.info {}
div.warning {}
div.error {
    color: #ff3e61;
}
</style>
