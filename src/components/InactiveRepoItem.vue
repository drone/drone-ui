<template>
    <div>
        <h3>{{ namespace }}/{{ name }}</h3>
        <span>View</span>
    </div>
</template>

<script>
export default {
  name: "InactiveRepoItem",
  props: {
    namespace: String,
    name: String
  }
};
</script>

<style scoped>
div {
    align-items: center;
    background: #FFF;
    box-shadow: 0px 0px 8px 2px #e8eaed;
    border: 1px solid #e3e5e9;
    border-radius: 3px;
    display: flex;
    margin: 15px 0px;
    padding: 15px;
}

h3 {
    color: #8c96a2;
    flex: 1;
    font-size: 15px;
}

span {
    background: none;
    border: none;
    color: #0f6cdd;
    cursor: pointer;
    display: block;
    font-size: 15px;
    outline: none;
    text-transform: uppercase;
    text-align: right;
}
</style>
