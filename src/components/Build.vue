<template>
    <section>
        <div class="gutter">
            <Status :status="status" />
        </div>
        <div class="content">
            <div class="header">
                <h3>#{{ number }}. {{ message }}</h3>
            </div>
            <div class="metadata">
                <img :src="avatar" />
                <span class="author">{{ author }}</span>
                <span class="finished">{{ finished }}</span>
                <span class="duration">{{ duration }}</span>
                <span class="commit">{{ commit.substr(0, 8) }}</span>
                <span class="branch">{{ branch }}</span>
            </div>
        </div>
    </section>
</template>

<script>
import Status from "./Status.vue";

export default {
  name: "Build",
  props: {
    number: Number,
    event: String,
    status: String,
    message: String,
    commit: String,
    branch: String,
    reference: String,
    created: Number,
    started: Number,
    finished: Number,
    author: String,
    avatar: String,
  },
  components: {
    Status,
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
    align-items: stretch;
    background: #FFF;
    box-shadow: 0px 0px 8px 1px #e8eaed;
    border: 1px solid #e8eaed;
    border-radius: 3px;
    color: #8d97a2;
    display: flex;
    margin: 15px 0px;
    padding: 15px;
}

.gutter {
    width: 40px;
}

.status {
    background: #ff3e61;
    border-radius: 50%;
    width: 24px;
    height: 24px;
}

.status.success {
    background: #00d88a;
}

.status.pending,
.status.running {
    background: #ffd300;
}

.content {
    flex: 1;
}

h3 {
    color: #0064db;
    flex: 1;
    font-size: 15px;
    line-height: 24px;
    margin-bottom: 10px;
}

.metadata {
    align-items: center;
    display: inline-flex;
}

.metadata span {
    display: inline-block;
    font-size: 13px;
    margin-right: 10px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.message {
    width: 100px;
    max-width: 100px;
}

p {
    font-size: 13px;
}

img {
    border-radius: 50%;
    width: 24px;
    height: 24px;
    margin-right: 10px;
}
</style>
