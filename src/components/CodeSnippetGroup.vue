<template>
<div class="code-snippet-group">
  <slot></slot>
</div>
</template>

<style scoped>
.code-snippet-group {
  padding: 15px;
}
.code-snippet-group .code-snippet {
  margin-bottom: 15px;
}
.code-snippet-group .code-snippet:last-of-type {
  margin-bottom: 0px;
}
</style>
