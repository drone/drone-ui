<template>
  <footer><slot></slot></footer>
</template>

<style scoped>
footer {
  box-shadow: 0 -2px 6px 0px rgba(25, 45, 70, 0.05);
  position: fixed;
  bottom: 0px;
  left: 0px;
  right: 0px;
  height: 60px;
  min-height: 60px;
  max-height: 60px;
  background: #ff4164;
  color: #FFF;
  z-index: 2;
  font-size:14px;
  text-align:center;
  display: flex;
  justify-content: center;
  text-transform: uppercase;
  align-items: center;
}
</style>
