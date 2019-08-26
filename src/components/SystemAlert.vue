<template>
  <footer><slot></slot></footer>
</template>

<style scoped lang="scss">
@import "../assets/styles/variables";

footer {
  box-shadow: 0 -2px 6px 0px $border-color;
  position: fixed;
  bottom: 0px;
  left: 0px;
  right: 0px;
  height: 60px;
  min-height: 60px;
  max-height: 60px;
  background: #ff4164;
  color: #fff;
  z-index: 2;
  font-size: 14px;
  text-align: center;
  display: flex;
  justify-content: center;
  text-transform: uppercase;
  align-items: center;
}

footer a {
  background: rgba(255,255,255,0.15);
  border-radius: 3px;
  color: #ffffff;
  margin-left: 20px;
  padding: 10px 20px;
}
</style>
