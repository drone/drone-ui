<template>
<div class="code-snippet-group">
  <slot></slot>
</div>
</template>

<style scoped>
.code-snippet-group .code-snippet + .code-snippet {
  margin-top: 15px;
}
</style>
