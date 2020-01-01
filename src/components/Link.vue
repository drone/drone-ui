<template>
  <a class="link"><slot></slot></a>
</template>

<style lang="scss">
@import "../assets/styles/variables";
@import "../assets/styles/mixins";

.link {
  text-decoration: none;
  @include themed {
    color: tget("color-primary");
  }
}

.link:focus,
.link:hover {
  position: relative;
  outline: none;
  @include themed {
    color: tget("color-primary");
  }
}

.link:focus:after,
.link:hover:after {
  content: "";
  position: absolute;
  bottom: -2px;
  height: 1px;
  background-color: rgba(5, 100, 215, 0.5);
  right: 0;
  left: 0;
}
</style>
