<template>
<section class="card">
  <slot name="header"></slot>
  <slot></slot>
  <slot name="footer"></slot>
</section>
</template>

<style scoped>
section {
    border-radius: 3px;
    box-sizing: border-box;
    box-shadow: 0px 1px 4px 1px rgba(25, 45, 70, 0.02);
    border: solid 1px rgba(25, 45, 70, 0.08);
    background: #FFF;
}

header {
  height: 50px;
  border-bottom: solid 1px rgba(25, 45, 70, 0.05);
  display: flex;    
  align-items: center;
  padding: 0px 15px;
}

header h2 {
  height: 22px;
  font-size: 16px;
  font-weight: 600;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
  color: #192d46;
  padding: 0px;
}
</style>
