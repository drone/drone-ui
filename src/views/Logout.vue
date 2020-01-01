<template>
  <div class="container">
    <div class="logout">
      <h1>Your are now signed out</h1>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import "../assets/styles/mixins";

div.container {
  align-items: center;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  padding: 30px;
  height: 100%;
  width: 100%;

  @include themed {
    background: tget("body-color");
  }
}

.logout {
  width: 300px;
  border-radius: 3px;
  padding: 30px;

  @include themed {
    background: tget("surface-color");
  }
  @include themed-only(default) {
    border: 1px solid #e8eaed;
    box-shadow: 0px 0px 8px 1px #e8eaed;
  }
  @include themed-only(dark) {
    border: 1px solid tget("border-color");
    box-shadow: 0px 0px 8px 1px darken(tget("body-color"), 20%);
  }
}
</style>
