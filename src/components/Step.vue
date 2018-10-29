<template>
    <section>
        <Status :status="status" :outlined="false" />
        <span>{{ name }}</span>
        <time>0:00</time>
    </section>
</template>

<script>
import Status from "./Status.vue";

export default {
  name: "Step",
  props: {
    name: String,
    number: Number,
    status: String,
    created: Number,
    started: Number,
    finished: Number,
  },
  components: {
      Status
  },
  computed: {
    duration() {
        return "";
    }
  }
};
</script>

<style scoped>
section {
    align-items: center;
    color: #8d97a2;
    display: flex;
    padding: 15px;
}

span {
    color: #243650;
    padding: 0px 15px;
    flex: 1;
    font-size: 14px;
}
</style>
