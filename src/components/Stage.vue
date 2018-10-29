<template>
    <section>
        <header>
            <Status :status="status" />
            <span>{{ name }}</span>
            <time>0:00</time>
        </header>
        <slot></slot>
    </section>
</template>

<script>
import Status from "./Status.vue";

export default {
  name: "Stage",
  props: {
    name: String,
    os: String,
    arch: String,
    version: String,
    variant: String,
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
    background: #FFF;
    box-shadow: 0px 0px 8px 1px #e8eaed;
    border: 1px solid #e8eaed;
    border-radius: 3px;
    color: #8d97a2;
    margin: 15px 0px;
    user-select: none;
}

header {
    align-items: center;
    border-bottom: 1px solid #e8eaed;
    display: flex;
    padding: 15px;
    user-select: none;
}

span {
    color: #243650;
    padding: 0px 15px;
    flex: 1;
}

a:hover {
    background: #f3f4f6;
    display: block;
}
</style>
